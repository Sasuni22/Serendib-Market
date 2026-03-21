// ============================================================
// Controllers/OrdersController.cs
// ============================================================
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MultiVendorShop.Data;
using MultiVendorShop.DTOs;
using MultiVendorShop.Models;

namespace MultiVendorShop.Controllers;

[ApiController]
[Route("api/orders")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private static readonly Random _rng = new(); // static — avoids duplicate seeds

    public OrdersController(AppDbContext db) => _db = db;

    private int    CurrentUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
    private string CurrentRole()   =>
        User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    // ── PLACE ORDER ───────────────────────────────────────────
    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
    {
        var cid      = CurrentUserId();
        var customer = await _db.Customers.FindAsync(cid);
        if (customer == null)
            return NotFound(new { message = "Customer not found." });

        // Resolve line items — from request body OR from cart
        List<(int ProductId, int Quantity)> lines;

        if (dto.Items != null && dto.Items.Count > 0)
        {
            lines = dto.Items.Select(i => (i.ProductId, i.Quantity)).ToList();
        }
        else
        {
            var cart = await _db.CartItems
                .Where(ci => ci.CustomerId == cid)
                .ToListAsync();

            if (!cart.Any())
                return BadRequest(new { message = "Your cart is empty." });

            lines = cart.Select(ci => (ci.ProductId, ci.Quantity)).ToList();
        }

        if (!lines.Any())
            return BadRequest(new { message = "No items to order." });

        // Validate stock and build order items
        var orderItems = new List<OrderItem>();
        decimal total  = 0;

        foreach (var (productId, qty) in lines)
        {
            if (qty <= 0)
                return BadRequest(new { message = "Quantity must be at least 1." });

            var product = await _db.Products
                .Include(p => p.Vendor)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                return BadRequest(new { message = $"Product ID {productId} not found." });

            if (!product.IsAvailable)
                return BadRequest(new { message = $"'{product.Name}' is no longer available." });

            if (product.Stock < qty)
                return BadRequest(new
                {
                    message = $"'{product.Name}' only has {product.Stock} unit(s) in stock."
                });

            // Deduct stock immediately
            product.Stock -= qty;
            total         += product.Price * qty;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                VendorId  = product.VendorId,
                Quantity  = qty,
                UnitPrice = product.Price  // freeze price at purchase time
            });
        }

        // Generate unique order number
        var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{_rng.Next(1000, 9999)}";

        var order = new Order
        {
            OrderNumber     = orderNumber,
            CustomerId      = cid,
            DeliveryAddress = string.IsNullOrWhiteSpace(dto.DeliveryAddress)
                                ? customer.DeliveryAddress
                                : dto.DeliveryAddress,
            Notes           = dto.Notes ?? string.Empty,
            TotalAmount     = total,
            Status          = OrderStatus.Pending,
            OrderDate       = DateTime.UtcNow,
            OrderItems      = orderItems
        };

        _db.Orders.Add(order);

        // Clear cart after successful checkout
        var cartToRemove = _db.CartItems.Where(ci => ci.CustomerId == cid);
        _db.CartItems.RemoveRange(cartToRemove);

        await _db.SaveChangesAsync();

        // Load full order with navigation properties for response
        var created = await _db.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Vendor)
            .FirstAsync(o => o.Id == order.Id);

        return CreatedAtAction(nameof(GetById),
            new { id = order.Id }, MapOrder(created));
    }

    // ── MY ORDERS ─────────────────────────────────────────────
    [HttpGet]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetMyOrders()
    {
        var cid    = CurrentUserId();
        var orders = await LoadOrders(o => o.CustomerId == cid);
        return Ok(orders.OrderByDescending(o => o.OrderDate).Select(MapOrder));
    }

    // ── ORDER DETAIL ──────────────────────────────────────────
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Vendor)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        var uid  = CurrentUserId();
        var role = CurrentRole();

        bool authorized = role == "Customer"
            ? order.CustomerId == uid
            : order.OrderItems.Any(oi => oi.VendorId == uid);

        if (!authorized) return Forbid();

        return Ok(MapOrder(order));
    }

    // ── VENDOR ORDERS ─────────────────────────────────────────
    [HttpGet("vendor")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> GetVendorOrders(
        [FromQuery] string? status)
    {
        var vid    = CurrentUserId();
        var orders = await LoadOrders(
            o => o.OrderItems.Any(oi => oi.VendorId == vid));

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<OrderStatus>(status, true, out var s))
        {
            orders = orders.Where(o => o.Status == s).ToList();
        }

        return Ok(orders.OrderByDescending(o => o.OrderDate).Select(MapOrder));
    }

    // ── UPDATE STATUS ─────────────────────────────────────────
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> UpdateStatus(
        int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var vid   = CurrentUserId();
        var order = await _db.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (!order.OrderItems.Any(oi => oi.VendorId == vid))
            return Forbid();

        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
            return BadRequest(new { message = $"Invalid status '{dto.Status}'." });

        order.Status = newStatus;
        await _db.SaveChangesAsync();

        return Ok(new { message = $"Order {id} updated to {newStatus}." });
    }

    // ── CANCEL ORDER ──────────────────────────────────────────
    [HttpDelete("{id:int}/cancel")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var cid   = CurrentUserId();
        var order = await _db.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id && o.CustomerId == cid);

        if (order == null)
            return NotFound(new { message = $"Order {id} not found." });

        if (order.Status != OrderStatus.Pending &&
            order.Status != OrderStatus.Confirmed)
            return BadRequest(new
            {
                message = "Only Pending or Confirmed orders can be cancelled."
            });

        // Restore stock for all items
        foreach (var item in order.OrderItems)
        {
            if (item.Product != null)
                item.Product.Stock += item.Quantity;
        }

        order.Status = OrderStatus.Cancelled;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Order {order.OrderNumber} cancelled. Stock restored."
        });
    }

    // ── Helpers ───────────────────────────────────────────────
    private async Task<List<Order>> LoadOrders(
        System.Linq.Expressions.Expression<Func<Order, bool>> predicate)
    {
        return await _db.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Vendor)
            .Where(predicate)
            .ToListAsync();
    }

    private static OrderResponseDto MapOrder(Order o) => new()
    {
        Id              = o.Id,
        OrderNumber     = o.OrderNumber,
        OrderDate       = o.OrderDate,
        Status          = o.Status.ToString(),
        TotalAmount     = o.TotalAmount,
        DeliveryAddress = o.DeliveryAddress,
        Notes           = o.Notes,
        CustomerId      = o.CustomerId,
        CustomerName    = o.Customer?.FullName ?? string.Empty,
        Items           = o.OrderItems.Select(oi => new OrderItemResponseDto
        {
            ProductId   = oi.ProductId,
            ProductName = oi.Product?.Name    ?? string.Empty,
            VendorName  = oi.Vendor?.ShopName ?? string.Empty,
            Quantity    = oi.Quantity,
            UnitPrice   = oi.UnitPrice,
            Subtotal    = oi.Quantity * oi.UnitPrice
        }).ToList()
    };
}
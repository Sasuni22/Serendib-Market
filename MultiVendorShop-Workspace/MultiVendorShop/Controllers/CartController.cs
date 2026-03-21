// ============================================================
// Controllers/CartController.cs
// GET    /api/cart
// POST   /api/cart
// DELETE /api/cart/{cartItemId}
// DELETE /api/cart
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
[Route("api/cart")]
[Authorize(Roles = "Customer")]
[Produces("application/json")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;
    public CartController(AppDbContext db) => _db = db;

    private int CurrentCustomerId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    // ── VIEW CART ─────────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var cid   = CurrentCustomerId();
        var items = await _db.CartItems
            .Include(ci => ci.Product)
                .ThenInclude(p => p.Vendor)
            .Where(ci => ci.CustomerId == cid)
            .ToListAsync();

        return Ok(new CartResponseDto
        {
            Items = items.Select(ci => new CartItemResponseDto
            {
                CartItemId     = ci.Id,
                ProductId      = ci.ProductId,
                ProductName    = ci.Product.Name,
                VendorName     = ci.Product.Vendor.ShopName,
                UnitPrice      = ci.Product.Price,
                Quantity       = ci.Quantity,
                Subtotal       = ci.Product.Price * ci.Quantity,
                AvailableStock = ci.Product.Stock
            }).ToList(),
            TotalAmount = items.Sum(ci => ci.Product.Price * ci.Quantity),
            TotalItems  = items.Sum(ci => ci.Quantity)
        });
    }

    // ── ADD / UPDATE ──────────────────────────────────────────
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Quantity must be at least 1." });

        var cid     = CurrentCustomerId();
        var product = await _db.Products
            .Include(p => p.Vendor)
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.IsAvailable);

        if (product == null)
            return NotFound(new { message = "Product not found or unavailable." });

        if (product.Stock < dto.Quantity)
            return BadRequest(new { message = $"Only {product.Stock} units in stock." });

        var existing = await _db.CartItems.FirstOrDefaultAsync(
            ci => ci.CustomerId == cid && ci.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity = dto.Quantity;
            existing.AddedAt  = DateTime.UtcNow;
        }
        else
        {
            _db.CartItems.Add(new CartItem
            {
                CustomerId = cid,
                ProductId  = dto.ProductId,
                Quantity   = dto.Quantity
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Cart updated.", productName = product.Name });
    }

    // ── REMOVE ITEM ───────────────────────────────────────────
    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var item = await _db.CartItems.FirstOrDefaultAsync(
            ci => ci.Id == cartItemId && ci.CustomerId == CurrentCustomerId());

        if (item == null)
            return NotFound(new { message = "Cart item not found." });

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Item removed." });
    }

    // ── CLEAR CART ────────────────────────────────────────────
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var cid   = CurrentCustomerId();
        var items = _db.CartItems.Where(ci => ci.CustomerId == cid);
        _db.CartItems.RemoveRange(items);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Cart cleared." });
    }
}
// ============================================================
// Controllers/VendorsController.cs
// GET    /api/vendors
// GET    /api/vendors/{id}
// PUT    /api/vendors/{id}
// DELETE /api/vendors/{id}
// GET    /api/vendors/{id}/products
// GET    /api/vendors/{id}/sales
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
[Route("api/vendors")]
[Produces("application/json")]
public class VendorsController : ControllerBase
{
    private readonly AppDbContext _db;
    public VendorsController(AppDbContext db) => _db = db;

    private int CurrentVendorId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    // ── GET ALL ───────────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Load first, then project in-memory.
        // Avoids EF Core translation issue with filtered .Count()
        // on a navigation collection inside a SQL projection.
        var vendors = await _db.Vendors
            .Include(v => v.Products)
            .Where(v => v.IsActive)
            .ToListAsync();

        return Ok(vendors.Select(v => new VendorResponseDto
        {
            Id            = v.Id,
            ShopName      = v.ShopName,
            Email         = v.Email,
            Phone         = v.Phone,
            Address       = v.Address,
            IsActive      = v.IsActive,
            CreatedAt     = v.CreatedAt,
            TotalProducts = v.Products.Count(p => p.IsAvailable)
        }));
    }

    // ── GET BY ID ─────────────────────────────────────────────
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var v = await _db.Vendors
            .Include(v => v.Products)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (v == null)
            return NotFound(new { message = $"Vendor {id} not found." });

        return Ok(new VendorResponseDto
        {
            Id            = v.Id,
            ShopName      = v.ShopName,
            Email         = v.Email,
            Phone         = v.Phone,
            Address       = v.Address,
            IsActive      = v.IsActive,
            CreatedAt     = v.CreatedAt,
            TotalProducts = v.Products.Count(p => p.IsAvailable)
        });
    }

    // ── UPDATE ────────────────────────────────────────────────
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> Update(
        int id, [FromBody] VendorRegisterDto dto)
    {
        if (id != CurrentVendorId()) return Forbid();

        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor == null) return NotFound();

        vendor.ShopName = dto.ShopName;
        vendor.Phone    = dto.Phone;
        vendor.Address  = dto.Address;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            vendor.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _db.SaveChangesAsync();
        return Ok(new { message = "Profile updated." });
    }

    // ── DEACTIVATE ────────────────────────────────────────────
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> Deactivate(int id)
    {
        if (id != CurrentVendorId()) return Forbid();

        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor == null) return NotFound();

        vendor.IsActive = false;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Account deactivated." });
    }

    // ── VENDOR PRODUCTS (public) ──────────────────────────────
    [HttpGet("{id:int}/products")]
    public async Task<IActionResult> GetVendorProducts(int id)
    {
        if (!await _db.Vendors.AnyAsync(v => v.Id == id))
            return NotFound(new { message = $"Vendor {id} not found." });

        var products = await _db.Products
            .Where(p => p.VendorId == id && p.IsAvailable)
            .Select(p => new ProductResponseDto
            {
                Id          = p.Id,
                Name        = p.Name,
                Description = p.Description,
                Price       = p.Price,
                Stock       = p.Stock,
                Category    = p.Category,
                ImageUrl    = p.ImageUrl,
                IsAvailable = p.IsAvailable,
                VendorId    = p.VendorId,
                VendorName  = p.Vendor.ShopName,
                CreatedAt   = p.CreatedAt
            })
            .ToListAsync();

        return Ok(products);
    }

    // ── SALES REPORT ─────────────────────────────────────────
    [HttpGet("{id:int}/sales")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> GetSales(int id)
    {
        if (id != CurrentVendorId()) return Forbid();

        var vendor = await _db.Vendors.FindAsync(id);
        if (vendor == null) return NotFound();

        var orderItems = await _db.OrderItems
            .Include(oi => oi.Product)
            .Include(oi => oi.Order)
            .Where(oi => oi.VendorId == id &&
                         oi.Order.Status != OrderStatus.Cancelled)
            .ToListAsync();

        var productSales = orderItems
            .GroupBy(oi => oi.ProductId)
            .Select(g => new ProductSalesDto
            {
                ProductId   = g.Key,
                ProductName = g.First().Product.Name,
                UnitsSold   = g.Sum(oi => oi.Quantity),
                Revenue     = g.Sum(oi => oi.Quantity * oi.UnitPrice)
            })
            .OrderByDescending(ps => ps.Revenue)
            .ToList();

        return Ok(new VendorSalesDto
        {
            VendorId        = vendor.Id,
            ShopName        = vendor.ShopName,
            TotalRevenue    = productSales.Sum(ps => ps.Revenue),
            TotalOrderItems = orderItems.Count,
            TotalUnitsSold  = orderItems.Sum(oi => oi.Quantity),
            ProductSales    = productSales
        });
    }
}
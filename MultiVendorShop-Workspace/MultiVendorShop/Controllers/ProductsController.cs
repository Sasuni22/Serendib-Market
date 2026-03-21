// ============================================================
// Controllers/ProductsController.cs
// GET    /api/products
// GET    /api/products/{id}
// GET    /api/products/categories
// POST   /api/products
// PUT    /api/products/{id}
// DELETE /api/products/{id}
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
[Route("api/products")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    private int CurrentVendorId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    // ── BROWSE ────────────────────────────────────────────────
    // ?category= ?vendorId= ?minPrice= ?maxPrice= ?search= ?page= ?pageSize=
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string?  category,
        [FromQuery] int?     vendorId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string?  search,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 10)
    {
        var q = _db.Products
            .Include(p => p.Vendor)
            .Where(p => p.IsAvailable && p.Vendor.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            q = q.Where(p => p.Category == category);
        if (vendorId.HasValue)
            q = q.Where(p => p.VendorId == vendorId.Value);
        if (minPrice.HasValue)
            q = q.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue)
            q = q.Where(p => p.Price <= maxPrice.Value);
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(p =>
                p.Name.Contains(search) || p.Description.Contains(search));

        var total = await q.CountAsync();
        var items = await q
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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

        return Ok(new
        {
            TotalCount = total,
            Page       = page,
            PageSize   = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize),
            Items      = items
        });
    }

    // ── GET BY ID ─────────────────────────────────────────────
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _db.Products
            .Include(p => p.Vendor)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (p == null)
            return NotFound(new { message = $"Product {id} not found." });

        return Ok(new ProductResponseDto
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
        });
    }

    // ── CATEGORIES ────────────────────────────────────────────
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() =>
        Ok(await _db.Products
            .Where(p => p.IsAvailable)
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync());

    // ── CREATE ────────────────────────────────────────────────
    [HttpPost]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var vendorId = CurrentVendorId();
        var vendor   = await _db.Vendors.FindAsync(vendorId);
        if (vendor == null || !vendor.IsActive) return Forbid();

        var product = new Product
        {
            Name        = dto.Name,
            Description = dto.Description,
            Price       = dto.Price,
            Stock       = dto.Stock,
            Category    = dto.Category,
            ImageUrl    = dto.ImageUrl,
            VendorId    = vendorId
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id },
            new ProductResponseDto
            {
                Id          = product.Id,
                Name        = product.Name,
                Description = product.Description,
                Price       = product.Price,
                Stock       = product.Stock,
                Category    = product.Category,
                ImageUrl    = product.ImageUrl,
                IsAvailable = product.IsAvailable,
                VendorId    = product.VendorId,
                VendorName  = vendor.ShopName,
                CreatedAt   = product.CreatedAt
            });
    }

    // ── UPDATE ────────────────────────────────────────────────
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> Update(
        int id, [FromBody] UpdateProductDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        if (product.VendorId != CurrentVendorId()) return Forbid();

        if (dto.Name        != null) product.Name        = dto.Name;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.Price       != null) product.Price       = dto.Price.Value;
        if (dto.Stock       != null) product.Stock       = dto.Stock.Value;
        if (dto.Category    != null) product.Category    = dto.Category;
        if (dto.ImageUrl    != null) product.ImageUrl    = dto.ImageUrl;
        if (dto.IsAvailable != null) product.IsAvailable = dto.IsAvailable.Value;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Product updated.", productId = id });
    }

    // ── DELETE ────────────────────────────────────────────────
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Vendor")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();
        if (product.VendorId != CurrentVendorId()) return Forbid();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Product deleted." });
    }
}
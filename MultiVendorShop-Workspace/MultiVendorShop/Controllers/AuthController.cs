// ============================================================
// Controllers/AuthController.cs
// POST /api/auth/vendor/register    POST /api/auth/vendor/login
// POST /api/auth/customer/register  POST /api/auth/customer/login
// ============================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MultiVendorShop.Data;
using MultiVendorShop.DTOs;
using MultiVendorShop.Models;
using MultiVendorShop.Services;

namespace MultiVendorShop.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtService  _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db  = db;
        _jwt = jwt;
    }

    // ── Vendor Register ───────────────────────────────────────
    [HttpPost("vendor/register")]
    public async Task<IActionResult> RegisterVendor(
        [FromBody] VendorRegisterDto dto)
    {
        if (await _db.Vendors.AnyAsync(v => v.Email == dto.Email))
            return Conflict(new { message = "Email already registered." });

        var vendor = new Vendor
        {
            ShopName     = dto.ShopName,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone        = dto.Phone,
            Address      = dto.Address
        };
        _db.Vendors.Add(vendor);
        await _db.SaveChangesAsync();

        return Ok(BuildAuth(vendor.Id, vendor.Email, "Vendor", vendor.ShopName));
    }

    // ── Vendor Login ──────────────────────────────────────────
    [HttpPost("vendor/login")]
    public async Task<IActionResult> LoginVendor([FromBody] LoginDto dto)
    {
        var v = await _db.Vendors
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (v == null || !BCrypt.Net.BCrypt.Verify(dto.Password, v.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        if (!v.IsActive) return Forbid();

        return Ok(BuildAuth(v.Id, v.Email, "Vendor", v.ShopName));
    }

    // ── Customer Register ─────────────────────────────────────
    [HttpPost("customer/register")]
    public async Task<IActionResult> RegisterCustomer(
        [FromBody] CustomerRegisterDto dto)
    {
        if (await _db.Customers.AnyAsync(c => c.Email == dto.Email))
            return Conflict(new { message = "Email already registered." });

        var customer = new Customer
        {
            FullName        = dto.FullName,
            Email           = dto.Email,
            PasswordHash    = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone           = dto.Phone,
            DeliveryAddress = dto.DeliveryAddress
        };
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();

        return Ok(BuildAuth(
            customer.Id, customer.Email, "Customer", customer.FullName));
    }

    // ── Customer Login ────────────────────────────────────────
    [HttpPost("customer/login")]
    public async Task<IActionResult> LoginCustomer([FromBody] LoginDto dto)
    {
        var c = await _db.Customers
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (c == null || !BCrypt.Net.BCrypt.Verify(dto.Password, c.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(BuildAuth(c.Id, c.Email, "Customer", c.FullName));
    }

    // ── Helper ────────────────────────────────────────────────
    private AuthResponseDto BuildAuth(
        int id, string email, string role, string name) => new()
    {
        Token     = _jwt.GenerateToken(id, email, role, name),
        Role      = role,
        UserId    = id,
        Name      = name,
        ExpiresAt = DateTime.UtcNow.AddDays(7)
    };
}
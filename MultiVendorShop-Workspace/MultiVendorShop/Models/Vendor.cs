// ============================================================
// Models/Vendor.cs
// Represents a vendor who sells products on the platform
// ============================================================
namespace MultiVendorShop.Models;

public class Vendor
{
    public int    Id           { get; set; }
    public string ShopName     { get; set; } = string.Empty;
    public string Email        { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Phone        { get; set; } = string.Empty;
    public string Address      { get; set; } = string.Empty;
    public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;
    public bool   IsActive     { get; set; } = true;

    // Navigation
    public ICollection<Product>   Products   { get; set; } = new List<Product>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
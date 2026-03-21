// ============================================================
// Models/Product.cs
// Represents a product listed by a vendor
// ============================================================
namespace MultiVendorShop.Models;

public class Product
{
    public int     Id          { get; set; }
    public string  Name        { get; set; } = string.Empty;
    public string  Description { get; set; } = string.Empty;
    /// <summary>Price in Sri Lankan Rupees (LKR)</summary>
    public decimal Price       { get; set; }
    public int     Stock       { get; set; }
    public string  Category    { get; set; } = string.Empty;
    public string  ImageUrl    { get; set; } = string.Empty;
    public bool    IsAvailable { get; set; } = true;
    public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;

    // Foreign key — each product belongs to one vendor
    public int    VendorId { get; set; }
    public Vendor Vendor   { get; set; } = null!;

    // Navigation
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<CartItem>  CartItems  { get; set; } = new List<CartItem>();
}
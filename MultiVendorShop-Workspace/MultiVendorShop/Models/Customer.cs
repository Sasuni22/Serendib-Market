// ============================================================
// Models/Customer.cs
// Represents a customer who browses and places orders
// ============================================================
namespace MultiVendorShop.Models;

public class Customer
{
    public int    Id              { get; set; }
    public string FullName        { get; set; } = string.Empty;
    public string Email           { get; set; } = string.Empty;
    public string PasswordHash    { get; set; } = string.Empty;
    public string Phone           { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime CreatedAt     { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Order>    Orders    { get; set; } = new List<Order>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
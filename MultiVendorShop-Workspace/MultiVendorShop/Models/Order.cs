// ============================================================
// Models/Order.cs
// Contains Order, OrderItem, and CartItem models
// ============================================================
namespace MultiVendorShop.Models;

public enum OrderStatus
{
    Pending,      // Order placed, awaiting vendor confirmation
    Confirmed,    // Vendor accepted the order
    Processing,   // Order being prepared
    Shipped,      // Order dispatched
    Delivered,    // Order received by customer
    Cancelled     // Order cancelled
}

public class Order
{
    public int         Id              { get; set; }
    public string      OrderNumber     { get; set; } = string.Empty;
    public DateTime    OrderDate       { get; set; } = DateTime.UtcNow;
    public OrderStatus Status          { get; set; } = OrderStatus.Pending;
    /// <summary>Total order value in LKR</summary>
    public decimal     TotalAmount     { get; set; }
    public string      DeliveryAddress { get; set; } = string.Empty;
    public string      Notes           { get; set; } = string.Empty;

    public int      CustomerId { get; set; }
    public Customer Customer   { get; set; } = null!;

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int     Id        { get; set; }
    public int     Quantity  { get; set; }
    /// <summary>Price frozen at purchase time (LKR)</summary>
    public decimal UnitPrice { get; set; }

    public int   OrderId   { get; set; }
    public Order Order     { get; set; } = null!;

    public int     ProductId { get; set; }
    public Product Product   { get; set; } = null!;

    public int    VendorId { get; set; }
    public Vendor Vendor   { get; set; } = null!;
}

public class CartItem
{
    public int      Id         { get; set; }
    public int      Quantity   { get; set; }
    public DateTime AddedAt    { get; set; } = DateTime.UtcNow;

    public int      CustomerId { get; set; }
    public Customer Customer   { get; set; } = null!;

    public int     ProductId { get; set; }
    public Product Product   { get; set; } = null!;
}
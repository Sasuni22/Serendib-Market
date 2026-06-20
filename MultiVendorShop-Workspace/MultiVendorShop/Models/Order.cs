
namespace MultiVendorShop.Models;

public enum OrderStatus
{
    Pending,      
    Confirmed,    
    Processing,   
    Shipped,       
    Delivered,    
    Cancelled     
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

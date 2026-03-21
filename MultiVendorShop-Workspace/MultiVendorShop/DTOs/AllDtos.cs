// ============================================================
// DTOs/AllDtos.cs  —  all request & response shapes
// ============================================================
namespace MultiVendorShop.DTOs;

// ── Auth ──────────────────────────────────────────────────────
public class VendorRegisterDto
{
    public string ShopName { get; set; } = string.Empty;
    public string Email    { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone    { get; set; } = string.Empty;
    public string Address  { get; set; } = string.Empty;
}

public class CustomerRegisterDto
{
    public string FullName        { get; set; } = string.Empty;
    public string Email           { get; set; } = string.Empty;
    public string Password        { get; set; } = string.Empty;
    public string Phone           { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
}

public class LoginDto
{
    public string Email    { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string   Token     { get; set; } = string.Empty;
    public string   Role      { get; set; } = string.Empty;
    public int      UserId    { get; set; }
    public string   Name      { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

// ── Products ──────────────────────────────────────────────────
public class CreateProductDto
{
    public string  Name        { get; set; } = string.Empty;
    public string  Description { get; set; } = string.Empty;
    /// <summary>Price in LKR</summary>
    public decimal Price       { get; set; }
    public int     Stock       { get; set; }
    public string  Category    { get; set; } = string.Empty;
    public string  ImageUrl    { get; set; } = string.Empty;
}

public class UpdateProductDto
{
    public string?  Name        { get; set; }
    public string?  Description { get; set; }
    public decimal? Price       { get; set; }
    public int?     Stock       { get; set; }
    public string?  Category    { get; set; }
    public string?  ImageUrl    { get; set; }
    public bool?    IsAvailable { get; set; }
}

public class ProductResponseDto
{
    public int      Id          { get; set; }
    public string   Name        { get; set; } = string.Empty;
    public string   Description { get; set; } = string.Empty;
    public decimal  Price       { get; set; }   // LKR
    public int      Stock       { get; set; }
    public string   Category    { get; set; } = string.Empty;
    public string   ImageUrl    { get; set; } = string.Empty;
    public bool     IsAvailable { get; set; }
    public int      VendorId    { get; set; }
    public string   VendorName  { get; set; } = string.Empty;
    public DateTime CreatedAt   { get; set; }
}

// ── Orders ────────────────────────────────────────────────────
public class PlaceOrderDto
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Notes           { get; set; } = string.Empty;
    // If null/empty — checkout the entire cart
    public List<OrderItemRequestDto>? Items { get; set; }
}

public class OrderItemRequestDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; }
}

public class OrderResponseDto
{
    public int      Id              { get; set; }
    public string   OrderNumber     { get; set; } = string.Empty;
    public DateTime OrderDate       { get; set; }
    public string   Status          { get; set; } = string.Empty;
    public decimal  TotalAmount     { get; set; }  // LKR
    public string   DeliveryAddress { get; set; } = string.Empty;
    public string   Notes           { get; set; } = string.Empty;
    public int      CustomerId      { get; set; }
    public string   CustomerName    { get; set; } = string.Empty;
    public List<OrderItemResponseDto> Items { get; set; } = new();
}

public class OrderItemResponseDto
{
    public int     ProductId   { get; set; }
    public string  ProductName { get; set; } = string.Empty;
    public string  VendorName  { get; set; } = string.Empty;
    public int     Quantity    { get; set; }
    public decimal UnitPrice   { get; set; }  // LKR
    public decimal Subtotal    { get; set; }  // LKR
}

public class UpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
}

// ── Cart ──────────────────────────────────────────────────────
public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; }
}

public class CartResponseDto
{
    public List<CartItemResponseDto> Items       { get; set; } = new();
    public decimal                   TotalAmount { get; set; }  // LKR
    public int                       TotalItems  { get; set; }
}

public class CartItemResponseDto
{
    public int     CartItemId     { get; set; }
    public int     ProductId      { get; set; }
    public string  ProductName    { get; set; } = string.Empty;
    public string  VendorName     { get; set; } = string.Empty;
    public decimal UnitPrice      { get; set; }  // LKR
    public int     Quantity       { get; set; }
    public decimal Subtotal       { get; set; }  // LKR
    public int     AvailableStock { get; set; }
}

// ── Vendors ───────────────────────────────────────────────────
public class VendorResponseDto
{
    public int      Id            { get; set; }
    public string   ShopName      { get; set; } = string.Empty;
    public string   Email         { get; set; } = string.Empty;
    public string   Phone         { get; set; } = string.Empty;
    public string   Address       { get; set; } = string.Empty;
    public bool     IsActive      { get; set; }
    public DateTime CreatedAt     { get; set; }
    public int      TotalProducts { get; set; }
}

public class VendorSalesDto
{
    public int     VendorId        { get; set; }
    public string  ShopName        { get; set; } = string.Empty;
    public decimal TotalRevenue    { get; set; }  // LKR
    public int     TotalOrderItems { get; set; }
    public int     TotalUnitsSold  { get; set; }
    public List<ProductSalesDto> ProductSales { get; set; } = new();
}

public class ProductSalesDto
{
    public int     ProductId   { get; set; }
    public string  ProductName { get; set; } = string.Empty;
    public int     UnitsSold   { get; set; }
    public decimal Revenue     { get; set; }  // LKR
}
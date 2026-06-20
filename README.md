# 🛍️ Multi-Vendor Specialty Shop API

A RESTful Web API built with **ASP.NET Core 7**, **Entity Framework Core**, and **SQLite** for a Multi-Vendor Specialty Shop platform.

## 📌 Project Overview

This system allows multiple vendors to register and manage their products while customers can browse products and place orders.

### Key Features

- Multiple vendor management
- Product management (CRUD)
- Order management (CRUD)
- Entity Framework Core integration
- SQLite database
- Swagger API documentation
- Sample data seeded automatically
- Vendor sales tracking
- Ready for JWT authentication integration

---

# 🛠 Technology Stack

- ASP.NET Core 7
- C#
- Entity Framework Core
- SQLite
- Swagger/OpenAPI
- REST API Architecture

---

# 📂 Project Structure

```
MultiVendorShopAPI
│
├── Controllers
│   ├── VendorsController.cs
│   ├── ProductsController.cs
│   └── OrdersController.cs
│
├── Models
│   ├── Vendor.cs
│   ├── Product.cs
│   ├── Order.cs
│   └── OrderItem.cs
│
├── Data
│   └── ShopDbContext.cs
│
├── Program.cs
├── appsettings.json
├── MultiVendorShopAPI.csproj
└── README.md
```

---

# 🚀 Features

## Vendor Management

- Register vendors
- View vendors
- Update vendor details
- Delete vendors
- View vendor products
- Track sales

## Product Management

Each product contains:

- Name
- Price (LKR)
- Stock
- VendorId

Operations:

- Create product
- Read product
- Update product
- Delete product

## Order Management

Customers can:

- Browse products
- Place orders
- View order history

Orders contain:

- Customer Name
- Order Date
- Total Amount
- Order Items

---

# 💰 Sample Data

### Vendors

| Id | Vendor Name |
|----|------------|
| 1 | Ceylon Spice House |
| 2 | Tea Paradise |
| 3 | Lankan Crafts |

### Products

| Product | Price (LKR) | Stock |
|----------|------------|-------|
| Ceylon Cinnamon | 1500 | 100 |
| Premium Tea Pack | 2500 | 50 |
| Wooden Elephant Craft | 3500 | 20 |
| Organic Pepper | 1200 | 80 |
| Herbal Tea Collection | 2800 | 40 |

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/MultiVendorShopAPI.git
cd MultiVendorShopAPI
```

## 2. Restore Packages

```bash
dotnet restore
```

## 3. Create Migration

```bash
dotnet ef migrations add InitialCreate
```

## 4. Update Database

```bash
dotnet ef database update
```

## 5. Run Project

```bash
dotnet run
```

---

# 📖 Swagger

After running the project:

```
https://localhost:5001/swagger
```

Use Swagger UI to test all API endpoints.

---

# 🔗 API Endpoints

## Vendors

### Get All Vendors

```http
GET /api/vendors
```

### Get Vendor By Id

```http
GET /api/vendors/{id}
```

### Create Vendor

```http
POST /api/vendors
```

Example:

```json
{
  "name": "New Vendor",
  "email": "vendor@example.com"
}
```

### Update Vendor

```http
PUT /api/vendors/{id}
```

### Delete Vendor

```http
DELETE /api/vendors/{id}
```

---

## Products

### Get All Products

```http
GET /api/products
```

### Get Product By Id

```http
GET /api/products/{id}
```

### Create Product

```http
POST /api/products
```

Example:

```json
{
  "name": "Organic Cinnamon",
  "price": 1800,
  "stock": 50,
  "vendorId": 1
}
```

### Update Product

```http
PUT /api/products/{id}
```

### Delete Product

```http
DELETE /api/products/{id}
```

---

## Orders

### Get All Orders

```http
GET /api/orders
```

### Get Order By Id

```http
GET /api/orders/{id}
```

### Create Order

```http
POST /api/orders
```

Example:

```json
{
  "customerName": "Nimal",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

### Update Order

```http
PUT /api/orders/{id}
```

### Delete Order

```http
DELETE /api/orders/{id}
```

---

# 📊 Vendor Sales Tracking

Example endpoint:

```http
GET /api/vendors/{vendorId}/sales
```

Example response:

```json
{
  "vendorId": 1,
  "vendorName": "Ceylon Spice House",
  "totalSales": 45000
}
```

---

# 🗄 Database Entities

## Vendor

```csharp
public class Vendor
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    public ICollection<Product> Products { get; set; }
}
```

## Product

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int VendorId { get; set; }

    public Vendor Vendor { get; set; }
}
```

## Order

```csharp
public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }

    public ICollection<OrderItem> Items { get; set; }
}
```

---

# 🔐 Future Enhancements

- JWT Authentication
- Customer Accounts
- Shopping Cart Persistence
- Product Categories
- Product Reviews
- Payment Gateway Integration
- Image Upload Support
- Analytics Dashboard
- Inventory Notifications

---



# 📄 License

This project is provided for educational and learning purposes. You are free to modify and extend it according to your requirements.

# 🛍️ Multi-Vendor Shop

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



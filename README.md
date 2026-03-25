# 🛍️ Serendib Market

A full-stack multi-vendor e-commerce platform for Sri Lankan specialty products.

![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![Angular](https://img.shields.io/badge/Angular-17-red)
![Railway](https://img.shields.io/badge/Deployed-Railway-blue)

## 🌐 Live Demo

- **Frontend:** https://serendib-market-live.up.railway.app/
- **Backend API:** https://serendib-market-production.up.railway.app/index.html
- **Swagger UI:** https://serendib-market-production.up.railway.app/index.html

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | amara@example.lk | customer123 |
| Vendor | spice@ceylon.lk | vendor123 |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core 8 | Web API framework |
| C# 12 | Programming language |
| Entity Framework Core 8 | ORM |
| SQLite | Database |
| JWT Bearer Tokens | Authentication |
| BCrypt | Password hashing |
| Swagger | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 17 | Frontend framework |
| TypeScript | Programming language |
| SCSS | Styling |
| Angular Signals | State management |
| Angular Router | Navigation with lazy loading |

---

## ✨ Features

### Customer
- Browse and search products from all vendors
- Filter by category, price range, keyword
- Add products from multiple vendors to one cart
- Place orders and track status
- Cancel pending orders

### Vendor
- Register a shop and manage product listings
- View incoming orders and update status
- Sales dashboard with revenue analytics
- Stock management — auto deduct on order

---

## 🗄️ Database Schema
```
Vendors      → have many Products and OrderItems
Customers    → have many Orders and CartItems
Products     → belong to one Vendor
Orders       → belong to one Customer
OrderItems   → link Order to Product and Vendor
CartItems    → link Customer to Product
```

---

## 🚀 Run Locally

### Backend
```bash
cd MultiVendorShop
dotnet restore
dotnet run
```
API runs at http://localhost:5000
Swagger UI opens automatically.

### Frontend
```bash
cd MultiVendorShop-Angular
npm install
npm start
```
App runs at http://localhost:4200

---

## 📦 Seed Data

| Vendor | Products | Category |
|---|---|---|
| Ceylon Spice House | Cinnamon, Black Pepper, Cardamom, Turmeric | Spices |
| Lanka Electronics Hub | USB-C Charger, Earbuds, HDMI Cable, Power Bank | Electronics |
| Batik & Beyond | Sarong, Cushion Cover, Silk Scarf, Wall Hanging | Clothing / Home Decor |

Prices range from **LKR 420** to **LKR 12,500**

---

## 📁 Project Structure
```
Serendib-Market/
├── MultiVendorShop/              ← .NET 8 Backend
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   ├── Services/
│   ├── Migrations/
│   └── Program.cs
│
└── MultiVendorShop-Angular/      ← Angular 17 Frontend
    └── src/
        ├── app/
        │   ├── core/
        │   │   ├── models/
        │   │   ├── services/
        │   │   ├── guards/
        │   │   └── interceptors/
        │   ├── features/
        │   │   ├── home/
        │   │   ├── auth/
        │   │   ├── products/
        │   │   ├── cart/
        │   │   ├── orders/
        │   │   └── vendor-dashboard/
        │   └── shared/
        └── environments/
```

---

## 🔐 API Endpoints

| Controller | Endpoints | Description |
|---|---|---|
| Auth | 4 | Register and login |
| Products | 6 | Browse, search, CRUD |
| Vendors | 6 | Profiles, sales reports |
| Cart | 4 | View, add, remove |
| Orders | 6 | Place, track, cancel |

---

## 👩‍💻 Author

**Sasuni** — [GitHub](https://github.com/Sasuni22)

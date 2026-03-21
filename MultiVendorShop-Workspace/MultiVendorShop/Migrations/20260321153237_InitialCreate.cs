using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MultiVendorShop.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    DeliveryAddress = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vendors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ShopName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    Address = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderNumber = table.Column<string>(type: "TEXT", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DeliveryAddress = table.Column<string>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: false),
                    CustomerId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    IsAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    VendorId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CustomerId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    VendorId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "Id", "CreatedAt", "DeliveryAddress", "Email", "FullName", "PasswordHash", "Phone" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "12/A Nawala Road, Nugegoda", "amara@example.lk", "Amara Perera", "$2a$11$/Zy.GNNiH7rGCDAfzauMMe/CP70r.xsGOOYKcMuJR4cLIDMVyvXhm", "+94 71 234 5678" },
                    { 2, new DateTime(2024, 1, 16, 0, 0, 0, 0, DateTimeKind.Utc), "56 Galle Road, Mount Lavinia", "kasun@example.lk", "Kasun Silva", "$2a$11$cAslN/NvsF.jJ7s17P0aXOO8jOz1oqq0Kj1sfYP9ivParki.mudnm", "+94 77 345 6789" }
                });

            migrationBuilder.InsertData(
                table: "Vendors",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "IsActive", "PasswordHash", "Phone", "ShopName" },
                values: new object[,]
                {
                    { 1, "123 Pettah Market, Colombo 11", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "spice@ceylon.lk", true, "$2a$11$NXGA/IVGp7eVyYfQZ08WF.LmyFhDVPYXcSBCxCEXmZ7x1YAlzFKqi", "+94 11 234 5678", "Ceylon Spice House" },
                    { 2, "45 Majestic City, Bambalapitiya, Colombo 04", new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "info@lankatech.lk", true, "$2a$11$vJqNa6efUH.CETLToeAZuep7wLwaxcG9jDJ12pNbI8wn4r8Ru4R.q", "+94 77 456 7890", "Lanka Electronics Hub" },
                    { 3, "78 Kandy Road, Peradeniya", new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "hello@batikandbeyond.lk", true, "$2a$11$cdDq3r/CDQjYTrhIAvlnme9wTU8L3NyTYk53XuPpolEWO557E7OnO", "+94 81 567 8901", "Batik & Beyond" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "ImageUrl", "IsAvailable", "Name", "Price", "Stock", "VendorId" },
                values: new object[,]
                {
                    { 1, "Spices", new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Premium true cinnamon sticks from Matale.", "", true, "Ceylon Cinnamon (100g)", 850.00m, 200, 1 },
                    { 2, "Spices", new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Sun-dried black pepper, Kandy estate.", "", true, "Black Pepper Whole (250g)", 1200.00m, 150, 1 },
                    { 3, "Spices", new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Aromatic green cardamom pods.", "", true, "Cardamom Green (50g)", 950.00m, 100, 1 },
                    { 4, "Spices", new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Pure turmeric, no additives.", "", true, "Turmeric Powder (200g)", 420.00m, 300, 1 },
                    { 5, "Electronics", new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), "Universal fast charger with GaN technology.", "", true, "USB-C Fast Charger 65W", 3500.00m, 75, 2 },
                    { 6, "Electronics", new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), "TWS earbuds, noise cancellation, 24hr battery.", "", true, "Wireless Bluetooth Earbuds", 8900.00m, 50, 2 },
                    { 7, "Electronics", new DateTime(2024, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "High-speed 4K@60Hz HDMI 2.0 cable.", "", true, "HDMI Cable 2m (4K)", 1450.00m, 120, 2 },
                    { 8, "Electronics", new DateTime(2024, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Dual USB-A + USB-C, 20W fast charge.", "", true, "Portable Power Bank 20000mAh", 12500.00m, 35, 2 },
                    { 9, "Clothing", new DateTime(2024, 1, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Traditional hand-waxed batik in vibrant colours.", "", true, "Handmade Batik Sarong", 2800.00m, 40, 3 },
                    { 10, "Home Decor", new DateTime(2024, 1, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Handcrafted cushion covers, 45x45cm.", "", true, "Batik Cushion Cover (Set of 2)", 1900.00m, 60, 3 },
                    { 11, "Clothing", new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Lightweight pure silk scarf, hand-batik printed.", "", true, "Silk Batik Scarf", 3200.00m, 30, 3 },
                    { 12, "Home Decor", new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Signed artwork, 90x60cm, ready to hang.", "", true, "Batik Wall Hanging (Large)", 5500.00m, 15, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CustomerId_ProductId",
                table: "CartItems",
                columns: new[] { "CustomerId", "ProductId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_VendorId",
                table: "OrderItems",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_VendorId",
                table: "Products",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_Vendors_Email",
                table: "Vendors",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Vendors");
        }
    }
}

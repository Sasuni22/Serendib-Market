using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MultiVendorShop.Data;
using MultiVendorShop.Models;
using MultiVendorShop.Services;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE ───────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// ── 2. JWT AUTHENTICATION ─────────────────────────────────────
var jwtKey    = builder.Configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"]   ?? "MultiVendorShop";
var jwtAud    = builder.Configuration["Jwt:Audience"] ?? "MultiVendorShopUsers";

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAud,
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew                = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── 3. DEPENDENCY INJECTION ───────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();

// ── 4. CONTROLLERS + JSON ─────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Serialize enums as strings e.g. "Pending" instead of 0
        opts.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());

        // FIX: prevents 500 crash caused by circular references
        // when EF Core loads Order → Customer → Orders → Customer ...
        opts.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ── 5. SWAGGER ────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Multi-Vendor Specialty Shop API",
        Version     = "v1",
        Description = "Multi-vendor e-commerce API (.NET 8). All prices in LKR."
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter: Bearer {your_token}",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {{
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id   = "Bearer"
            }
        },
        Array.Empty<string>()
    }});
});

// ── 6. CORS ───────────────────────────────────────────────────
builder.Services.AddCors(o =>
    o.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod()));

// ═════════════════════════════════════════════════════════════
var app = builder.Build();

// ── 7. AUTO-MIGRATE + SEED ────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();
    Console.WriteLine("✅  Database migrated and ready.");

    // Only seed if tables are empty
    if (!db.Vendors.Any())
    {
        Console.WriteLine("🌱  Seeding database...");

        var vendorHash   = BCrypt.Net.BCrypt.HashPassword("vendor123");
        var customerHash = BCrypt.Net.BCrypt.HashPassword("customer123");

        // ── Vendors ───────────────────────────────────────────
        var spice = new Vendor
        {
            ShopName     = "Ceylon Spice House",
            Email        = "spice@ceylon.lk",
            PasswordHash = vendorHash,
            Phone        = "+94 11 234 5678",
            Address      = "123 Pettah Market, Colombo 11",
            IsActive     = true,
            CreatedAt    = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };
        var electronics = new Vendor
        {
            ShopName     = "Lanka Electronics Hub",
            Email        = "info@lankatech.lk",
            PasswordHash = vendorHash,
            Phone        = "+94 77 456 7890",
            Address      = "45 Majestic City, Bambalapitiya, Colombo 04",
            IsActive     = true,
            CreatedAt    = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc)
        };
        var batik = new Vendor
        {
            ShopName     = "Batik & Beyond",
            Email        = "hello@batikandbeyond.lk",
            PasswordHash = vendorHash,
            Phone        = "+94 81 567 8901",
            Address      = "78 Kandy Road, Peradeniya",
            IsActive     = true,
            CreatedAt    = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
        };
        db.Vendors.AddRange(spice, electronics, batik);
        db.SaveChanges();

        // ── Products (prices in LKR) ──────────────────────────
        db.Products.AddRange(
            // Ceylon Spice House
            new Product { VendorId=spice.Id,       Name="Ceylon Cinnamon (100g)",        Category="Spices",      Price=850.00m,   Stock=200, Description="Premium true cinnamon sticks from Matale.",        IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,5,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=spice.Id,       Name="Black Pepper Whole (250g)",     Category="Spices",      Price=1200.00m,  Stock=150, Description="Sun-dried black pepper, Kandy estate.",            IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,5,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=spice.Id,       Name="Cardamom Green (50g)",          Category="Spices",      Price=950.00m,   Stock=100, Description="Aromatic green cardamom pods.",                    IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,6,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=spice.Id,       Name="Turmeric Powder (200g)",        Category="Spices",      Price=420.00m,   Stock=300, Description="Pure turmeric, no additives.",                    IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,6,0,0,0,DateTimeKind.Utc) },
            // Lanka Electronics Hub
            new Product { VendorId=electronics.Id, Name="USB-C Fast Charger 65W",        Category="Electronics", Price=3500.00m,  Stock=75,  Description="Universal fast charger with GaN technology.",     IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,7,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=electronics.Id, Name="Wireless Bluetooth Earbuds",    Category="Electronics", Price=8900.00m,  Stock=50,  Description="TWS earbuds, noise cancellation, 24hr battery.",   IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,7,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=electronics.Id, Name="HDMI Cable 2m (4K)",            Category="Electronics", Price=1450.00m,  Stock=120, Description="High-speed 4K@60Hz HDMI 2.0 cable.",              IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,8,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=electronics.Id, Name="Portable Power Bank 20000mAh",  Category="Electronics", Price=12500.00m, Stock=35,  Description="Dual USB-A + USB-C, 20W fast charge.",            IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,8,0,0,0,DateTimeKind.Utc) },
            // Batik & Beyond
            new Product { VendorId=batik.Id,       Name="Handmade Batik Sarong",         Category="Clothing",    Price=2800.00m,  Stock=40,  Description="Traditional hand-waxed batik in vibrant colours.",  IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,9,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=batik.Id,       Name="Batik Cushion Cover (Set of 2)",Category="Home Decor",  Price=1900.00m,  Stock=60,  Description="Handcrafted cushion covers, 45x45cm.",             IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,9,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=batik.Id,       Name="Silk Batik Scarf",              Category="Clothing",    Price=3200.00m,  Stock=30,  Description="Lightweight pure silk scarf, hand-batik printed.",  IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,10,0,0,0,DateTimeKind.Utc) },
            new Product { VendorId=batik.Id,       Name="Batik Wall Hanging (Large)",    Category="Home Decor",  Price=5500.00m,  Stock=15,  Description="Signed artwork, 90x60cm, ready to hang.",          IsAvailable=true, ImageUrl="", CreatedAt=new DateTime(2024,1,10,0,0,0,DateTimeKind.Utc) }
        );
        db.SaveChanges();

        // ── Customers ─────────────────────────────────────────
        db.Customers.AddRange(
            new Customer
            {
                FullName        = "Amara Perera",
                Email           = "amara@example.lk",
                PasswordHash    = customerHash,
                Phone           = "+94 71 234 5678",
                DeliveryAddress = "12/A Nawala Road, Nugegoda",
                CreatedAt       = new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc)
            },
            new Customer
            {
                FullName        = "Kasun Silva",
                Email           = "kasun@example.lk",
                PasswordHash    = customerHash,
                Phone           = "+94 77 345 6789",
                DeliveryAddress = "56 Galle Road, Mount Lavinia",
                CreatedAt       = new DateTime(2024, 1, 16, 0, 0, 0, DateTimeKind.Utc)
            }
        );
        db.SaveChanges();

        Console.WriteLine("✅  Seeded: 3 vendors, 12 products, 2 customers.");
    }
}

// ── 8. MIDDLEWARE PIPELINE ────────────────────────────────────
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Multi-Vendor Shop API v1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("═══════════════════════════════════════════════════════");
Console.WriteLine("  🛍  Multi-Vendor Specialty Shop API  (.NET 8)        ");
Console.WriteLine("  📖  Swagger  →  http://localhost:5000/               ");
Console.WriteLine("  Vendor login   : spice@ceylon.lk     / vendor123    ");
Console.WriteLine("  Customer login : amara@example.lk    / customer123  ");
Console.WriteLine("═══════════════════════════════════════════════════════");

app.Run();
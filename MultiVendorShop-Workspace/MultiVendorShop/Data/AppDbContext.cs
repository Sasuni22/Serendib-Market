// ============================================================
// Data/AppDbContext.cs
// NO HasData() seeding here — seeding is done in Program.cs
// ============================================================
using Microsoft.EntityFrameworkCore;
using MultiVendorShop.Models;

namespace MultiVendorShop.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Vendor>    Vendors    { get; set; }
    public DbSet<Customer>  Customers  { get; set; }
    public DbSet<Product>   Products   { get; set; }
    public DbSet<Order>     Orders     { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<CartItem>  CartItems  { get; set; }

    protected override void OnModelCreating(ModelBuilder mb)
    {
        base.OnModelCreating(mb);

        // ── Vendor ───────────────────────────────────────────
        mb.Entity<Vendor>(e =>
        {
            e.HasKey(v => v.Id);
            e.HasIndex(v => v.Email).IsUnique();
            e.Property(v => v.Email).IsRequired().HasMaxLength(256);
            e.Property(v => v.ShopName).IsRequired().HasMaxLength(100);
        });

        // ── Customer ─────────────────────────────────────────
        mb.Entity<Customer>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.Email).IsUnique();
            e.Property(c => c.Email).IsRequired().HasMaxLength(256);
        });

        // ── Product ──────────────────────────────────────────
        mb.Entity<Product>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Price).HasColumnType("decimal(18,2)");
            e.HasOne(p => p.Vendor)
             .WithMany(v => v.Products)
             .HasForeignKey(p => p.VendorId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Order ────────────────────────────────────────────
        mb.Entity<Order>(e =>
        {
            e.HasKey(o => o.Id);
            e.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
            e.Property(o => o.Status).HasConversion<string>();
            e.HasOne(o => o.Customer)
             .WithMany(c => c.Orders)
             .HasForeignKey(o => o.CustomerId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── OrderItem ────────────────────────────────────────
        mb.Entity<OrderItem>(e =>
        {
            e.HasKey(oi => oi.Id);
            e.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
            e.HasOne(oi => oi.Order)
             .WithMany(o => o.OrderItems)
             .HasForeignKey(oi => oi.OrderId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(oi => oi.Product)
             .WithMany(p => p.OrderItems)
             .HasForeignKey(oi => oi.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(oi => oi.Vendor)
             .WithMany(v => v.OrderItems)
             .HasForeignKey(oi => oi.VendorId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── CartItem ─────────────────────────────────────────
        mb.Entity<CartItem>(e =>
        {
            e.HasKey(ci => ci.Id);
            e.HasIndex(ci => new { ci.CustomerId, ci.ProductId }).IsUnique();
            e.HasOne(ci => ci.Customer)
             .WithMany(c => c.CartItems)
             .HasForeignKey(ci => ci.CustomerId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(ci => ci.Product)
             .WithMany(p => p.CartItems)
             .HasForeignKey(ci => ci.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── NO SeedData() call — seeding done in Program.cs ──
    }
}
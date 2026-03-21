import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { VendorService } from '../../core/services/vendor.service';
import { Product, Vendor } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-shape s1"></div>
        <div class="hero-shape s2"></div>
        <div class="hero-shape s3"></div>
      </div>
      <div class="container hero-content fade-up">
        <div class="hero-label">Sri Lanka's Specialty Marketplace</div>
        <h1>Authentic crafts,<br><em>spices &amp; more</em></h1>
        <p>Discover handpicked products from Ceylon's finest local vendors.<br>Every purchase supports an independent artisan.</p>
        <div class="hero-actions">
          <a routerLink="/products" class="btn btn-primary btn-lg">Browse products</a>
          <a routerLink="/auth/register" class="btn btn-outline btn-lg">Sell with us</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><span>{{ products.length }}+</span><em>Products</em></div>
          <div class="stat-divider"></div>
          <div class="stat"><span>{{ vendors.length }}</span><em>Vendors</em></div>
          <div class="stat-divider"></div>
          <div class="stat"><span>4</span><em>Categories</em></div>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <p class="section-sub">Shop by category</p>
        <div class="categories-grid">
          @for (cat of categories; track cat.name) {
            <a [routerLink]="['/products']" [queryParams]="{category: cat.name}" class="cat-card">
              <span class="cat-emoji">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured <span>picks</span></h2>
            <p class="section-sub">Curated from our vendors this season</p>
          </div>
          <a routerLink="/products" class="btn btn-secondary">View all</a>
        </div>
        @if (loading) {
          <div class="loading-wrap"><div class="spinner"></div></div>
        } @else {
          <div class="grid-4">
            @for (p of products.slice(0,8); track p.id) {
              <a [routerLink]="['/products', p.id]" class="product-card card">
                <div class="product-img">
                  <div class="product-img-placeholder">{{ getCategoryIcon(p.category) }}</div>
                  <span class="badge badge-teal cat-badge">{{ p.category }}</span>
                </div>
                <div class="product-body">
                  <div class="product-vendor">{{ p.vendorName }}</div>
                  <h4 class="product-name">{{ p.name }}</h4>
                  <div class="product-footer">
                    <span class="price price-lg">{{ p.price | number:'1.2-2' }}</span>
                    <span class="stock-badge" [class.low]="p.stock < 10">
                      {{ p.stock < 10 ? p.stock + ' left' : 'In stock' }}
                    </span>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <section class="vendors-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Our <span>vendors</span></h2>
            <p class="section-sub">Independent sellers, exceptional quality</p>
          </div>
        </div>
        <div class="vendors-grid">
          @for (v of vendors; track v.id) {
            <a [routerLink]="['/products']" [queryParams]="{vendorId: v.id}" class="vendor-card card">
              <div class="vendor-avatar">{{ v.shopName[0] }}</div>
              <div class="vendor-info">
                <h4>{{ v.shopName }}</h4>
                <p>{{ v.address }}</p>
                <span class="badge badge-neutral">{{ v.totalProducts }} products</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>Start selling on Serendib</h2>
          <p>Join hundreds of local vendors and reach customers across Sri Lanka.</p>
          <a routerLink="/auth/register" class="btn btn-primary btn-lg">Register as vendor</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero { position: relative; overflow: hidden; background: var(--ink); color: var(--ivory); padding: 100px 0 80px; min-height: 560px; display: flex; align-items: center; }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hero-shape { position: absolute; border-radius: 50%; background: var(--teal); opacity: .15; }
    .s1 { width: 500px; height: 500px; top: -100px; right: -80px; }
    .s2 { width: 280px; height: 280px; bottom: -60px; left: 10%; opacity: .08; }
    .s3 { width: 180px; height: 180px; top: 30%; right: 30%; opacity: .06; }
    .hero-content { position: relative; max-width: 640px; }
    .hero-label { font-family: var(--font-mono); font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; &::before { content: ''; width: 28px; height: 1px; background: var(--gold); } }
    .hero-content h1 { color: var(--ivory); font-size: clamp(2.4rem,5vw,3.6rem); margin-bottom: 20px; line-height: 1.1; em { color: var(--gold-light); font-style: italic; } }
    .hero-content p { color: rgba(247,244,239,.65); font-size: 1.05rem; margin-bottom: 36px; line-height: 1.7; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
    .hero-stats { display: flex; align-items: center; gap: 28px; }
    .stat { display: flex; flex-direction: column; span { font-family: var(--font-display); font-size: 1.8rem; color: var(--ivory); line-height: 1; } em { font-style: normal; font-size: .75rem; color: rgba(247,244,239,.5); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; } }
    .stat-divider { width: 1px; height: 32px; background: rgba(247,244,239,.15); }
    .categories-section { padding: 56px 0; }
    .categories-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
    .cat-card { display: flex; align-items: center; gap: 10px; padding: 14px 22px; background: var(--white); border: 1.5px solid rgba(26,26,24,.08); border-radius: var(--radius-xl); cursor: pointer; text-decoration: none; color: var(--ink); transition: all .2s; &:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px); box-shadow: var(--shadow-sm); } }
    .cat-emoji { font-size: 1.3rem; }
    .cat-name { font-weight: 500; font-size: .95rem; }
    .products-section { padding: 56px 0; background: var(--ivory-dark); }
    .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .product-card { text-decoration: none; color: var(--ink); display: block; transition: transform .2s, box-shadow .2s; &:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); } }
    .product-img { position: relative; height: 180px; background: var(--ivory-dark); border-radius: var(--radius-lg) var(--radius-lg) 0 0; display: flex; align-items: center; justify-content: center; }
    .product-img-placeholder { font-size: 3.5rem; opacity: .5; }
    .cat-badge { position: absolute; top: 10px; left: 10px; }
    .product-body { padding: 16px; }
    .product-vendor { font-size: .75rem; color: var(--teal); font-family: var(--font-mono); letter-spacing: .04em; text-transform: uppercase; margin-bottom: 4px; }
    .product-name { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 12px; color: var(--ink); }
    .product-footer { display: flex; align-items: center; justify-content: space-between; }
    .stock-badge { font-size: .72rem; font-family: var(--font-mono); color: var(--ink-faint); background: var(--ivory-dark); padding: 3px 8px; border-radius: 20px; &.low { color: #c0392b; background: #fde8e6; } }
    .vendors-section { padding: 56px 0; }
    .vendors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 8px; }
    .vendor-card { display: flex; align-items: center; gap: 16px; padding: 20px; text-decoration: none; color: var(--ink); transition: transform .2s, box-shadow .2s; &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); } }
    .vendor-avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--teal); color: #fff; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.4rem; flex-shrink: 0; }
    .vendor-info { h4 { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 2px; } p { font-size: .82rem; color: var(--ink-faint); margin-bottom: 8px; } }
    .cta-section { padding: 72px 0; }
    .cta-card { background: var(--ink); color: var(--ivory); border-radius: var(--radius-xl); padding: 56px 48px; text-align: center; h2 { color: var(--ivory); margin-bottom: 12px; } p { color: rgba(247,244,239,.6); margin-bottom: 28px; } }
  `]
})
export class HomeComponent implements OnInit {
  private productSvc = inject(ProductService);
  private vendorSvc  = inject(VendorService);
  products: Product[] = [];
  vendors: Vendor[]   = [];
  loading = true;
  categories = [
    { name: 'Spices', icon: '🌿' }, { name: 'Electronics', icon: '⚡' },
    { name: 'Clothing', icon: '🧵' }, { name: 'Home Decor', icon: '🪔' }
  ];
  ngOnInit() {
    this.productSvc.getAll({ pageSize: 12 }).subscribe(p => { this.products = p.items; this.loading = false; });
    this.vendorSvc.getAll().subscribe(v => this.vendors = v);
  }
  getCategoryIcon(cat: string): string {
    return ({ Spices:'🌿', Electronics:'⚡', Clothing:'🧵', 'Home Decor':'🪔' } as any)[cat] ?? '📦';
  }
}
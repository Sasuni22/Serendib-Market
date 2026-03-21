import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <div class="page-header fade-up">
          <h1 class="section-title">All <span>products</span></h1>
          <p class="section-sub">{{ totalCount }} products available</p>
        </div>
        <div class="layout">
          <aside class="filters card fade-up">
            <h4 class="filter-title">Filters</h4>
            <div class="filter-group">
              <label>Search</label>
              <input class="form-control" [(ngModel)]="filter.search" (input)="onSearch()" placeholder="Search products…" />
            </div>
            <div class="filter-group">
              <label>Category</label>
              <div class="category-list">
                <button class="cat-btn" [class.active]="!filter.category" (click)="setCategory('')">All</button>
                @for (c of categories; track c) {
                  <button class="cat-btn" [class.active]="filter.category===c" (click)="setCategory(c)">{{ c }}</button>
                }
              </div>
            </div>
            <div class="filter-group">
              <label>Price range (LKR)</label>
              <div class="price-inputs">
                <input class="form-control" type="number" [(ngModel)]="filter.minPrice" (change)="loadProducts()" placeholder="Min" />
                <span>—</span>
                <input class="form-control" type="number" [(ngModel)]="filter.maxPrice" (change)="loadProducts()" placeholder="Max" />
              </div>
            </div>
            <button class="btn btn-secondary btn-full btn-sm" (click)="clearFilters()">Clear filters</button>
          </aside>
          <div class="product-area">
            @if (loading) {
              <div class="loading-wrap"><div class="spinner"></div><p>Loading products…</p></div>
            } @else if (products.length === 0) {
              <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button class="btn btn-secondary" (click)="clearFilters()">Clear filters</button>
              </div>
            } @else {
              <div class="grid-4 fade-up">
                @for (p of products; track p.id) {
                  <a [routerLink]="['/products', p.id]" class="product-card card">
                    <div class="product-img">
                      <div class="product-img-placeholder">{{ getCatIcon(p.category) }}</div>
                      <span class="badge badge-teal cat-badge">{{ p.category }}</span>
                    </div>
                    <div class="product-body">
                      <div class="product-vendor">{{ p.vendorName }}</div>
                      <h4 class="product-name">{{ p.name }}</h4>
                      <p class="product-desc">{{ p.description | slice:0:70 }}…</p>
                      <div class="product-footer">
                        <span class="price price-lg">{{ p.price | number:'1.2-2' }}</span>
                        <span class="stock-badge" [class.low]="p.stock < 10">{{ p.stock < 10 ? p.stock + ' left' : 'In stock' }}</span>
                      </div>
                    </div>
                  </a>
                }
              </div>
              @if (totalPages > 1) {
                <div class="pagination">
                  <button class="btn btn-secondary btn-sm" [disabled]="currentPage===1" (click)="goToPage(currentPage-1)">← Prev</button>
                  <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                  <button class="btn btn-secondary btn-sm" [disabled]="currentPage===totalPages" (click)="goToPage(currentPage+1)">Next →</button>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 32px; }
    .layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start; }
    .filters { padding: 24px; position: sticky; top: 88px; }
    .filter-title { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 20px; }
    .filter-group { margin-bottom: 20px; label { display: block; font-size: .8rem; font-weight: 500; color: var(--ink-soft); margin-bottom: 8px; } }
    .category-list { display: flex; flex-direction: column; gap: 4px; }
    .cat-btn { text-align: left; padding: 7px 12px; border: none; border-radius: var(--radius-md); cursor: pointer; font-family: var(--font-body); font-size: .88rem; color: var(--ink-soft); background: none; transition: all .15s; &:hover { background: var(--ivory-dark); color: var(--ink); } &.active { background: var(--teal-dim); color: var(--teal); font-weight: 500; } }
    .price-inputs { display: flex; align-items: center; gap: 8px; span { color: var(--ink-faint); } }
    .product-card { text-decoration: none; color: var(--ink); display: block; transition: transform .2s, box-shadow .2s; &:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); } }
    .product-img { position: relative; height: 160px; background: var(--ivory-dark); border-radius: var(--radius-lg) var(--radius-lg) 0 0; display: flex; align-items: center; justify-content: center; }
    .product-img-placeholder { font-size: 3rem; opacity: .5; }
    .cat-badge { position: absolute; top: 10px; left: 10px; }
    .product-body { padding: 14px; }
    .product-vendor { font-size: .72rem; color: var(--teal); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 3px; }
    .product-name { font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 6px; }
    .product-desc { font-size: .8rem; color: var(--ink-faint); margin-bottom: 10px; line-height: 1.5; }
    .product-footer { display: flex; align-items: center; justify-content: space-between; }
    .stock-badge { font-size: .7rem; font-family: var(--font-mono); color: var(--ink-faint); background: var(--ivory-dark); padding: 3px 7px; border-radius: 20px; &.low { color: #c0392b; background: #fde8e6; } }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 40px; }
    .page-info { font-family: var(--font-mono); font-size: .85rem; color: var(--ink-soft); }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .filters { position: static; } }
  `]
})
export class ProductListComponent implements OnInit {
  private svc   = inject(ProductService);
  private route = inject(ActivatedRoute);
  products: Product[] = []; categories: string[] = [];
  loading = true; totalCount = 0; totalPages = 1; currentPage = 1;
  filter = { search: '', category: '', minPrice: undefined as number|undefined, maxPrice: undefined as number|undefined };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filter.category = params['category'];
      this.loadProducts();
    });
    this.svc.getCategories().subscribe(c => this.categories = c);
  }
  loadProducts() {
    this.loading = true;
    this.svc.getAll({ ...this.filter, page: this.currentPage, pageSize: 12 }).subscribe(res => {
      this.products = res.items; this.totalCount = res.totalCount; this.totalPages = res.totalPages; this.loading = false;
    });
  }
  setCategory(c: string) { this.filter.category = c; this.currentPage = 1; this.loadProducts(); }
  onSearch()    { this.currentPage = 1; this.loadProducts(); }
  goToPage(p: number) { this.currentPage = p; this.loadProducts(); window.scrollTo(0,0); }
  clearFilters() { this.filter = { search:'', category:'', minPrice:undefined, maxPrice:undefined }; this.currentPage = 1; this.loadProducts(); }
  getCatIcon(c: string) { return ({ Spices:'🌿', Electronics:'⚡', Clothing:'🧵', 'Home Decor':'🪔' } as any)[c] ?? '📦'; }
}
// src/app/features/products/product-detail/product-detail.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <a routerLink="/products" class="back-link">← Back to products</a>

        @if (loading) {
          <div class="loading-wrap"><div class="spinner"></div></div>
        } @else if (product) {
          <div class="detail-grid fade-up">
            <div class="detail-image card">
              <div class="img-placeholder">{{ getCatIcon(product.category) }}</div>
              <span class="badge badge-teal"
                    style="position:absolute;top:16px;left:16px">
                {{ product.category }}
              </span>
            </div>

            <div class="detail-info">
              <div class="vendor-label">
                <a [routerLink]="['/products']"
                   [queryParams]="{vendorId: product.vendorId}">
                  {{ product.vendorName }}
                </a>
              </div>
              <h1>{{ product.name }}</h1>
              <div class="detail-price price price-lg">
                {{ product.price | number:'1.2-2' }}
              </div>
              <p class="detail-desc">{{ product.description }}</p>

              <div class="divider"></div>

              <div class="stock-info">
                <span class="badge"
                      [class]="product.stock > 10 ? 'badge-teal' : 'badge-danger'">
                  {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
                </span>
              </div>

              @if (auth.isCustomer()) {
                <div class="add-to-cart">
                  <div class="qty-control">
                    <button (click)="decrement()">−</button>
                    <span>{{ qty }}</span>
                    <button (click)="increment()">+</button>
                  </div>
                  <button class="btn btn-primary btn-lg" style="flex:1"
                          [disabled]="product.stock === 0 || addingToCart"
                          (click)="addToCart()">
                    @if (addingToCart) { <span class="spinner-sm"></span> }
                    Add to cart
                  </button>
                </div>
                @if (cartMessage) {
                  <div class="alert"
                       [class]="cartSuccess ? 'alert-success' : 'alert-error'">
                    {{ cartMessage }}
                  </div>
                }
              } @else if (!auth.isLoggedIn()) {
                <div class="alert alert-info">
                  <a routerLink="/auth/login">Sign in</a> to add items to your cart.
                </div>
              }

              <div class="meta-list">
                <div class="meta-item">
                  <span class="meta-label">Vendor</span>
                  <span>{{ product.vendorName }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Category</span>
                  <span>{{ product.category }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Listed</span>
                  <span>{{ product.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: .88rem; color: var(--ink-soft); margin-bottom: 28px;
      transition: color .2s;
      &:hover { color: var(--teal); }
    }
    .detail-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .detail-image {
      position: relative; aspect-ratio: 1/1;
      display: flex; align-items: center; justify-content: center;
      background: var(--ivory-dark);
      border-radius: var(--radius-xl); overflow: hidden;
    }
    .img-placeholder { font-size: 8rem; opacity: .4; }
    .detail-info {
      padding-top: 8px;
      h1 { font-size: clamp(1.6rem,3vw,2.2rem); margin: 8px 0 16px; }
    }
    .vendor-label a {
      font-size: .8rem; color: var(--teal);
      font-family: var(--font-mono);
      text-transform: uppercase; letter-spacing: .06em;
    }
    .detail-price {
      font-size: 1.6rem !important;
      margin-bottom: 16px; display: block;
    }
    .detail-desc {
      color: var(--ink-soft); line-height: 1.7; margin: 0 0 20px;
    }
    .stock-info { margin-bottom: 20px; }
    .add-to-cart {
      display: flex; gap: 12px;
      align-items: center; margin-bottom: 16px;
    }
    .qty-control {
      display: flex; align-items: center;
      border: 1.5px solid rgba(26,26,24,.15);
      border-radius: var(--radius-md); overflow: hidden;
      button {
        width: 40px; height: 44px;
        background: var(--ivory-dark); border: none;
        cursor: pointer; font-size: 1.1rem;
        color: var(--ink); transition: background .15s;
        &:hover { background: var(--ivory); }
      }
      span {
        min-width: 40px; text-align: center;
        font-weight: 500; font-family: var(--font-mono);
      }
    }
    .spinner-sm {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    .meta-list {
      margin-top: 24px;
      border-top: 1px solid rgba(26,26,24,.08);
      padding-top: 20px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .meta-item {
      display: flex; justify-content: space-between; font-size: .88rem;
    }
    .meta-label {
      color: var(--ink-faint); font-family: var(--font-mono);
      font-size: .78rem; text-transform: uppercase; letter-spacing: .04em;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc   = inject(ProductService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);

  product:     Product | null = null;
  loading      = true;
  qty          = 1;
  addingToCart = false;
  cartMessage  = '';
  cartSuccess  = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next:  p => { this.product = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  // ── FIX: use methods instead of ++ / -- in template ──────
  decrement() {
    if (this.qty > 1) this.qty--;
  }

  increment() {
    if (this.product && this.qty < this.product.stock) this.qty++;
  }

  addToCart() {
    if (!this.product) return;
    this.addingToCart = true;
    this.cart.addToCart(this.product.id, this.qty).subscribe({
      next: () => {
        this.addingToCart = false;
        this.cartMessage  = `${this.product!.name} added to cart!`;
        this.cartSuccess  = true;
        setTimeout(() => this.cartMessage = '', 3000);
      },
      error: err => {
        this.addingToCart = false;
        this.cartMessage  = err?.error?.message ?? 'Could not add to cart.';
        this.cartSuccess  = false;
      }
    });
  }

  getCatIcon(c: string) {
    return ({
      Spices: '🌿', Electronics: '⚡',
      Clothing: '🧵', 'Home Decor': '🪔'
    } as any)[c] ?? '📦';
  }
}
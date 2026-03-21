import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <div class="page-header">
          <h1 class="section-title">Your <span>cart</span></h1>
          <p class="section-sub">{{ cart.cartCount() }} items — LKR {{ cart.cartTotal() | number:'1.2-2' }}</p>
        </div>
        @if (cart.cart().items.length === 0) {
          <div class="empty-state fade-up">
            <div class="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse our products and add something you love.</p>
            <a routerLink="/products" class="btn btn-primary">Browse products</a>
          </div>
        } @else {
          <div class="cart-layout fade-up">
            <div class="cart-items">
              @for (item of cart.cart().items; track item.cartItemId) {
                <div class="cart-item card">
                  <div class="item-icon">📦</div>
                  <div class="item-info">
                    <div class="item-vendor">{{ item.vendorName }}</div>
                    <h4>{{ item.productName }}</h4>
                    <div class="item-price price">{{ item.unitPrice | number:'1.2-2' }}</div>
                  </div>
                  <div class="item-actions">
                    <div class="qty-display"><span class="qty-label">Qty</span><span class="qty-val">{{ item.quantity }}</span></div>
                    <div class="item-subtotal price">{{ item.subtotal | number:'1.2-2' }}</div>
                    <button class="btn btn-icon remove-btn" (click)="removeItem(item.cartItemId)" title="Remove">✕</button>
                  </div>
                </div>
              }
            </div>
            <div class="cart-summary card">
              <h3>Order summary</h3>
              <div class="divider"></div>
              <div class="summary-rows">
                @for (item of cart.cart().items; track item.cartItemId) {
                  <div class="summary-row">
                    <span>{{ item.productName }} ×{{ item.quantity }}</span>
                    <span class="price">{{ item.subtotal | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
              <div class="divider"></div>
              <div class="summary-total">
                <span>Total</span>
                <span class="price price-lg">{{ cart.cartTotal() | number:'1.2-2' }}</span>
              </div>
              <div class="form-group" style="margin-top:20px">
                <label>Delivery address</label>
                <textarea class="form-control" [(ngModel)]="deliveryAddress" rows="2" placeholder="Override default delivery address (optional)"></textarea>
              </div>
              <div class="form-group">
                <label>Notes for vendor</label>
                <input class="form-control" [(ngModel)]="notes" placeholder="Any special instructions?" />
              </div>
              @if (orderError)   { <div class="alert alert-error">{{ orderError }}</div> }
              @if (orderSuccess) { <div class="alert alert-success">Order placed! Redirecting…</div> }
              <button class="btn btn-primary btn-full btn-lg" [disabled]="placing" (click)="placeOrder()">
                @if (placing) { <span class="spinner-sm"></span> }
                Place order · LKR {{ cart.cartTotal() | number:'1.2-2' }}
              </button>
              <button class="btn btn-secondary btn-full" style="margin-top:8px" (click)="clearCart()">Clear cart</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 32px; }
    .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
    .cart-items { display: flex; flex-direction: column; gap: 14px; }
    .cart-item { display: flex; align-items: center; gap: 16px; padding: 18px; }
    .item-icon { font-size: 2.2rem; flex-shrink: 0; opacity: .6; }
    .item-info { flex: 1; }
    .item-vendor { font-size: .72rem; color: var(--teal); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .04em; }
    .item-info h4 { font-family: var(--font-display); font-size: 1.05rem; margin: 3px 0 5px; }
    .item-actions { display: flex; align-items: center; gap: 16px; }
    .qty-display { display: flex; flex-direction: column; align-items: center; }
    .qty-label { font-size: .65rem; color: var(--ink-faint); font-family: var(--font-mono); text-transform: uppercase; }
    .qty-val { font-weight: 500; font-size: 1rem; }
    .item-subtotal { font-size: 1rem; min-width: 90px; text-align: right; }
    .remove-btn { color: var(--ink-faint); background: var(--ivory-dark); font-size: .7rem; &:hover { background: #fde8e6; color: var(--danger); } }
    .cart-summary { padding: 24px; position: sticky; top: 88px; h3 { font-family: var(--font-display); } }
    .summary-rows { display: flex; flex-direction: column; gap: 8px; }
    .summary-row { display: flex; justify-content: space-between; font-size: .85rem; color: var(--ink-soft); }
    .summary-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-weight: 500; }
    .spinner-sm { width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite; }
    @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .cart-summary { position: static; } }
  `]
})
export class CartComponent implements OnInit {
  readonly cart  = inject(CartService);
  private orders = inject(OrderService);
  private router = inject(Router);
  deliveryAddress = ''; notes = ''; placing = false; orderError = ''; orderSuccess = false;

  ngOnInit() { this.cart.load().subscribe(); }
  removeItem(id: number) { this.cart.removeItem(id).subscribe(); }
  clearCart()            { this.cart.clearCart().subscribe(); }
  placeOrder() {
    this.placing = true; this.orderError = '';
    this.orders.placeOrder(this.deliveryAddress, this.notes).subscribe({
      next: () => { this.orderSuccess = true; this.placing = false; setTimeout(() => this.router.navigate(['/orders']), 1500); },
      error: err => { this.placing = false; this.orderError = err?.error?.message ?? 'Could not place order.'; }
    });
  }
}
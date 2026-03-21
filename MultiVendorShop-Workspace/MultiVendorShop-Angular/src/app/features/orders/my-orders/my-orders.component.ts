import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <h1 class="section-title">My <span>orders</span></h1>
        <p class="section-sub">{{ orders.length }} orders placed</p>
        @if (loading) {
          <div class="loading-wrap"><div class="spinner"></div></div>
        } @else if (orders.length === 0) {
          <div class="empty-state fade-up">
            <div class="empty-icon">📋</div>
            <h3>No orders yet</h3>
            <p>Once you place an order, it will appear here.</p>
          </div>
        } @else {
          <div class="orders-list fade-up">
            @for (order of orders; track order.id) {
              <div class="order-card card">
                <div class="order-head">
                  <div>
                    <div class="order-num">{{ order.orderNumber }}</div>
                    <div class="order-date">{{ order.orderDate | date:'medium' }}</div>
                  </div>
                  <div class="order-head-right">
                    <span class="badge" [class]="getStatusClass(order.status)">{{ order.status }}</span>
                    <span class="price price-lg">{{ order.totalAmount | number:'1.2-2' }}</span>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="order-items">
                  @for (item of order.items; track item.productId) {
                    <div class="order-item-row">
                      <span class="oi-name">{{ item.productName }}</span>
                      <span class="oi-vendor">{{ item.vendorName }}</span>
                      <span class="oi-qty">×{{ item.quantity }}</span>
                      <span class="price">{{ item.subtotal | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>
                <div class="order-footer">
                  <span class="delivery-addr">📍 {{ order.deliveryAddress }}</span>
                  @if (order.status === 'Pending' || order.status === 'Confirmed') {
                    <button class="btn btn-danger btn-sm" [disabled]="cancellingId === order.id" (click)="cancelOrder(order)">Cancel order</button>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .orders-list { display: flex; flex-direction: column; gap: 20px; margin-top: 8px; }
    .order-card { padding: 24px; }
    .order-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
    .order-num { font-family: var(--font-mono); font-weight: 500; font-size: .95rem; }
    .order-date { font-size: .78rem; color: var(--ink-faint); margin-top: 3px; }
    .order-head-right { display: flex; align-items: center; gap: 14px; }
    .order-items { display: flex; flex-direction: column; gap: 8px; }
    .order-item-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 12px; align-items: center; font-size: .88rem; }
    .oi-name { color: var(--ink); }
    .oi-vendor { color: var(--teal); font-size: .75rem; font-family: var(--font-mono); text-transform: uppercase; }
    .oi-qty { color: var(--ink-faint); font-family: var(--font-mono); }
    .order-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
    .delivery-addr { font-size: .82rem; color: var(--ink-faint); }
  `]
})
export class MyOrdersComponent implements OnInit {
  private svc = inject(OrderService);
  orders: Order[] = []; loading = true; cancellingId: number | null = null;

  ngOnInit() {
    this.svc.getMyOrders().subscribe({ next: o => { this.orders = o; this.loading = false; }, error: () => this.loading = false });
  }
  cancelOrder(order: Order) {
    this.cancellingId = order.id;
    this.svc.cancelOrder(order.id).subscribe({ next: () => { order.status = 'Cancelled'; this.cancellingId = null; }, error: () => this.cancellingId = null });
  }
  getStatusClass(s: string) {
    return ({ Pending:'badge-gold', Confirmed:'badge-teal', Processing:'badge-teal', Shipped:'badge-teal', Delivered:'badge-teal', Cancelled:'badge-danger' } as any)[s] ?? 'badge-neutral';
  }
}
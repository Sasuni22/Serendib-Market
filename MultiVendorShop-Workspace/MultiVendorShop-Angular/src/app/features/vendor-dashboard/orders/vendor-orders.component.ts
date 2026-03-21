import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/models';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-up">
      <div class="section-header">
        <div>
          <h2 class="section-title">Incoming <span>orders</span></h2>
          <p class="section-sub">{{ filtered.length }} orders</p>
        </div>
        <div class="status-tabs">
          @for (s of statuses; track s) {
            <button class="status-tab" [class.active]="activeStatus===s" (click)="filterByStatus(s)">{{ s }}</button>
          }
        </div>
      </div>
      @if (loading) {
        <div class="loading-wrap"><div class="spinner"></div></div>
      } @else if (filtered.length === 0) {
        <div class="empty-state"><div class="empty-icon">📭</div><h3>No orders</h3><p>Orders from customers will appear here.</p></div>
      } @else {
        <div class="orders-list">
          @for (order of filtered; track order.id) {
            <div class="order-card card">
              <div class="order-head">
                <div>
                  <div class="order-num">{{ order.orderNumber }}</div>
                  <div class="order-customer">{{ order.customerName }}</div>
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
                    <span class="oi-qty badge badge-neutral">×{{ item.quantity }}</span>
                    <span class="price">{{ item.subtotal | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
              <div class="order-footer">
                <span class="delivery-addr">📍 {{ order.deliveryAddress }}</span>
                @if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
                  <select class="form-control" style="max-width:160px;padding:7px 10px;font-size:.85rem"
                          [value]="order.status" (change)="updateStatus(order, $event)">
                    <option>Pending</option><option>Confirmed</option><option>Processing</option>
                    <option>Shipped</option><option>Delivered</option>
                  </select>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .section-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
    .status-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
    .status-tab { padding: 6px 14px; border-radius: 20px; border: 1.5px solid rgba(26,26,24,.12); background: none; cursor: pointer; font-size: .82rem; font-family: var(--font-body); color: var(--ink-soft); transition: all .15s; &:hover { border-color: var(--teal); color: var(--teal); } &.active { background: var(--teal); border-color: var(--teal); color: #fff; } }
    .orders-list { display: flex; flex-direction: column; gap: 16px; }
    .order-card { padding: 22px; }
    .order-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
    .order-num { font-family: var(--font-mono); font-weight: 500; font-size: .95rem; }
    .order-customer { font-size: .88rem; color: var(--teal); margin: 3px 0; }
    .order-date { font-size: .75rem; color: var(--ink-faint); }
    .order-head-right { display: flex; align-items: center; gap: 12px; }
    .order-items { display: flex; flex-direction: column; gap: 8px; }
    .order-item-row { display: flex; align-items: center; gap: 12px; font-size: .88rem; }
    .oi-name { flex: 1; }
    .order-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
    .delivery-addr { font-size: .8rem; color: var(--ink-faint); }
  `]
})
export class VendorOrdersComponent implements OnInit {
  private svc = inject(OrderService);
  orders: Order[] = []; filtered: Order[] = []; loading = true; activeStatus = 'All';
  statuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit() {
    this.svc.getVendorOrders().subscribe({ next: o => { this.orders = o; this.filtered = o; this.loading = false; }, error: () => this.loading = false });
  }
  filterByStatus(s: string) { this.activeStatus = s; this.filtered = s === 'All' ? this.orders : this.orders.filter(o => o.status === s); }
  updateStatus(order: Order, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.svc.updateStatus(order.id, status).subscribe({ next: () => order.status = status as OrderStatus, error: () => {} });
  }
  getStatusClass(s: string) { return ({ Pending:'badge-gold', Confirmed:'badge-teal', Processing:'badge-teal', Shipped:'badge-teal', Delivered:'badge-teal', Cancelled:'badge-danger' } as any)[s] ?? 'badge-neutral'; }
}

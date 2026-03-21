import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VendorService } from '../../../core/services/vendor.service';
import { VendorSales } from '../../../core/models/models';

@Component({
  selector: 'app-vendor-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fade-up">
      <h2 class="section-title">Dashboard <span>overview</span></h2>
      <p class="section-sub">Your sales at a glance</p>
      @if (loading) {
        <div class="loading-wrap"><div class="spinner"></div></div>
      } @else if (sales) {
        <div class="kpi-grid">
          <div class="kpi-card card">
            <div class="kpi-icon teal">💰</div>
            <div class="kpi-body"><div class="kpi-label">Total revenue</div><div class="kpi-val price price-lg">{{ sales.totalRevenue | number:'1.2-2' }}</div></div>
          </div>
          <div class="kpi-card card">
            <div class="kpi-icon gold">📦</div>
            <div class="kpi-body"><div class="kpi-label">Units sold</div><div class="kpi-val">{{ sales.totalUnitsSold }}</div></div>
          </div>
          <div class="kpi-card card">
            <div class="kpi-icon">🧾</div>
            <div class="kpi-body"><div class="kpi-label">Order lines</div><div class="kpi-val">{{ sales.totalOrderItems }}</div></div>
          </div>
          <div class="kpi-card card">
            <div class="kpi-icon">🛍️</div>
            <div class="kpi-body"><div class="kpi-label">Products</div><div class="kpi-val">{{ sales.productSales.length }}</div></div>
          </div>
        </div>
        @if (sales.productSales.length > 0) {
          <div class="section-block">
            <h3 class="block-title">Top selling products</h3>
            <div class="top-products card">
              @for (ps of sales.productSales; track ps.productId; let i = $index) {
                <div class="top-row">
                  <span class="rank">#{{ i + 1 }}</span>
                  <span class="prod-name">{{ ps.productName }}</span>
                  <span class="prod-units badge badge-neutral">{{ ps.unitsSold }} units</span>
                  <span class="prod-rev price">{{ ps.revenue | number:'1.2-2' }}</span>
                  <div class="bar-wrap"><div class="bar" [style.width.%]="getBarWidth(ps.revenue)"></div></div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>No sales data yet</h3>
            <p>Once customers place orders, your sales will appear here.</p>
            <a routerLink="../products" class="btn btn-primary">Add products</a>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px; }
    .kpi-card { padding: 20px; display: flex; gap: 14px; align-items: center; }
    .kpi-icon { font-size: 1.6rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--ivory-dark); border-radius: var(--radius-md); flex-shrink: 0; &.teal { background: var(--teal-dim); } &.gold { background: #fdf3d8; } }
    .kpi-label { font-size: .75rem; color: var(--ink-faint); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px; }
    .kpi-val { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--ink); }
    .section-block { margin-top: 32px; }
    .block-title { font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 16px; }
    .top-products { padding: 0; overflow: hidden; }
    .top-row { display: grid; grid-template-columns: 32px 1fr auto auto 100px; gap: 12px; align-items: center; padding: 14px 20px; border-bottom: 1px solid rgba(26,26,24,.06); &:last-child { border-bottom: none; } &:hover { background: var(--ivory-dark); } }
    .rank { font-family: var(--font-mono); font-size: .78rem; color: var(--ink-faint); }
    .prod-name { font-size: .92rem; font-weight: 500; }
    .prod-rev { font-size: .92rem; white-space: nowrap; }
    .bar-wrap { height: 4px; background: var(--ivory-dark); border-radius: 2px; overflow: hidden; }
    .bar { height: 100%; background: var(--teal); border-radius: 2px; transition: width .5s ease; }
  `]
})
export class VendorOverviewComponent implements OnInit {
  private auth      = inject(AuthService);
  private vendorSvc = inject(VendorService);
  sales: VendorSales | null = null; loading = true;

  ngOnInit() {
    const id = this.auth.user()?.userId;
    if (!id) return;
    this.vendorSvc.getSales(id).subscribe({ next: s => { this.sales = s; this.loading = false; }, error: () => this.loading = false });
  }
  getBarWidth(rev: number): number {
    if (!this.sales || this.sales.productSales.length === 0) return 0;
    const max = Math.max(...this.sales.productSales.map(p => p.revenue));
    return max === 0 ? 0 : (rev / max) * 100;
  }
}
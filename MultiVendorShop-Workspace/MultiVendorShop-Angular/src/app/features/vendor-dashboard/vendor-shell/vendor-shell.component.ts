import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vendor-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="vendor-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="vendor-avatar">{{ auth.user()?.name?.[0] }}</div>
          <div>
            <div class="vendor-name">{{ auth.user()?.name }}</div>
            <div class="vendor-role">Vendor dashboard</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="overview"  routerLinkActive="active" class="nav-item"><span class="nav-icon">◉</span> Overview</a>
          <a routerLink="products"  routerLinkActive="active" class="nav-item"><span class="nav-icon">⊞</span> My Products</a>
          <a routerLink="orders"    routerLinkActive="active" class="nav-item"><span class="nav-icon">◫</span> Orders</a>
        </nav>
        <div class="sidebar-footer">
          <a routerLink="/products" class="nav-item"><span class="nav-icon">◁</span> Back to shop</a>
        </div>
      </aside>
      <main class="vendor-content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .vendor-layout { display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - 72px); }
    .sidebar { background: var(--ink); color: var(--ivory); display: flex; flex-direction: column; padding: 24px 0; position: sticky; top: 72px; height: calc(100vh - 72px); overflow-y: auto; }
    .sidebar-header { padding: 0 20px 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(247,244,239,.08); margin-bottom: 16px; }
    .vendor-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.2rem; flex-shrink: 0; }
    .vendor-name { font-weight: 500; font-size: .95rem; color: var(--ivory); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
    .vendor-role { font-size: .72rem; color: rgba(247,244,239,.4); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
    .sidebar-nav { flex: 1; padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: var(--radius-md); color: rgba(247,244,239,.6); text-decoration: none; font-size: .9rem; transition: all .15s; &:hover { background: rgba(247,244,239,.07); color: var(--ivory); } &.active { background: var(--teal); color: var(--ivory); } }
    .nav-icon { font-size: .9rem; opacity: .7; }
    .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid rgba(247,244,239,.08); margin-top: 8px; }
    .vendor-content { padding: 36px 40px; background: var(--ivory); }
    @media (max-width: 900px) { .vendor-layout { grid-template-columns: 1fr; } .sidebar { position: static; height: auto; flex-direction: row; flex-wrap: wrap; padding: 12px; } .sidebar-header { border: none; margin: 0; padding: 8px; } .sidebar-nav { flex-direction: row; padding: 0; gap: 4px; } .sidebar-footer { padding: 0; border: none; } .vendor-content { padding: 20px 16px; } }
  `]
})
export class VendorShellComponent {
  auth = inject(AuthService);
}
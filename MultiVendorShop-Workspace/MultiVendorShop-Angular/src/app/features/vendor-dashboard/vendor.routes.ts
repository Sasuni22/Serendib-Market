import { Routes } from '@angular/router';

export const VENDOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./vendor-shell/vendor-shell.component').then(m => m.VendorShellComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./overview/vendor-overview.component').then(m => m.VendorOverviewComponent) },
      { path: 'products', loadComponent: () => import('./products/vendor-products.component').then(m => m.VendorProductsComponent) },
      { path: 'orders',   loadComponent: () => import('./orders/vendor-orders.component').then(m => m.VendorOrdersComponent) },
    ]
  }
];
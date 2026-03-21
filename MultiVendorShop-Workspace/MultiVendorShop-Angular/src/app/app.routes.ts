import { Routes } from '@angular/router';
import { authGuard, vendorGuard, customerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [customerGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
    canActivate: [customerGuard]
  },
  {
    path: 'vendor',
    canActivate: [vendorGuard],
    loadChildren: () => import('./features/vendor-dashboard/vendor.routes').then(m => m.VENDOR_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="brand">
          <span class="brand-icon">◈</span>
          <span class="brand-name">Serendib Market</span>
        </a>
        <div class="nav-links">
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          @if (auth.isVendor()) {
            <a routerLink="/vendor" routerLinkActive="active">Dashboard</a>
          }
        </div>
        <div class="nav-actions">
          @if (auth.isCustomer()) {
            <a routerLink="/cart" class="cart-btn" title="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              @if (cart.cartCount() > 0) {
                <span class="cart-badge">{{ cart.cartCount() }}</span>
              }
            </a>
            <a routerLink="/orders" class="btn btn-secondary btn-sm">Orders</a>
          }
          @if (auth.isLoggedIn()) {
            <div class="user-menu">
              <span class="user-name">{{ auth.user()?.name }}</span>
              <button class="btn btn-secondary btn-sm" (click)="auth.logout()">Sign out</button>
            </div>
          } @else {
            <a routerLink="/auth/login" class="btn btn-secondary btn-sm">Sign in</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">Get started</a>
          }
        </div>
        <button class="hamburger" (click)="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      @if (menuOpen) {
        <div class="mobile-drawer">
          <a routerLink="/products" (click)="menuOpen=false">Shop</a>
          @if (auth.isCustomer()) {
            <a routerLink="/cart"   (click)="menuOpen=false">Cart ({{ cart.cartCount() }})</a>
            <a routerLink="/orders" (click)="menuOpen=false">My Orders</a>
          }
          @if (auth.isVendor()) {
            <a routerLink="/vendor" (click)="menuOpen=false">Vendor Dashboard</a>
          }
          @if (auth.isLoggedIn()) {
            <button (click)="auth.logout(); menuOpen=false" class="btn btn-secondary btn-full">Sign out</button>
          } @else {
            <a routerLink="/auth/login"     (click)="menuOpen=false" class="btn btn-secondary btn-full">Sign in</a>
            <a routerLink="/auth/register"  (click)="menuOpen=false" class="btn btn-primary btn-full">Get started</a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar { position: sticky; top: 0; z-index: 100; background: rgba(247,244,239,.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(26,26,24,.08); height: 72px; }
    .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 100%; display: flex; align-items: center; gap: 24px; }
    .brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-size: 1.35rem; font-weight: 600; color: var(--ink); text-decoration: none; white-space: nowrap; }
    .brand-icon { color: var(--teal); font-size: 1.2rem; }
    .nav-links { display: flex; gap: 32px; flex: 1; padding-left: 16px;
      a { font-size: .9rem; color: var(--ink-soft); font-weight: 500; text-decoration: none; transition: color .2s; position: relative;
        &::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1.5px; background: var(--teal); transition: width .2s; }
        &:hover, &.active { color: var(--teal); &::after { width: 100%; } }
      }
    }
    .nav-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .cart-btn { position: relative; display: flex; align-items: center; color: var(--ink); padding: 8px; border-radius: var(--radius-md); transition: color .2s, background .2s; &:hover { color: var(--teal); background: var(--teal-dim); } }
    .cart-badge { position: absolute; top: 2px; right: 2px; background: var(--teal); color: #fff; font-size: .65rem; font-weight: 500; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
    .user-menu { display: flex; align-items: center; gap: 10px; }
    .user-name { font-size: .85rem; color: var(--ink-soft); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; span { display: block; width: 22px; height: 1.5px; background: var(--ink); } }
    .mobile-drawer { background: var(--white); border-top: 1px solid rgba(26,26,24,.08); padding: 16px 24px; display: flex; flex-direction: column; gap: 8px;
      a { padding: 10px 0; color: var(--ink); font-weight: 500; border-bottom: 1px solid rgba(26,26,24,.06); }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-actions { display: none; }
      .hamburger { display: flex; margin-left: auto; }
      .navbar { height: auto; min-height: 60px; }
      .nav-inner { height: 60px; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  cart = inject(CartService);
  menuOpen = false;
  ngOnInit() { if (this.auth.isCustomer()) this.cart.load().subscribe(); }
}
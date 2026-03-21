import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card fade-up">
        <div class="auth-header">
          <div class="auth-logo">◈</div>
          <h2>Create account</h2>
          <p>Join Serendib Market today</p>
        </div>
        <div class="role-tabs">
          <button [class.active]="role==='customer'" (click)="role='customer'">I'm a customer</button>
          <button [class.active]="role==='vendor'"   (click)="role='vendor'">I'm a vendor</button>
        </div>
        @if (error)   { <div class="alert alert-error">{{ error }}</div> }
        @if (success) { <div class="alert alert-success">Account created! Redirecting…</div> }

        @if (role === 'customer') {
          <form (ngSubmit)="registerCustomer()">
            <div class="form-group"><label>Full name</label><input class="form-control" name="fullName" [(ngModel)]="cust.fullName" required placeholder="Amara Perera" /></div>
            <div class="form-grid">
              <div class="form-group"><label>Email</label><input class="form-control" type="email" name="email" [(ngModel)]="cust.email" required placeholder="you@example.com" /></div>
              <div class="form-group"><label>Phone</label><input class="form-control" name="phone" [(ngModel)]="cust.phone" placeholder="+94 71 000 0000" /></div>
            </div>
            <div class="form-group"><label>Delivery address</label><textarea class="form-control" name="address" [(ngModel)]="cust.deliveryAddress" rows="2" placeholder="Your delivery address"></textarea></div>
            <div class="form-group"><label>Password</label><input class="form-control" type="password" name="password" [(ngModel)]="cust.password" required placeholder="Min. 6 characters" /></div>
            <button class="btn btn-primary btn-full btn-lg" type="submit" [disabled]="loading">
              @if (loading) { <span class="spinner-sm"></span> } Create account
            </button>
          </form>
        }

        @if (role === 'vendor') {
          <form (ngSubmit)="registerVendor()">
            <div class="form-group"><label>Shop name</label><input class="form-control" name="shopName" [(ngModel)]="vend.shopName" required placeholder="Ceylon Spice House" /></div>
            <div class="form-grid">
              <div class="form-group"><label>Email</label><input class="form-control" type="email" name="email" [(ngModel)]="vend.email" required placeholder="shop@example.lk" /></div>
              <div class="form-group"><label>Phone</label><input class="form-control" name="phone" [(ngModel)]="vend.phone" placeholder="+94 11 000 0000" /></div>
            </div>
            <div class="form-group"><label>Shop address</label><textarea class="form-control" name="address" [(ngModel)]="vend.address" rows="2" placeholder="Your shop address"></textarea></div>
            <div class="form-group"><label>Password</label><input class="form-control" type="password" name="password" [(ngModel)]="vend.password" required placeholder="Min. 6 characters" /></div>
            <button class="btn btn-primary btn-full btn-lg" type="submit" [disabled]="loading">
              @if (loading) { <span class="spinner-sm"></span> } Create vendor account
            </button>
          </form>
        }
        <div class="auth-footer">Already have an account? <a routerLink="/auth/login">Sign in</a></div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
    .auth-card { width: 100%; max-width: 520px; padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-logo { font-size: 2rem; color: var(--teal); margin-bottom: 12px; display: block; }
    .auth-header h2 { font-family: var(--font-display); font-size: 1.8rem; }
    .auth-header p  { color: var(--ink-faint); font-size: .9rem; margin-top: 4px; }
    .role-tabs { display: flex; border: 1.5px solid rgba(26,26,24,.12); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px;
      button { flex: 1; padding: 10px; background: none; border: none; cursor: pointer; font-family: var(--font-body); font-size: .9rem; color: var(--ink-soft); transition: all .2s; &.active { background: var(--teal); color: #fff; font-weight: 500; } }
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: .88rem; color: var(--ink-faint); a { color: var(--teal); font-weight: 500; } }
    @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  role = 'customer'; loading = false; error = ''; success = false;
  cust = { fullName:'', email:'', password:'', phone:'', deliveryAddress:'' };
  vend = { shopName:'', email:'', password:'', phone:'', address:'' };

  registerCustomer() {
    this.error = ''; this.loading = true;
    this.auth.customerRegister(this.cust).subscribe({
      next: () => { this.success = true; this.loading = false; setTimeout(() => this.router.navigate(['/products']), 1200); },
      error: err => { this.loading = false; this.error = err?.error?.message ?? 'Registration failed.'; }
    });
  }
  registerVendor() {
    this.error = ''; this.loading = true;
    this.auth.vendorRegister(this.vend).subscribe({
      next: () => { this.success = true; this.loading = false; setTimeout(() => this.router.navigate(['/vendor']), 1200); },
      error: err => { this.loading = false; this.error = err?.error?.message ?? 'Registration failed.'; }
    });
  }
}
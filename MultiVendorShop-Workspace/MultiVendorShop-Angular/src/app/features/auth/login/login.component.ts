import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card fade-up">
        <div class="auth-header">
          <div class="auth-logo">◈</div>
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>
        </div>
        <div class="role-tabs">
          <button [class.active]="role==='customer'" (click)="role='customer'">Customer</button>
          <button [class.active]="role==='vendor'"   (click)="role='vendor'">Vendor</button>
        </div>
        @if (error) { <div class="alert alert-error">{{ error }}</div> }
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email address</label>
            <input class="form-control" type="email" name="email" [(ngModel)]="email" required placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <div class="input-wrap">
              <input class="form-control" [type]="showPwd ? 'text' : 'password'" name="password" [(ngModel)]="password" required placeholder="••••••••" />
              <button type="button" class="pwd-toggle" (click)="showPwd=!showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
            </div>
          </div>
          <button class="btn btn-primary btn-full btn-lg" type="submit" [disabled]="loading">
            @if (loading) { <span class="spinner-sm"></span> } Sign in
          </button>
        </form>
        <div class="auth-footer">
          Don't have an account? <a routerLink="/auth/register">Create one</a>
        </div>
        <div class="demo-creds">
          <p class="demo-label">Demo credentials</p>
          <div class="demo-grid">
            <button class="demo-btn" (click)="fillDemo('customer')">
              <strong>Customer</strong>
              <span>amara&#64;example.lk / customer123</span>
            </button>
            <button class="demo-btn" (click)="fillDemo('vendor')">
              <strong>Vendor</strong>
              <span>spice&#64;ceylon.lk / vendor123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; padding: 40px 16px; background: radial-gradient(ellipse at 60% 0%, rgba(29,106,90,.08) 0%, transparent 60%); }
    .auth-card { width: 100%; max-width: 440px; padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-logo { font-size: 2rem; color: var(--teal); margin-bottom: 12px; display: block; }
    .auth-header h2 { font-family: var(--font-display); font-size: 1.8rem; }
    .auth-header p  { color: var(--ink-faint); font-size: .9rem; margin-top: 4px; }
    .role-tabs { display: flex; border: 1.5px solid rgba(26,26,24,.12); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px;
      button { flex: 1; padding: 10px; background: none; border: none; cursor: pointer; font-family: var(--font-body); font-size: .9rem; color: var(--ink-soft); transition: all .2s; &.active { background: var(--teal); color: #fff; font-weight: 500; } }
    }
    .input-wrap { position: relative; }
    .pwd-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: .9rem; }
    .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: .88rem; color: var(--ink-faint); a { color: var(--teal); font-weight: 500; } }
    .demo-creds { margin-top: 24px; padding-top: 20px; border-top: 1px dashed rgba(26,26,24,.12); }
    .demo-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-faint); font-family: var(--font-mono); text-align: center; margin-bottom: 10px; }
    .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .demo-btn { background: var(--ivory-dark); border: 1px solid rgba(26,26,24,.1); border-radius: var(--radius-md); padding: 10px; cursor: pointer; text-align: left; transition: all .2s; display: flex; flex-direction: column; gap: 2px;
      strong { font-size: .82rem; color: var(--ink); } span { font-size: .72rem; color: var(--ink-faint); font-family: var(--font-mono); word-break: break-all; }
      &:hover { border-color: var(--teal); background: var(--teal-dim); }
    }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  role = 'customer'; email = ''; password = ''; showPwd = false; loading = false; error = '';

  fillDemo(r: string) {
    this.role = r;
    if (r === 'customer') { this.email = 'amara@example.lk'; this.password = 'customer123'; }
    else                  { this.email = 'spice@ceylon.lk';  this.password = 'vendor123'; }
  }
  onSubmit() {
    this.error = ''; this.loading = true;
    const dto   = { email: this.email, password: this.password };
    const call$ = this.role === 'vendor' ? this.auth.vendorLogin(dto) : this.auth.customerLogin(dto);
    call$.subscribe({
      next: res => { this.loading = false; this.router.navigate(res.role === 'Vendor' ? ['/vendor'] : ['/products']); },
      error: err => { this.loading = false; this.error = err?.error?.message ?? 'Invalid email or password.'; }
    });
  }
}
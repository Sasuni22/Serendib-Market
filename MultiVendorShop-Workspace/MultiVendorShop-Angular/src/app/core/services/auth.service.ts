import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginDto, VendorRegisterDto, CustomerRegisterDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'mvs_token';
  private readonly USER_KEY  = 'mvs_user';

  private _authState = signal<AuthResponse | null>(this.loadUser());
  readonly user       = computed(() => this._authState());
  readonly isLoggedIn = computed(() => !!this._authState());
  readonly isVendor   = computed(() => this._authState()?.role === 'Vendor');
  readonly isCustomer = computed(() => this._authState()?.role === 'Customer');

  constructor(private http: HttpClient, private router: Router) {}

  vendorRegister(dto: VendorRegisterDto) {
    return this.http.post<AuthResponse>('/api/auth/vendor/register', dto).pipe(tap(r => this.saveAuth(r)));
  }
  vendorLogin(dto: LoginDto) {
    return this.http.post<AuthResponse>('/api/auth/vendor/login', dto).pipe(tap(r => this.saveAuth(r)));
  }
  customerRegister(dto: CustomerRegisterDto) {
    return this.http.post<AuthResponse>('/api/auth/customer/register', dto).pipe(tap(r => this.saveAuth(r)));
  }
  customerLogin(dto: LoginDto) {
    return this.http.post<AuthResponse>('/api/auth/customer/login', dto).pipe(tap(r => this.saveAuth(r)));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._authState.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null { return localStorage.getItem(this.TOKEN_KEY); }

  private saveAuth(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this._authState.set(res);
  }
  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      const user: AuthResponse = JSON.parse(raw);
      if (new Date(user.expiresAt) < new Date()) { localStorage.clear(); return null; }
      return user;
    } catch { return null; }
  }
}
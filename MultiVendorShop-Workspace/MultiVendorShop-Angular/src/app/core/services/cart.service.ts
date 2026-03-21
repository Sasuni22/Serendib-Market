import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Cart } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart = signal<Cart>({ items: [], totalAmount: 0, totalItems: 0 });
  readonly cart      = computed(() => this._cart());
  readonly cartCount = computed(() => this._cart().totalItems);
  readonly cartTotal = computed(() => this._cart().totalAmount);

  constructor(private http: HttpClient) {}

  load() {
    return this.http.get<Cart>('/api/cart').pipe(tap(c => this._cart.set(c)));
  }
  addToCart(productId: number, quantity: number) {
    return this.http.post('/api/cart', { productId, quantity }).pipe(tap(() => this.load().subscribe()));
  }
  removeItem(cartItemId: number) {
    return this.http.delete(`/api/cart/${cartItemId}`).pipe(tap(() => this.load().subscribe()));
  }
  clearCart() {
    return this.http.delete('/api/cart').pipe(tap(() => this._cart.set({ items: [], totalAmount: 0, totalItems: 0 })));
  }
}
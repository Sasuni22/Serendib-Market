import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(deliveryAddress: string, notes: string) {
    return this.http.post<Order>('/api/orders', { deliveryAddress, notes });
  }
  getMyOrders()    { return this.http.get<Order[]>('/api/orders'); }
  getById(id: number) { return this.http.get<Order>(`/api/orders/${id}`); }
  getVendorOrders(status?: string) {
    const url = status ? `/api/orders/vendor?status=${status}` : '/api/orders/vendor';
    return this.http.get<Order[]>(url);
  }
  updateStatus(id: number, status: string) {
    return this.http.put(`/api/orders/${id}/status`, { status });
  }
  cancelOrder(id: number) { return this.http.delete(`/api/orders/${id}/cancel`); }
}
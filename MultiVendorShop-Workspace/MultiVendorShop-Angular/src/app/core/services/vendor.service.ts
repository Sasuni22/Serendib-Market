import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor, VendorSales, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient) {}
  getAll()                { return this.http.get<Vendor[]>('/api/vendors'); }
  getById(id: number)     { return this.http.get<Vendor>(`/api/vendors/${id}`); }
  getSales(id: number)    { return this.http.get<VendorSales>(`/api/vendors/${id}/sales`); }
  getProducts(id: number) { return this.http.get<Product[]>(`/api/vendors/${id}/products`); }
}
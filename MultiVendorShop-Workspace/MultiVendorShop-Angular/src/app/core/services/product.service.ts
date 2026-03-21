import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductsPage, CreateProductDto } from '../models/models';

export interface ProductFilter {
  category?: string; vendorId?: number; minPrice?: number;
  maxPrice?: number; search?: string; page?: number; pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(filter: ProductFilter = {}) {
    let params = new HttpParams();
    if (filter.category)  params = params.set('category',  filter.category);
    if (filter.vendorId)  params = params.set('vendorId',  filter.vendorId);
    if (filter.minPrice)  params = params.set('minPrice',  filter.minPrice);
    if (filter.maxPrice)  params = params.set('maxPrice',  filter.maxPrice);
    if (filter.search)    params = params.set('search',    filter.search);
    if (filter.page)      params = params.set('page',      filter.page);
    params = params.set('pageSize', filter.pageSize ?? 12);
    return this.http.get<ProductsPage>('/api/products', { params });
  }
  getById(id: number)    { return this.http.get<Product>(`/api/products/${id}`); }
  getCategories()        { return this.http.get<string[]>('/api/products/categories'); }
  create(dto: CreateProductDto) { return this.http.post<Product>('/api/products', dto); }
  update(id: number, dto: Partial<CreateProductDto & { isAvailable: boolean }>) {
    return this.http.put(`/api/products/${id}`, dto);
  }
  delete(id: number) { return this.http.delete(`/api/products/${id}`); }
}
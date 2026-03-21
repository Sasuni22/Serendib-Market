import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { Product, CreateProductDto } from '../../../core/models/models';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-up">
      <div class="section-header">
        <div>
          <h2 class="section-title">My <span>products</span></h2>
          <p class="section-sub">{{ products.length }} listings</p>
        </div>
        <button class="btn btn-primary" (click)="openForm()">+ Add product</button>
      </div>

      @if (showForm) {
        <div class="product-form card fade-up">
          <h3>{{ editing ? 'Edit product' : 'New product listing' }}</h3>
          <div class="divider"></div>
          @if (formError)   { <div class="alert alert-error">{{ formError }}</div> }
          @if (formSuccess) { <div class="alert alert-success">{{ formSuccess }}</div> }
          <div class="form-grid-2">
            <div class="form-group"><label>Product name *</label><input class="form-control" [(ngModel)]="form.name" placeholder="Ceylon Cinnamon 100g" /></div>
            <div class="form-group">
              <label>Category *</label>
              <select class="form-control" [(ngModel)]="form.category">
                <option value="">Select category</option>
                <option>Spices</option><option>Electronics</option><option>Clothing</option><option>Home Decor</option><option>Food</option><option>Other</option>
              </select>
            </div>
            <div class="form-group"><label>Price (LKR) *</label><input class="form-control" type="number" [(ngModel)]="form.price" placeholder="850.00" /></div>
            <div class="form-group"><label>Stock quantity *</label><input class="form-control" type="number" [(ngModel)]="form.stock" placeholder="100" /></div>
          </div>
          <div class="form-group"><label>Description</label><textarea class="form-control" [(ngModel)]="form.description" rows="3" placeholder="Describe your product…"></textarea></div>
          <div class="form-group"><label>Image URL</label><input class="form-control" [(ngModel)]="form.imageUrl" placeholder="https://…" /></div>
          @if (editing) {
            <div class="form-group">
              <label class="toggle-label"><input type="checkbox" [(ngModel)]="formAvailable" /><span>Product is available for sale</span></label>
            </div>
          }
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
            <button class="btn btn-primary" [disabled]="saving" (click)="saveProduct()">
              @if (saving) { <span class="spinner-sm"></span> } {{ editing ? 'Save changes' : 'Create product' }}
            </button>
          </div>
        </div>
      }

      @if (loading) {
        <div class="loading-wrap"><div class="spinner"></div></div>
      } @else if (products.length === 0) {
        <div class="empty-state"><div class="empty-icon">🛒</div><h3>No products yet</h3><p>Add your first product listing to start selling.</p></div>
      } @else {
        <div class="products-table card">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price (LKR)</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (p of products; track p.id) {
                <tr>
                  <td>
                    <div class="td-product">
                      <span class="td-icon">{{ getCatIcon(p.category) }}</span>
                      <div><div class="td-name">{{ p.name }}</div><div class="td-desc">{{ p.description | slice:0:50 }}…</div></div>
                    </div>
                  </td>
                  <td><span class="badge badge-neutral">{{ p.category }}</span></td>
                  <td><span class="price">{{ p.price | number:'1.2-2' }}</span></td>
                  <td><span [class]="p.stock < 10 ? 'badge badge-danger' : 'badge badge-teal'">{{ p.stock }}</span></td>
                  <td><span [class]="p.isAvailable ? 'badge badge-teal' : 'badge badge-neutral'">{{ p.isAvailable ? 'Active' : 'Hidden' }}</span></td>
                  <td>
                    <div class="td-actions">
                      <button class="btn btn-secondary btn-sm" (click)="editProduct(p)">Edit</button>
                      <button class="btn btn-danger btn-sm"    (click)="deleteProduct(p)">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .product-form { padding: 28px; margin-bottom: 28px; h3 { font-family: var(--font-display); font-size: 1.3rem; } }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
    .toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: .9rem; input { width: 16px; height: 16px; accent-color: var(--teal); } }
    .spinner-sm { width:15px;height:15px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite; }
    .products-table { overflow: hidden;
      table { width: 100%; border-collapse: collapse; }
      th { text-align: left; padding: 12px 16px; font-size: .75rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .05em; color: var(--ink-faint); border-bottom: 1px solid rgba(26,26,24,.08); background: var(--ivory-dark); }
      td { padding: 14px 16px; border-bottom: 1px solid rgba(26,26,24,.05); vertical-align: middle; }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: var(--ivory-dark); }
    }
    .td-product { display: flex; align-items: center; gap: 12px; }
    .td-icon { font-size: 1.4rem; flex-shrink: 0; }
    .td-name { font-weight: 500; font-size: .9rem; }
    .td-desc { font-size: .75rem; color: var(--ink-faint); margin-top: 2px; }
    .td-actions { display: flex; gap: 6px; }
    @media (max-width: 700px) { .form-grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class VendorProductsComponent implements OnInit {
  private auth       = inject(AuthService);
  private productSvc = inject(ProductService);
  products: Product[] = []; loading = true; showForm = false;
  editing: Product | null = null; saving = false; formError = ''; formSuccess = ''; formAvailable = true;
  form: CreateProductDto = { name:'', description:'', price:0, stock:0, category:'', imageUrl:'' };

  ngOnInit() { this.loadProducts(); }
  loadProducts() {
    const id = this.auth.user()?.userId;
    if (!id) return;
    this.productSvc.getAll({ vendorId: id, pageSize: 50 }).subscribe({ next: res => { this.products = res.items; this.loading = false; }, error: () => this.loading = false });
  }
  openForm() { this.editing = null; this.form = { name:'', description:'', price:0, stock:0, category:'', imageUrl:'' }; this.formAvailable = true; this.formError = this.formSuccess = ''; this.showForm = true; }
  editProduct(p: Product) { this.editing = p; this.form = { name:p.name, description:p.description, price:p.price, stock:p.stock, category:p.category, imageUrl:p.imageUrl }; this.formAvailable = p.isAvailable; this.formError = this.formSuccess = ''; this.showForm = true; window.scrollTo({ top:0, behavior:'smooth' }); }
  cancelForm() { this.showForm = false; this.editing = null; }
  saveProduct() {
    this.formError = ''; this.saving = true;
    const call$ = this.editing
      ? this.productSvc.update(this.editing.id, { ...this.form, isAvailable: this.formAvailable })
      : this.productSvc.create(this.form);
    call$.subscribe({
      next: () => { this.formSuccess = this.editing ? 'Product updated!' : 'Product created!'; this.saving = false; this.loadProducts(); setTimeout(() => this.cancelForm(), 1500); },
      error: err => { this.saving = false; this.formError = err?.error?.message ?? 'Save failed.'; }
    });
  }
  deleteProduct(p: Product) { if (!confirm(`Delete "${p.name}"?`)) return; this.productSvc.delete(p.id).subscribe({ next: () => this.loadProducts() }); }
  getCatIcon(c: string) { return ({ Spices:'🌿', Electronics:'⚡', Clothing:'🧵', 'Home Decor':'🪔' } as any)[c] ?? '📦'; }
}
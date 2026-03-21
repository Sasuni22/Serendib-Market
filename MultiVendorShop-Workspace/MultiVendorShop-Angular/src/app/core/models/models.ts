export interface AuthResponse {
  token: string;
  role: 'Vendor' | 'Customer';
  userId: number;
  name: string;
  expiresAt: string;
}
export interface LoginDto { email: string; password: string; }
export interface VendorRegisterDto { shopName: string; email: string; password: string; phone: string; address: string; }
export interface CustomerRegisterDto { fullName: string; email: string; password: string; phone: string; deliveryAddress: string; }

export interface Product {
  id: number; name: string; description: string;
  price: number; stock: number; category: string;
  imageUrl: string; isAvailable: boolean;
  vendorId: number; vendorName: string; createdAt: string;
}
export interface CreateProductDto {
  name: string; description: string; price: number;
  stock: number; category: string; imageUrl: string;
}
export interface ProductsPage {
  totalCount: number; page: number; pageSize: number;
  totalPages: number; items: Product[];
}

export interface Vendor {
  id: number; shopName: string; email: string; phone: string;
  address: string; isActive: boolean; createdAt: string; totalProducts: number;
}
export interface VendorSales {
  vendorId: number; shopName: string; totalRevenue: number;
  totalOrderItems: number; totalUnitsSold: number; productSales: ProductSale[];
}
export interface ProductSale { productId: number; productName: string; unitsSold: number; revenue: number; }

export interface CartItem {
  cartItemId: number; productId: number; productName: string;
  vendorName: string; unitPrice: number; quantity: number;
  subtotal: number; availableStock: number;
}
export interface Cart { items: CartItem[]; totalAmount: number; totalItems: number; }

export interface Order {
  id: number; orderNumber: string; orderDate: string;
  status: OrderStatus; totalAmount: number; deliveryAddress: string;
  notes: string; customerId: number; customerName: string; items: OrderItem[];
}
export interface OrderItem {
  productId: number; productName: string; vendorName: string;
  quantity: number; unitPrice: number; subtotal: number;
}
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
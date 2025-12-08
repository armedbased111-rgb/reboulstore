/**
 * Types pour les entités du backend
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  images?: Image[];
  variants?: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  productId: string;
  url: string;
  alt: string;
  order: number;
  createdAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant?: Variant & { product?: Product };
  createdAt: string;
}

export interface Order {
  id: string;
  cartId: string;
  status: OrderStatus;
  total: number;
  customerInfo: CustomerInfo;
  cart?: Cart;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

// Types pour les paramètres de requête
export interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

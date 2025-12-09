/**
 * Types pour les entités du backend
 */

export interface SizeChartEntry {
  size: string;
  chest?: number;
  length?: number;
  waist?: number;
  hip?: number;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shippingPolicy?: {
    freeShippingThreshold?: number;
    deliveryTime?: string;
    internationalShipping?: boolean;
    shippingCost?: string;
    description?: string;
  };
  returnPolicy?: {
    returnWindow?: number;
    returnShippingFree?: boolean;
    conditions?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  megaMenuImage1?: string;
  megaMenuImage2?: string;
  megaMenuVideo1?: string;
  megaMenuVideo2?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  videoUrl?: string;
  sizeChart?: SizeChartEntry[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  shopId?: string;
  shop?: Shop;
  brandId?: string;
  brand?: Brand;
  images?: Image[];
  variants?: Variant[];
  createdAt: string;
  updatedAt: string;
  
  // Informations spécifiques au produit
  materials?: string;
  careInstructions?: string;
  madeIn?: string;
  customSizeChart?: SizeChartEntry[];
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
  brand?: string;
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

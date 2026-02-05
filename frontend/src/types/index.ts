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
  id: number;
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
  id: number;
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
  id: number;
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
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: Category;
  shopId?: number;
  shop?: Shop;
  brandId?: number;
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
  id: number;
  productId: number;
  url: string;
  alt: string;
  order: number;
  createdAt: string;
}

export interface Variant {
  id: number;
  productId: number;
  color: string;
  size: string;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  sessionId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;
  variant?: Variant & { product?: Product };
  createdAt: string;
}

export interface Order {
  id: number;
  cartId: number | null;
  status: OrderStatus;
  total: number;
  customerInfo: CustomerInfo;
  userId?: number | null;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;
  paymentIntentId?: string | null;
  items?: Array<{
    variantId: number;
    quantity: number;
  }> | null;
  trackingNumber?: string | null;
  paidAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cart?: Cart;
  createdAt: string;
  updatedAt: string;
}

export const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed', // @deprecated
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

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

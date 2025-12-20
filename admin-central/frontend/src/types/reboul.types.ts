/**
 * Types TypeScript pour les données Reboul
 */

/**
 * Statistiques produits
 */
export interface ProductsStats {
  total: number;
  withStock: number;
  outOfStock: number;
}

/**
 * Statistiques commandes
 */
export interface OrdersStats {
  total: number;
  totalRevenue: number;
  byStatus: {
    [key: string]: number;
  };
}

/**
 * Statistiques utilisateurs
 */
export interface UsersStats {
  total: number;
  byRole: {
    [key: string]: number;
  };
  withOrders: number;
  withoutOrders: number;
}

/**
 * Statistiques stocks
 */
export interface StocksStats {
  totalVariants: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
}

/**
 * Produit
 */
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId: string;
  brandId?: string | null;
  shopId?: string | null;
  materials?: string | null;
  careInstructions?: string | null;
  madeIn?: string | null;
  customSizeChart?: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }> | null;
  images?: Array<{
    id: string;
    url: string;
    publicId?: string | null;
    alt?: string | null;
    order: number;
  }>;
  variants?: Array<{
    id: string;
    color: string;
    size: string;
    stock: number;
    sku: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Adresse
 */
export interface Address {
  firstName?: string;
  lastName?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Item de commande
 */
export interface OrderItem {
  id?: string;
  variantId: string;
  quantity: number;
  variant?: {
    id: string;
    size?: string;
    color?: string;
    stock?: number;
    price?: number;
    product?: {
      id: string;
      name: string;
      price: number;
      images?: Array<{ url: string }>;
    };
  };
}

/**
 * Utilisateur
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  addresses?: Array<{
    id?: string;
    firstName?: string;
    lastName?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  }>;
  orders?: Order[];
  ordersCount?: number;
}

/**
 * Commande
 */
export interface Order {
  id: string;
  status: string;
  total: number;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Address;
  };
  shippingAddress?: Address;
  billingAddress?: Address;
  cart?: {
    id: string;
    items?: OrderItem[];
  };
  items?: OrderItem[]; // Pour les commandes Stripe Checkout
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

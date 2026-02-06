import { api } from './api';

export interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  expiresAt: string | null;
  maxUses: number;
  usedCount: number;
  minPurchaseAmount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidation {
  code: string;
  discountAmount: number;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

/**
 * Récupère tous les coupons actifs (endpoint public)
 */
export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    // L'API retourne déjà les données directement (response.data est extrait)
    const coupons = await api.get<Coupon[]>('/coupons/active');
    return Array.isArray(coupons) ? coupons : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des coupons:', error);
    return [];
  }
};

/**
 * Valide et applique un code promo à un panier
 */
export const applyCoupon = async (
  code: string,
  cartId: number,
): Promise<CouponValidation> => {
  // api.post retourne déjà les données directement (response.data est extrait)
  return await api.post<CouponValidation>('/orders/apply-coupon', {
    code,
    cartId,
  });
};


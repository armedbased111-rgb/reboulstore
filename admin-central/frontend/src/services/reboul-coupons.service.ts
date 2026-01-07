import api from './api';

export interface Coupon {
  id: string;
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

export interface CreateCouponDto {
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  expiresAt?: string;
  maxUses?: number;
  minPurchaseAmount?: number;
  isActive?: boolean;
}

/**
 * Service pour la gestion des coupons Reboul Store
 */
export const reboulCouponsService = {
  /**
   * Récupère tous les coupons
   */
  async getCoupons(): Promise<Coupon[]> {
    const response = await api.get<Coupon[]>('/admin/reboul/coupons');
    return response.data;
  },

  /**
   * Récupère un coupon par son ID
   */
  async getCoupon(id: string): Promise<Coupon> {
    const response = await api.get<Coupon>(`/admin/reboul/coupons/${id}`);
    return response.data;
  },

  /**
   * Crée un nouveau coupon
   */
  async createCoupon(data: CreateCouponDto): Promise<Coupon> {
    const response = await api.post<Coupon>('/admin/reboul/coupons', data);
    return response.data;
  },

  /**
   * Met à jour un coupon
   */
  async updateCoupon(id: string, data: Partial<CreateCouponDto>): Promise<Coupon> {
    const response = await api.patch<Coupon>(`/admin/reboul/coupons/${id}`, data);
    return response.data;
  },

  /**
   * Supprime un coupon
   */
  async deleteCoupon(id: string): Promise<void> {
    await api.delete(`/admin/reboul/coupons/${id}`);
  },
};


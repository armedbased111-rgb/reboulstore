import { api } from './api';

export interface SubscribeStockNotificationDto {
  email: string;
  phone?: string;
  variantId?: number;
}

export interface StockNotificationResponse {
  id: number;
  productId: number;
  variantId: number | null;
  email: string;
  phone: string | null;
  isNotified: boolean;
  notifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckSubscriptionResponse {
  isSubscribed: boolean;
  notification: StockNotificationResponse | null;
}

/**
 * Service pour gérer les notifications de stock
 */
export const stockNotificationsService = {
  /**
   * S'abonner aux notifications de stock pour un produit
   */
  async subscribe(
    productId: number,
    data: SubscribeStockNotificationDto,
  ): Promise<StockNotificationResponse> {
    return api.post<StockNotificationResponse>(
      `/products/${productId}/notify-stock`,
      data,
    );
  },

  /**
   * Vérifier si un utilisateur est déjà inscrit aux notifications
   */
  async checkSubscription(
    productId: number,
    email: string,
    variantId?: number,
  ): Promise<CheckSubscriptionResponse> {
    const params = new URLSearchParams({ email });
    if (variantId != null) {
      params.append('variantId', String(variantId));
    }

    return api.get<CheckSubscriptionResponse>(
      `/products/${productId}/notify-stock?${params.toString()}`,
    );
  },
};


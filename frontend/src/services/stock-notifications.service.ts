import { api } from './api';

export interface SubscribeStockNotificationDto {
  email: string;
  phone?: string;
  variantId?: string;
}

export interface StockNotificationResponse {
  id: string;
  productId: string;
  variantId: string | null;
  email: string;
  phone: string | null;
  isNotified: boolean;
  notifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
    productId: string,
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
    productId: string,
    email: string,
    variantId?: string,
  ): Promise<CheckSubscriptionResponse> {
    const params = new URLSearchParams({ email });
    if (variantId) {
      params.append('variantId', variantId);
    }

    return api.get<CheckSubscriptionResponse>(
      `/products/${productId}/notify-stock?${params.toString()}`,
    );
  },
};


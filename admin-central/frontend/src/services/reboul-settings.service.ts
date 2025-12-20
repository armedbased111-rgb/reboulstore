import api from './api';

/**
 * Interface pour les paramètres Reboul
 */
export interface ReboulSettings {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shippingPolicy?: {
    freeShippingThreshold?: number;
    deliveryTime?: string;
    internationalShipping?: boolean;
    standardShipping?: {
      cost: number;
      name?: string;
      description?: string;
    };
    expressShipping?: {
      cost: number;
      name?: string;
      description?: string;
    };
    description?: string;
  } | null;
  returnPolicy?: {
    returnWindow?: number;
    returnShippingFree?: boolean;
    conditions?: string;
  } | null;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  } | null;
  stripeConfig?: {
    accountId?: string;
    dashboardUrl?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service pour gérer les paramètres Reboul depuis l'API admin
 */
export const reboulSettingsService = {
  /**
   * Récupérer les paramètres Reboul
   */
  async getSettings(): Promise<ReboulSettings> {
    const response = await api.get<ReboulSettings>('/admin/reboul/settings');
    return response.data;
  },

  /**
   * Mettre à jour les paramètres Reboul
   */
  async updateSettings(data: Partial<ReboulSettings>): Promise<ReboulSettings> {
    const response = await api.patch<ReboulSettings>('/admin/reboul/settings', data);
    return response.data;
  },
};

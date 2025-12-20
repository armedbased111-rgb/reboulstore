import api from './api';
import { Order } from '../types/reboul.types';

/**
 * Interface pour la pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paramètres de requête pour les commandes
 */
export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  search?: string; // Recherche par email ou ID commande
  startDate?: string;
  endDate?: string;
}

/**
 * Service pour récupérer les commandes Reboul
 */
export const reboulOrdersService = {
  /**
   * Récupérer les dernières commandes
   * 
   * @param limit - Nombre de commandes à récupérer (défaut: 5)
   */
  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    const response = await api.get<PaginatedResponse<Order>>('/admin/reboul/orders', {
      params: {
        page: 1,
        limit,
      },
    });
    return response.data.data;
  },

  /**
   * Récupérer toutes les commandes avec pagination et filtres
   */
  async getOrders(params?: OrdersQueryParams): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>('/admin/reboul/orders', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer une commande par ID
   */
  async getOrder(id: string): Promise<Order> {
    const response = await api.get<Order>(`/admin/reboul/orders/${id}`);
    return response.data;
  },

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await api.patch<Order>(`/admin/reboul/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * Ajouter un numéro de tracking à une commande
   */
  async addTracking(id: string, trackingNumber: string): Promise<Order> {
    const response = await api.post<Order>(`/admin/reboul/orders/${id}/tracking`, {
      trackingNumber,
    });
    return response.data;
  },
};

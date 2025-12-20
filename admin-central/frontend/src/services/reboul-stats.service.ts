import api from './api';
import { ProductsStats, OrdersStats, UsersStats, StocksStats } from '../types/reboul.types';

/**
 * Service pour récupérer les statistiques Reboul depuis l'API admin
 */
export const reboulStatsService = {
  /**
   * Récupérer les statistiques des produits
   */
  async getProductsStats(): Promise<ProductsStats> {
    const response = await api.get<ProductsStats>('/admin/reboul/products/stats');
    return response.data;
  },

  /**
   * Récupérer les statistiques des commandes
   */
  async getOrdersStats(): Promise<OrdersStats> {
    const response = await api.get<OrdersStats>('/admin/reboul/orders/stats');
    return response.data;
  },

  /**
   * Récupérer les statistiques des utilisateurs
   */
  async getUsersStats(): Promise<UsersStats> {
    const response = await api.get<UsersStats>('/admin/reboul/users/stats');
    return response.data;
  },

  /**
   * Récupérer les statistiques des stocks
   */
  async getStocksStats(): Promise<StocksStats> {
    const response = await api.get<StocksStats>('/admin/reboul/stocks/stats');
    return response.data;
  },
};

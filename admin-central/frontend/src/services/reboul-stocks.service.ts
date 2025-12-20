import api from './api';
import { StocksStats } from '../types/reboul.types';

/**
 * Service API pour les stocks Reboul
 */
export const reboulStocksService = {
  /**
   * Récupérer les statistiques des stocks
   */
  async getStats(): Promise<StocksStats> {
    const response = await api.get<StocksStats>('/admin/reboul/stocks/stats');
    return response.data;
  },
};

import { useState, useEffect } from 'react';
import { reboulStatsService } from '../services/reboul-stats.service';
import { ProductsStats, OrdersStats, UsersStats, StocksStats } from '../types/reboul.types';

/**
 * Hook pour récupérer toutes les statistiques Reboul
 * 
 * @returns Statistiques avec états loading et error
 */
export function useReboulStats() {
  const [productsStats, setProductsStats] = useState<ProductsStats | null>(null);
  const [ordersStats, setOrdersStats] = useState<OrdersStats | null>(null);
  const [usersStats, setUsersStats] = useState<UsersStats | null>(null);
  const [stocksStats, setStocksStats] = useState<StocksStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger toutes les statistiques en parallèle
        const [products, orders, users, stocks] = await Promise.all([
          reboulStatsService.getProductsStats(),
          reboulStatsService.getOrdersStats(),
          reboulStatsService.getUsersStats(),
          reboulStatsService.getStocksStats(),
        ]);

        setProductsStats(products);
        setOrdersStats(orders);
        setUsersStats(users);
        setStocksStats(stocks);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des statistiques'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    productsStats,
    ordersStats,
    usersStats,
    stocksStats,
    loading,
    error,
    refetch: () => {
      // Retrigger l'effet en changeant une dépendance
      setLoading(true);
      setError(null);
      setProductsStats(null);
      setOrdersStats(null);
      setUsersStats(null);
      setStocksStats(null);
    },
  };
}

import { useState, useEffect } from 'react';
import { reboulOrdersService } from '../services/reboul-orders.service';
import { Order } from '../types/reboul.types';

/**
 * Hook pour récupérer les dernières commandes Reboul
 * 
 * @param limit - Nombre de commandes à récupérer (défaut: 5)
 * @returns Liste des commandes avec états loading et error
 */
export function useRecentOrders(limit: number = 5) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reboulOrdersService.getRecentOrders(limit);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des commandes'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [limit]);

  return { orders, loading, error, refetch: () => {} };
}

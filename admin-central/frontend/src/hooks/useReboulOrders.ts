import { useState, useEffect, useCallback } from 'react';
import { reboulOrdersService, OrdersQueryParams } from '../services/reboul-orders.service';
import { Order } from '../types/reboul.types';
import { PaginatedResponse } from '../services/reboul-orders.service';

/**
 * Hook pour récupérer les commandes Reboul avec pagination et filtres
 * 
 * @param initialParams - Paramètres initiaux de la requête
 * @returns Données commandes, états loading/error, et fonction refetch
 */
export function useReboulOrders(initialParams?: OrdersQueryParams) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<OrdersQueryParams>(initialParams || {});

  const fetchOrders = useCallback(async (currentParams: OrdersQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Order> = await reboulOrdersService.getOrders(currentParams);
      setOrders(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des commandes'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(params);
  }, [fetchOrders, params.page, params.limit, params.status, params.userId, params.search, params.startDate, params.endDate]);

  const updateParams = useCallback((newParams: Partial<OrdersQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 })); // Reset page à 1 lors d'un changement de filtres
  }, []);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => {
    fetchOrders(params);
  }, [fetchOrders, params]);

  return {
    orders,
    pagination,
    loading,
    error,
    refetch,
    updateParams,
    changePage,
  };
}

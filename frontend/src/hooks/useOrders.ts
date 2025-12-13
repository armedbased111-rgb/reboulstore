import { useState, useEffect, useCallback } from 'react';
import { getMyOrders, getOrder, type Order } from '../services/orders';

/**
 * Hook pour récupérer les commandes de l'utilisateur connecté
 */
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors de la récupération des commandes'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};

/**
 * Hook pour récupérer une commande spécifique par ID
 */
export const useOrder = (id: string | undefined) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors de la récupération de la commande'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
};


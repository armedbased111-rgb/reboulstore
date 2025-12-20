import { useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cart';
import { useLocalStorage } from './useLocalStorage';
import type { Cart } from '../types/index';

interface UseCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => void;
  total: number;
}

// Fonction pour générer un sessionId unique
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useCart = (): UseCartReturn => {
  // Persister sessionId dans localStorage
  const [sessionId, _setSessionId] = useLocalStorage<string>('cart_session_id', generateSessionId());
  
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger le panier
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart(sessionId);
      setCart(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Charger le panier au montage
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Ajouter un article au panier
  const addToCart = useCallback(async (variantId: string, quantity: number) => {
    try {
      setError(null);
      await cartService.addToCart(sessionId, variantId, quantity);
      // Recharger le panier après ajout
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout au panier');
      throw err;
    }
  }, [sessionId, fetchCart]);

  // Mettre à jour la quantité d'un article
  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setError(null);
      await cartService.updateCartItem(itemId, quantity, sessionId);
      // Recharger le panier après mise à jour
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du panier');
      throw err;
    }
  }, [sessionId, fetchCart]);

  // Retirer un article du panier
  const removeItem = useCallback(async (itemId: string) => {
    try {
      setError(null);
      await cartService.removeCartItem(itemId, sessionId);
      // Recharger le panier après suppression
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [sessionId, fetchCart]);

  // Vider le panier
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await cartService.clearCart(sessionId);
      // Recharger le panier (sera vide)
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du vidage du panier');
      throw err;
    }
  }, [sessionId, fetchCart]);

  // Calculer le total depuis le panier
  const total = cart?.total || 0;

  return {
    cart,
    loading,
    error,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refetch: fetchCart,
    total,
  };
};
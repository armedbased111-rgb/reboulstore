import { api } from './api';
import type { Cart, CartItem } from '../types/index';

/**
 * Service pour la gestion du panier
 */

// Récupérer ou créer un panier
export const getCart = async (sessionId: string): Promise<Cart> => {
  return await api.get<Cart>('/cart', {
    headers: {
      'X-Session-Id': sessionId,
    },
  });
};

// Ajouter un article au panier
export const addToCart = async (
  sessionId: string,
  variantId: string,
  quantity: number
): Promise<CartItem> => {
  return await api.post<CartItem>(
    '/cart/items',
    {
      variantId,
      quantity,
    },
    {
      headers: {
        'X-Session-Id': sessionId,
      },
    }
  );
};

// Mettre à jour la quantité d'un article
export const updateCartItem = async (
  itemId: string,
  quantity: number,
  sessionId: string
): Promise<CartItem> => {
  return await api.put<CartItem>(
    `/cart/items/${itemId}`,
    {
      quantity,
    },
    {
      headers: {
        'X-Session-Id': sessionId,
      },
    }
  );
};

// Retirer un article du panier
export const removeCartItem = async (
  itemId: string,
  sessionId: string
): Promise<void> => {
  await api.delete(`/cart/items/${itemId}`, {
    headers: {
      'X-Session-Id': sessionId,
    },
  });
};

// Vider le panier
export const clearCart = async (sessionId: string): Promise<void> => {
  await api.delete('/cart', {
    headers: {
      'X-Session-Id': sessionId,
    },
  });
};
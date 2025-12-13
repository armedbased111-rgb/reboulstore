import { api } from './api';
import type { Order, CustomerInfo } from '../types/index';

/**
 * Service pour la gestion des commandes
 */

// Interface pour créer une commande
export interface CreateOrderDto {
  cartId: string;
  customerInfo: CustomerInfo;
}

// Créer une commande depuis un panier
export const createOrder = async (
  dto: CreateOrderDto
): Promise<Order> => {
  return await api.post<Order>('/orders', dto);
};

// Récupérer les commandes de l'utilisateur connecté
export const getMyOrders = async (): Promise<Order[]> => {
  return await api.get<Order[]>('/orders/me');
};

// Récupérer une commande par ID
export const getOrder = async (id: string): Promise<Order> => {
  return await api.get<Order>(`/orders/${id}`);
};

// Annuler une commande
export const cancelOrder = async (id: string): Promise<Order> => {
  return await api.patch<Order>(`/orders/${id}/cancel`, {});
};

// Télécharger la facture d'une commande (PDF)
export const downloadInvoice = async (orderId: string): Promise<void> => {
  const token = localStorage.getItem('reboul_auth_token');
  if (!token) {
    throw new Error('Vous devez être connecté pour télécharger la facture');
  }
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  
  // Utiliser fetch directement pour télécharger le blob
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur réponse:', response.status, errorText);
    throw new Error(`Erreur lors du téléchargement de la facture (${response.status})`);
  }

  // Récupérer le blob
  const blob = await response.blob();

  // Créer un lien de téléchargement
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facture-${orderId.slice(0, 8)}.pdf`;
  document.body.appendChild(link);
  link.click();
  
  // Nettoyer
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
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

// Récupérer une commande par ID
export const getOrder = async (id: string): Promise<Order> => {
  return await api.get<Order>(`/orders/${id}`);
};
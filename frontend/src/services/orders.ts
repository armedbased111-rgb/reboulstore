import { api } from './api';
import type { Order, CustomerInfo } from '../types/index';

export type { Order };

export interface CreateOrderDto {
  cartId: string;
  customerInfo: CustomerInfo;
}

export const createOrder = async (dto: CreateOrderDto): Promise<Order> => {
  return await api.post<Order>('/orders', dto);
};

export const getOrder = async (id: string): Promise<Order> => {
  return await api.get<Order>(`/orders/${id}`);
};

import api from './api';
import type { Brand } from '../types';

/**
 * Récupérer toutes les marques
 */
export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get<Brand[]>('/brands');
  return response.data;
};

/**
 * Récupérer une marque par ID
 */
export const getBrand = async (id: string): Promise<Brand> => {
  const response = await api.get<Brand>(`/brands/${id}`);
  return response.data;
};

/**
 * Récupérer une marque par slug
 */
export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const response = await api.get<Brand>(`/brands/slug/${slug}`);
  return response.data;
};

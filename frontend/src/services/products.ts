import { api } from './api';
import type { Product, ProductQuery, PaginatedProductsResponse } from '../types/index';

/**
 * Service pour la gestion des produits
 */

export const getProducts = async (
  query?: ProductQuery
): Promise<PaginatedProductsResponse> => {
  return await api.get<PaginatedProductsResponse>('/products', {
    params: query,
  });
};

export const getProduct = async (id: string): Promise<Product> => {
  return await api.get<Product>(`/products/${id}`);
};

export const getProductsByCategory = async (
  categoryId: string,
  query?: ProductQuery
): Promise<PaginatedProductsResponse> => {
  return await api.get<PaginatedProductsResponse>(
    `/products/category/${categoryId}`,
    {
      params: query,
    }
  );
};
import { api } from './api';
import type { Product, ProductQuery, PaginatedProductsResponse } from '../types/index';

/**
 * Service pour la gestion des produits
 */

// Récupérer tous les produits avec filtres et pagination
export const getProducts = async (
  query?: ProductQuery
): Promise<PaginatedProductsResponse> => {
  return await api.get<PaginatedProductsResponse>('/products', {
    params: query,
  });
};

// Récupérer un produit par ID
export const getProduct = async (id: string): Promise<Product> => {
  return await api.get<Product>(`/products/${id}`);
};

// Récupérer les produits d'une catégorie
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
import api from './api';
import { Product } from '../types/reboul.types';

/**
 * Interface pour la pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paramètres de requête pour les produits
 */
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  // Note: Le tri n'est pas encore implémenté côté backend, mais préparé pour l'avenir
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Service pour récupérer les produits Reboul depuis l'API admin
 */
export const reboulProductsService = {
  /**
   * Récupérer tous les produits avec pagination et filtres
   */
  async getProducts(params?: ProductsQueryParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/admin/reboul/products', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer un produit par ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(`/admin/reboul/products/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau produit
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post<Product>('/admin/reboul/products', data);
    return response.data;
  },

  /**
   * Mettre à jour un produit
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.patch<Product>(`/admin/reboul/products/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un produit
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/admin/reboul/products/${id}`);
  },

  /**
   * Importer des produits depuis un tableau collé (Marque, Genre, Reference, Stock).
   */
  async importFromPaste(pastedText: string): Promise<{ created: number; updated: number; errors: { row: number; message: string }[] }> {
    const response = await api.post<{ created: number; updated: number; errors: { row: number; message: string }[] }>(
      '/admin/reboul/products/import-from-paste',
      { pastedText },
    );
    return response.data;
  },
};

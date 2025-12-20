import api from './api';

/**
 * Interface Catégorie
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  sizeChart?: Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }> | null;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

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
 * Paramètres de requête pour les catégories
 */
export interface CategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Service pour gérer les catégories Reboul depuis l'API admin
 */
export const reboulCategoriesService = {
  /**
   * Récupérer toutes les catégories avec pagination et filtres
   */
  async getCategories(params?: CategoriesQueryParams): Promise<PaginatedResponse<Category>> {
    const response = await api.get<PaginatedResponse<Category>>('/admin/reboul/categories', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer une catégorie par ID
   */
  async getCategory(id: string): Promise<Category> {
    const response = await api.get<Category>(`/admin/reboul/categories/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle catégorie
   */
  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await api.post<Category>('/admin/reboul/categories', data);
    return response.data;
  },

  /**
   * Mettre à jour une catégorie
   */
  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await api.patch<Category>(`/admin/reboul/categories/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/reboul/categories/${id}`);
  },

  /**
   * Récupérer toutes les catégories (sans pagination, pour les selects)
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<PaginatedResponse<Category>>('/admin/reboul/categories', {
      params: {
        limit: 1000, // Limite élevée pour récupérer toutes les catégories
      },
    });
    return response.data.data;
  },
};

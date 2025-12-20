import api from './api';

/**
 * Interface Marque
 */
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  megaMenuImage1?: string | null;
  megaMenuImage2?: string | null;
  megaMenuVideo1?: string | null;
  megaMenuVideo2?: string | null;
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
 * Paramètres de requête pour les marques
 */
export interface BrandsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Service pour gérer les marques Reboul depuis l'API admin
 */
export const reboulBrandsService = {
  /**
   * Récupérer toutes les marques avec pagination et filtres
   */
  async getBrands(params?: BrandsQueryParams): Promise<PaginatedResponse<Brand>> {
    const response = await api.get<PaginatedResponse<Brand>>('/admin/reboul/brands', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer une marque par ID
   */
  async getBrand(id: string): Promise<Brand> {
    const response = await api.get<Brand>(`/admin/reboul/brands/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle marque
   */
  async createBrand(data: Partial<Brand>): Promise<Brand> {
    const response = await api.post<Brand>('/admin/reboul/brands', data);
    return response.data;
  },

  /**
   * Mettre à jour une marque
   */
  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
    const response = await api.patch<Brand>(`/admin/reboul/brands/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une marque
   */
  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/admin/reboul/brands/${id}`);
  },

  /**
   * Récupérer toutes les marques (sans pagination, pour les selects)
   */
  async getAll(): Promise<Brand[]> {
    const response = await api.get<PaginatedResponse<Brand>>('/admin/reboul/brands', {
      params: {
        limit: 1000, // Limite élevée pour récupérer toutes les marques
      },
    });
    return response.data.data;
  },
};

import api from './api';

/**
 * Interface Collection
 */
export interface Collection {
  id: string;
  name: string;
  displayName?: string | null;
  isActive: boolean;
  description?: string | null;
  products?: any[]; // Produits associés (optionnel, chargé avec relations)
  productsCount?: number; // Nombre de produits (calculé côté backend si nécessaire)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service pour gérer les collections depuis l'API
 */
export const reboulCollectionsService = {
  /**
   * Récupérer toutes les collections
   */
  async getCollections(): Promise<Collection[]> {
    const response = await api.get<Collection[]>('/admin/reboul/collections');
    return response.data;
  },

  /**
   * Récupérer la collection active
   */
  async getActiveCollection(): Promise<Collection | null> {
    const response = await api.get<Collection>('/admin/reboul/collections/active');
    return response.data;
  },

  /**
   * Récupérer une collection par ID
   */
  async getCollection(id: string): Promise<Collection> {
    const response = await api.get<Collection>(`/admin/reboul/collections/${id}`);
    return response.data;
  },

  /**
   * Créer une nouvelle collection
   */
  async createCollection(data: {
    name: string;
    displayName?: string;
    description?: string;
    isActive?: boolean;
  }): Promise<Collection> {
    const response = await api.post<Collection>('/admin/reboul/collections', data);
    return response.data;
  },

  /**
   * Mettre à jour une collection
   */
  async updateCollection(
    id: string,
    data: {
      name?: string;
      displayName?: string;
      description?: string;
      isActive?: boolean;
    },
  ): Promise<Collection> {
    const response = await api.patch<Collection>(`/admin/reboul/collections/${id}`, data);
    return response.data;
  },

  /**
   * Activer une collection (désactive automatiquement les autres)
   */
  async activateCollection(id: string): Promise<Collection> {
    const response = await api.post<Collection>(`/admin/reboul/collections/${id}/activate`);
    return response.data;
  },

  /**
   * Archiver une collection (désactiver)
   */
  async archiveCollection(id: string): Promise<Collection> {
    const response = await api.post<Collection>(`/admin/reboul/collections/${id}/archive`);
    return response.data;
  },

  /**
   * Supprimer une collection
   */
  async deleteCollection(id: string): Promise<void> {
    await api.delete(`/admin/reboul/collections/${id}`);
  },
};


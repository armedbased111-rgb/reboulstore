import api from './api';
import { User } from '../types/reboul.types';

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
 * Paramètres de requête pour les utilisateurs
 */
export interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

/**
 * Service pour récupérer les utilisateurs Reboul depuis l'API admin
 */
export const reboulUsersService = {
  /**
   * Récupérer tous les utilisateurs avec pagination et filtres
   */
  async getUsers(params?: UsersQueryParams): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/admin/reboul/users', {
      params,
    });
    return response.data;
  },

  /**
   * Récupérer un utilisateur par ID
   */
  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/admin/reboul/users/${id}`);
    return response.data;
  },

  /**
   * Mettre à jour le rôle d'un utilisateur
   */
  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await api.patch<User>(`/admin/reboul/users/${id}/role`, { role });
    return response.data;
  },

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/reboul/users/${id}`);
  },
};

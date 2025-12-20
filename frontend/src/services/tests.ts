import { api } from './api';
import type { Test, TestQuery, PaginatedTestsResponse } from '../types/index';

/**
 * Service pour la gestion des tests
 */

// Récupérer tous les tests avec filtres et pagination
export const getTests = async (
  query?: TestQuery
): Promise<PaginatedTestsResponse> => {
  return await api.get<PaginatedTestsResponse>('/tests', {
    params: query,
  });
};

// Récupérer un test par ID
export const getTest = async (id: string): Promise<Test> => {
  return await api.get<Test>(`/tests/${id}`);
};

// Créer un nouveau test
export const createTest = async (
  data: Partial<Test>
): Promise<Test> => {
  return await api.post<Test>('/tests', data);
};

// Mettre à jour un test
export const updateTest = async (
  id: string,
  data: Partial<Test>
): Promise<Test> => {
  return await api.patch<Test>(`/tests/${id}`, data);
};

// Supprimer un test
export const deleteTest = async (id: string): Promise<void> => {
  return await api.delete(`/tests/${id}`);
};

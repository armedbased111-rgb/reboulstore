import { useState, useEffect, useCallback } from 'react';
import { reboulUsersService, UsersQueryParams } from '../services/reboul-users.service';
import { User } from '../types/reboul.types';
import { PaginatedResponse } from '../services/reboul-users.service';

/**
 * Hook pour récupérer les utilisateurs Reboul avec pagination et filtres
 * 
 * @param initialParams - Paramètres initiaux de la requête
 * @returns Données utilisateurs, états loading/error, et fonction refetch
 */
export function useReboulUsers(initialParams?: UsersQueryParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<UsersQueryParams>(initialParams || {});

  const fetchUsers = useCallback(async (currentParams: UsersQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<User> = await reboulUsersService.getUsers(currentParams);
      setUsers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des utilisateurs'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(params);
  }, [fetchUsers, params.page, params.limit, params.role, params.search]);

  const updateParams = useCallback((newParams: Partial<UsersQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 })); // Reset page à 1 lors d'un changement de filtres
  }, []);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => {
    fetchUsers(params);
  }, [fetchUsers, params]);

  return {
    users,
    pagination,
    loading,
    error,
    refetch,
    updateParams,
    changePage,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { reboulProductsService, ProductsQueryParams } from '../services/reboul-products.service';
import { Product } from '../types/reboul.types';
import { PaginatedResponse } from '../services/reboul-products.service';

/**
 * Hook pour récupérer les produits Reboul avec pagination et filtres
 * 
 * @param initialParams - Paramètres initiaux de la requête
 * @returns Données produits, états loading/error, et fonction refetch
 */
export function useReboulProducts(initialParams?: ProductsQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<ProductsQueryParams>(initialParams || {});

  const fetchProducts = useCallback(async (currentParams: ProductsQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Product> = await reboulProductsService.getProducts(currentParams);
      setProducts(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des produits'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(params);
  }, [fetchProducts, params.page, params.limit, params.search, params.categoryId, params.brandId]);

  const updateParams = useCallback((newParams: Partial<ProductsQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 })); // Reset page à 1 lors d'un changement de filtres
  }, []);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const refetch = useCallback(() => {
    fetchProducts(params);
  }, [fetchProducts, params]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
    updateParams,
    changePage,
  };
}

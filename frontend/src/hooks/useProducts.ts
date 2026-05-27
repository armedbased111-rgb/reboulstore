import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getProducts } from '../services/products';
import type { Product, ProductQuery, PaginatedProductsResponse } from '../types/index';

interface UseProductsReturn {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}
// null = skip (slug en cours de résolution), undefined = pas de filtre
export const useProducts = (query?: ProductQuery | null): UseProductsReturn => {
    const [data, setData] = useState<PaginatedProductsResponse>({
        products: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const queryString = useMemo(
        () => (query !== null ? JSON.stringify(query || {}) : null),
        [query]
    );

    const lastQueryRef = useRef<string | null>('');

    const fetchProducts = useCallback(async () => {
        if (queryString === null) {
            // Slug en cours de résolution — attendre sans lancer de requête
            setLoading(true);
            return;
        }
        if (lastQueryRef.current === queryString) {
            return;
        }
        lastQueryRef.current = queryString;
        try {
            setLoading(true);
            setError(null);
            const parsedQuery = JSON.parse(queryString);
            const response = await getProducts(parsedQuery);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    // Charger les produits au montage et à chaque changement de query
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Fonction pour charger manuellement les produits
    const refetch = useCallback(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products: data.products,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        loading,
        error,
        refetch,
    };
};
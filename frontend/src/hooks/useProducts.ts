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
export const useProducts = (query?: ProductQuery): UseProductsReturn => {
    // Etats pour stocker les données
    const [data, setData] = useState<PaginatedProductsResponse>({
        products: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Mémoriser la query pour éviter les re-renders infinis
    // Comparer les valeurs plutôt que la référence de l'objet
    const queryString = useMemo(() => JSON.stringify(query || {}), [
        query?.category,
        query?.minPrice,
        query?.maxPrice,
        query?.search,
        query?.page,
        query?.limit,
        query?.sortBy,
        query?.sortOrder,
    ]);
    
    // Garder une référence de la dernière query exécutée
    const lastQueryRef = useRef<string>('');

    // Fonction pour récupérer les produits
    const fetchProducts = useCallback(async () => {
        // Éviter les appels multiples avec la même query
        if (lastQueryRef.current === queryString) {
            return;
        }
        
        lastQueryRef.current = queryString;
        
        try {
            setLoading(true);
            setError(null);
            const parsedQuery = queryString ? JSON.parse(queryString) : undefined;
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
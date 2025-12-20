import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getTests } from '../services/tests';
import type { Test, TestQuery, PaginatedTestsResponse } from '../types/index';

/**
 * Hook pour gérer les tests
 * 
 * @param query - Paramètres de requête (optionnel)
 * @returns Données, état de chargement, erreur et fonction de refetch
 */
interface UseTestReturn {
    tests: Test[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useTest = (query?: TestQuery): UseTestReturn => {
    // États pour stocker les données
    const [data, setData] = useState<PaginatedTestsResponse>({
        tests: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Mémoriser la query pour éviter les re-renders infinis
    const queryString = useMemo(() => JSON.stringify(query || {}), [
        query?.page,
        query?.limit,
    ]);
    
    // Garder une référence de la dernière query exécutée
    const lastQueryRef = useRef<string>('');

    // Fonction pour récupérer les tests
    const fetchTests = useCallback(async () => {
        // Éviter les appels multiples avec la même query
        if (lastQueryRef.current === queryString) {
            return;
        }
        
        lastQueryRef.current = queryString;
        
        try {
            setLoading(true);
            setError(null);
            const parsedQuery = queryString ? JSON.parse(queryString) : undefined;
            const response = await getTests(parsedQuery);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tests');
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    // Charger les tests au montage et à chaque changement de query
    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    // Fonction pour charger manuellement les tests
    const refetch = useCallback(() => {
        fetchTests();
    }, [fetchTests]);

    return {
        tests: data.tests,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
        loading,
        error,
        refetch,
    };
};

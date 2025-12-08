import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../services/categories';
import type { Category } from '../types/index';

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
    // Etats pour stocker les données
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les catégories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCategories();
            setCategories(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
        } finally {
            setLoading(false);
        }
    }, []);

    // Charger les catégories au montage
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Fonction pour charger manuellement les catégories
    const refetch = useCallback(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch,
    };
}
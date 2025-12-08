import type { Product } from '../types/index';
import { getProduct } from '../services/products';
import { useState, useEffect } from 'react';


interface UseProductReturn {
    product: Product | null;
    loading: boolean;
    error: string | null;
}

export const useProduct = (id: string | undefined): UseProductReturn => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ne rien faire si pas d'ID
        if (!id) {
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProduct(id);
                setProduct(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Produit introuvable');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // se déclenche uniquement si l'ID change
    
    return {
        product,
        loading,
        error,
    };
}
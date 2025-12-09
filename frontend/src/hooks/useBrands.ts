import { useState, useEffect } from 'react';
import { getBrands } from '../services/brands';
import type { Brand } from '../types';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch brands'));
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  };
};

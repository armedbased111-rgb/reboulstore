import { useState, useEffect } from 'react';
import { getSearchSuggestions, type SearchSuggestion } from '../services/search';
import { useDebounce } from './useDebounce';

export const useSearch = (query: string, enabled: boolean = true) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!enabled || !debouncedQuery || debouncedQuery.trim() === '') {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getSearchSuggestions(debouncedQuery)
      .then((data) => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
        setLoading(false);
      });
  }, [debouncedQuery, enabled]);

  return { suggestions, loading, error };
};


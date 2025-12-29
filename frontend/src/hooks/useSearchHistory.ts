import { useState, useEffect, useCallback } from 'react';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = 'reboul_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Failed to parse search history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history to localStorage', error);
    }
  }, [history]);

  const addToHistory = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setHistory((prevHistory) => {
      // Remove duplicates
      const filteredHistory = prevHistory.filter(item => item.query.toLowerCase() !== trimmedQuery.toLowerCase());
      // Add new item to the beginning
      const newHistory = [{ query: trimmedQuery, timestamp: Date.now() }, ...filteredHistory];
      // Limit history size
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prevHistory) =>
      prevHistory.filter(item => item.query.toLowerCase() !== query.toLowerCase())
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
};


import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Fonction pour lire depuis localStorage
  const readValue = (): T => {
    // Si on est côté serveur (SSR), retourner la valeur initiale
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Erreur lors de la lecture de ${key} dans localStorage:`, error);
      return initialValue;
    }
  };

  // État initial : lire depuis localStorage
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre une fonction comme dans useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erreur lors de l'écriture de ${key} dans localStorage:`, error);
    }
  };

  // Écouter les changements depuis d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Erreur lors de la synchronisation de ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
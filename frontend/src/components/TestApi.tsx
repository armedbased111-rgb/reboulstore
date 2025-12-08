import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { loadingManager } from '../utils/loading';

// Type local pour éviter les problèmes d'import
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

/**
 * Composant de test pour vérifier que le service API fonctionne
 * À supprimer une fois les tests validés
 */
export function TestApi() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  // S'abonner au gestionnaire de chargement global
  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loading) => {
      setLoadingState(loading);
    });
    return unsubscribe;
  }, []);

  // Test de l'endpoint GET /categories
  const testApi = async () => {
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      // Test avec l'endpoint categories (simple et sûr)
      const data = await api.get('/categories');
      setResult(data);
      console.log('✅ Succès API:', data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error('❌ Erreur API:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  // Test de l'endpoint GET / (hello world)
  const testHello = async () => {
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.get('/');
      setResult(data);
      console.log('✅ Succès API Hello:', data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error('❌ Erreur API Hello:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Test du Service API</h2>
      
      {/* Indicateur de chargement global */}
      {loadingState && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          ⏳ Chargement global actif (via LoadingManager)
        </div>
      )}

      {/* Boutons de test */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={testApi}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Test en cours...' : 'Test GET /categories'}
        </button>
        
        <button
          onClick={testHello}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Test en cours...' : 'Test GET / (Hello)'}
        </button>
      </div>

      {/* Affichage du résultat */}
      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-400 text-green-800 rounded">
          <h3 className="font-bold mb-2">✅ Réponse réussie :</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Affichage de l'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-800 rounded">
          <h3 className="font-bold mb-2">❌ Erreur :</h3>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Status Code:</strong> {error.statusCode}</p>
          {error.error && <p><strong>Error:</strong> {error.error}</p>}
          {error.details && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Détails</summary>
              <pre className="text-sm mt-2 overflow-auto">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Informations de debug */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded">
        <h3 className="font-bold mb-2">🔍 Informations de debug :</h3>
        <p><strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'Non définie (fallback: http://localhost:3001)'}</p>
        <p><strong>Loading local:</strong> {isLoading ? 'Oui' : 'Non'}</p>
        <p><strong>Loading global:</strong> {loadingState ? 'Oui' : 'Non'}</p>
        <p><strong>Session ID:</strong> {localStorage.getItem('sessionId') || 'Non défini'}</p>
      </div>
    </div>
  );
}


import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { AxiosError } from 'axios';
import { loadingManager } from '../utils/loading';
import type { ApiResponse, ApiError } from '../types/api';

// Ré-export des types pour faciliter l'import
export type { ApiResponse, ApiError };

// Configuration de l'instance Axios
// Utiliser le proxy Vite quand disponible, sinon URL directe
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '9999' ? '/api' : 
   typeof window !== 'undefined' ? '/api' : 'http://localhost:3001');

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête
apiClient.interceptors.request.use(
  (config) => {
    loadingManager.start();
    
    // Ajouter le sessionId si disponible
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId;
    }
    
    // Ajouter le token JWT si disponible (pour les requêtes authentifiées)
    const token = localStorage.getItem('reboul_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => {
    loadingManager.stop();
    return response;
  },
  (error: AxiosError) => {
    loadingManager.stop();
    return handleApiError(error);
  }
);

// Fonction de gestion des erreurs
function handleApiError(error: AxiosError): Promise<ApiError> {
  if (!error.response) {
    const networkError: ApiError = {
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      statusCode: 0,
      error: 'Network Error',
    };
    return Promise.reject(networkError);
  }

  const statusCode = error.response.status;
  const responseData = error.response.data as any;

  const apiError: ApiError = {
    message: responseData?.message || error.message || 'Une erreur est survenue',
    statusCode,
    error: responseData?.error || 'API Error',
    details: responseData,
  };

  switch (statusCode) {
    case 401:
      apiError.message = 'Non autorisé. Veuillez vous connecter.';
      break;
    case 403:
      apiError.message = 'Accès refusé.';
      break;
    case 404:
      apiError.message = 'Ressource introuvable.';
      break;
    case 500:
      apiError.message = 'Erreur serveur. Veuillez réessayer plus tard.';
      break;
  }

  return Promise.reject(apiError);
}

// Fonctions utilitaires pour les requêtes HTTP
export const api = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data as any;
  },

  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data as any;
  },

  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data as any;
  },

  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data as any;
  },

  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data as any;
  },
};

export { apiClient };
export default apiClient;

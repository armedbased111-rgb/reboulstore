import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Instance Axios configurée pour l'API Admin
 * 
 * Configuration :
 * - Base URL : http://localhost:4001 (backend admin)
 * - Headers : Content-Type application/json
 * - Intercepteur : Ajoute le token JWT dans le header Authorization
 */
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête : Ajoute le token JWT dans le header Authorization
 * 
 * Le token est récupéré depuis localStorage sous la clé 'admin_auth_token'
 * Si le token n'existe pas, la requête est envoyée sans token (sera rejetée par le backend si route protégée)
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse : Gère les erreurs 401 (non authentifié)
 * 
 * Si une réponse 401 est reçue :
 * - Supprime le token du localStorage
 * - Redirige vers / (page de sélection de magasin)
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_user');
      
      // Redirection vers page d'accueil (sélection de magasin)
      if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/admin/reboul/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

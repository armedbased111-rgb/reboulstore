import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';
import type { User, RegisterData, LoginData } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'reboul_auth_token';
const USER_KEY = 'reboul_user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Charger le token et le user depuis localStorage au démarrage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          // Vérifier que le token est toujours valide en récupérant le profil
          try {
            const user = await authService.getMe(storedToken);
            setUser(user);
            setToken(storedToken);
          } catch (error) {
            // Token invalide, nettoyer le localStorage
            console.error('Token expired or invalid:', error);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      
      // Stocker le token et le user
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Inscription
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      // Stocker le token et le user
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Rafraîchir le profil utilisateur
   */
  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const user = await authService.getMe(token);
      setUser(user);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Refresh user error:', error);
      // Si erreur, déconnecter l'utilisateur
      logout();
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

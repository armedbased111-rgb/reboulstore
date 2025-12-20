import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminLoginDto } from '../types/admin.types';
import { adminAuthService } from '../services/admin-auth.service';

/**
 * Interface du contexte d'authentification admin
 */
interface AuthAdminContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (loginDto: AdminLoginDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Contexte d'authentification admin
 */
const AuthAdminContext = createContext<AuthAdminContextType | undefined>(undefined);

/**
 * Provider du contexte d'authentification admin
 * 
 * Gère :
 * - L'état de l'utilisateur admin connecté
 * - Les fonctions login/logout
 * - Le chargement initial de l'utilisateur depuis localStorage
 * - La vérification du token via API si nécessaire
 */
export function AuthAdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Charger l'utilisateur depuis localStorage au démarrage
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Vérifier si un token existe
        if (adminAuthService.isAuthenticated()) {
          // Récupérer l'utilisateur depuis localStorage (rapide)
          const storedUser = adminAuthService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }

          // Vérifier le token via API (pour s'assurer qu'il est encore valide)
          try {
            const currentUser = await adminAuthService.getMe();
            setUser(currentUser);
          } catch (error) {
            // Token invalide, déconnecter
            adminAuthService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        adminAuthService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Connexion admin
   */
  const login = async (loginDto: AdminLoginDto) => {
    try {
      const response = await adminAuthService.login(loginDto);
      setUser(response.user);
    } catch (error) {
      throw error; // L'erreur sera gérée par le composant qui appelle login
    }
  };

  /**
   * Déconnexion admin
   */
  const logout = () => {
    adminAuthService.logout();
    setUser(null);
  };

  /**
   * Rafraîchir les données de l'utilisateur depuis l'API
   */
  const refreshUser = async () => {
    try {
      const currentUser = await adminAuthService.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error);
      // Si erreur 401, déconnecter
      logout();
    }
  };

  const value: AuthAdminContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthAdminContext.Provider value={value}>
      {children}
    </AuthAdminContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification admin
 * 
 * @returns AuthAdminContextType
 * @throws Error si utilisé en dehors d'AuthAdminProvider
 */
export function useAuthAdmin(): AuthAdminContextType {
  const context = useContext(AuthAdminContext);
  if (context === undefined) {
    throw new Error('useAuthAdmin doit être utilisé dans un AuthAdminProvider');
  }
  return context;
}

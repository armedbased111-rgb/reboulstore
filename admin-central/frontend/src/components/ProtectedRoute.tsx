import { Navigate } from 'react-router-dom';
import { useAuthAdmin } from '../contexts/AuthAdminContext';

/**
 * Composant ProtectedRoute
 * 
 * Protège une route en vérifiant que l'utilisateur est authentifié
 * 
 * Si l'utilisateur n'est pas authentifié, redirige vers / (page de sélection de magasin)
 * 
 * @param children - Composants enfants à protéger
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthAdmin();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers page d'accueil (sélection de magasin) si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Afficher le contenu protégé
  return <>{children}</>;
}

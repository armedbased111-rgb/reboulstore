import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAdmin } from '../../contexts/AuthAdminContext';
import { LogOut, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import AdminNavigation from './AdminNavigation';

/**
 * Layout principal de l'admin
 * 
 * Structure :
 * - Topbar avec nom utilisateur et bouton logout
 * - Sidebar avec navigation (à venir)
 * - Contenu principal
 */
interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuthAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec tabs animées */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Navigation avec tabs animées (responsive) */}
            <div className="flex-1 min-w-0">
              <AdminNavigation />
            </div>

            {/* User menu à droite */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4 flex-shrink-0">
              {/* Nom utilisateur (masqué sur mobile très petit) */}
              <div className="hidden sm:flex items-center space-x-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">
                  {user?.firstName || user?.email}
                </span>
                {user?.role && (
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Bouton logout */}
              <button
                onClick={handleLogout}
                className={cn(
                  'inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors min-w-[44px] min-h-[44px] sm:min-w-0'
                )}
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4 sm:w-4" />
                <span className="hidden sm:inline ml-2">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

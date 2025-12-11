import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileInfoCard } from '../components/profile/ProfileInfoCard';
import { ProfileQuickAction } from '../components/profile/ProfileQuickAction';
import { ProfileActions } from '../components/profile/ProfileActions';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <p className="font-[Geist] text-[14px] text-[#4a5565]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-6 py-12">
      
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_720px] gap-6 mb-8">
        
        <ProfileInfoCard user={user} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileQuickAction
            title="Mes Commandes"
            description="Consultez l'historique de vos commandes"
            linkTo="/orders"
            buttonText="Voir mes commandes"
          />

          <ProfileQuickAction
            title="Mes Adresses"
            description="Gérez vos adresses de livraison"
            buttonText="Bientôt disponible"
            disabled
          />
        </div>
      </div>

      <ProfileActions onLogout={handleLogout} />

    </div>
  );
};

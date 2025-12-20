import { ProfileInfoField } from './ProfileInfoField';
import { ProfileRoleBadge } from './ProfileRoleBadge';
import type { User } from '../../services/auth';

interface ProfileInfoCardProps {
  user: User;
}

export const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => (
  <div className="bg-white border border-black p-[33px]">
    <h2 className="font-[Geist] font-bold text-[20px] leading-[24px] tracking-[-0.4px] uppercase mb-6">
      Informations personnelles
    </h2>
    
    <div className="space-y-6">
      <ProfileInfoField label="Email" value={user.email} />
      
      {user.firstName && (
        <ProfileInfoField label="Prénom" value={user.firstName} />
      )}
      
      {user.lastName && (
        <ProfileInfoField label="Nom" value={user.lastName} />
      )}
      
      {user.phone && (
        <ProfileInfoField label="Téléphone" value={user.phone} />
      )}
      
      <ProfileRoleBadge role={user.role} />
      
      <ProfileInfoField 
        label="Membre depuis" 
        value={new Date(user.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} 
      />
    </div>
  </div>
);

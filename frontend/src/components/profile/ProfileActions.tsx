import { Link } from 'react-router-dom';

interface ProfileActionsProps {
  onLogout: () => void;
}

export const ProfileActions = ({ onLogout }: ProfileActionsProps) => (
  <div className="flex flex-col items-center space-y-4 max-w-[448px] mx-auto">
    <button
      onClick={onLogout}
      className="w-full h-12 bg-transparent border border-[#e7000b] text-[#e7000b] rounded-md font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase hover:bg-red-50 transition-colors"
    >
      Se déconnecter
    </button>

    <Link 
      to="/" 
      className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] uppercase hover:text-black transition-colors"
    >
      ← Retour à l'accueil
    </Link>
  </div>
);

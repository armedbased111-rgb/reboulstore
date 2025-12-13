import { useNavigate } from 'react-router-dom';

interface OrderDetailHeaderProps {
  orderId: string;
  createdAt: string;
}

/**
 * Fonction pour formater la date complète
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Composant Header pour la page détail commande
 */
export const OrderDetailHeader = ({ orderId, createdAt }: OrderDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 lg:mb-0">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-[14px] leading-[20px] text-[#4a5565] hover:text-black transition-colors"
      >
        ← Retour à mes commandes
      </button>
      
      <h1 className="font-[Geist] font-medium text-[24px] md:text-[30px] leading-[32px] md:leading-[36px] tracking-[-0.75px] uppercase text-black mb-2">
        COMMANDE #{orderId.slice(0, 8).toUpperCase()}
      </h1>
      
      <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565]">
        Passée le {formatDate(createdAt)}
      </p>
    </div>
  );
};


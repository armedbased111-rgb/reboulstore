import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../../types/index';
import { formatPrice } from '../../utils/priceFormatter';
;

interface OrderCardProps {
  order: Order;
}

/**
 * Fonction pour obtenir la couleur du badge selon le statut (selon design Figma)
 */
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-gray-200 text-gray-800';
    case 'paid':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-orange-100 text-orange-800';
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-[#b9f8cf] text-[#0d542b]'; // Design Figma pour livrée
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-300 text-gray-900';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

/**
 * Fonction pour obtenir le label du statut en français
 */
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'EN ATTENTE';
    case 'paid':
      return 'PAYÉE';
    case 'processing':
      return 'EN TRAITEMENT';
    case 'shipped':
      return 'EXPÉDIÉE';
    case 'delivered':
      return 'LIVRÉE';
    case 'cancelled':
      return 'ANNULÉE';
    case 'refunded':
      return 'REMBOURSÉE';
    default:
      return status.toUpperCase();
  }
};

/**
 * Fonction pour formater la date
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Composant OrderCard - Affiche un résumé de commande dans la liste
 */
export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white border border-gray-200 rounded-[10px] p-[25px] hover:border-gray-400 transition-colors duration-200"
    >
      <div className="flex items-center justify-between w-full">
        {/* Colonne gauche : Infos commande */}
        <div className="flex flex-col gap-[8px] flex-1 pb-[16px]">
          <div className="flex gap-[16px] items-center w-full">
            <h3 className="font-[Geist] font-medium text-[18px] leading-[28px] tracking-[-0.45px] uppercase text-black">
              COMMANDE #{String(order.id)}
            </h3>
            <span className={`px-[8px] py-[4px] rounded-[4px] font-[Geist] font-medium text-[12px] leading-[16px] ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] w-full">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Colonne droite : Total et bouton */}
        <div className="flex flex-col gap-[8px] items-end">
          <p className="font-[Geist] font-medium text-[18px] leading-[28px] text-black">
            {formatPrice(order.total)}
          </p>
          <span className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] underline">
            Voir détails →
          </span>
        </div>
      </div>
    </Link>
  );
};


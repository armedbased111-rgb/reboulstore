import type { CartItem } from '../../types/index';
import { OrderItemDetail } from './OrderItemDetail';

interface OrderItemsListProps {
  items: CartItem[];
}

/**
 * Composant pour afficher la liste des articles d'une commande
 */
export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 lg:pt-[15px] lg:px-[24px] lg:pb-[7px] lg:min-h-[168px] flex flex-col">
      <h2 className="font-[Geist] font-medium text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black mb-4">
        ARTICLES
      </h2>
      
      {items.length === 0 ? (
        <p className="text-gray-600">Aucun article dans cette commande.</p>
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          {items.map((item) => (
            <OrderItemDetail key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

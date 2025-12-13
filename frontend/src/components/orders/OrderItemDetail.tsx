import type { CartItem } from '../../types/index';
import { formatPrice } from '../../utils/priceFormatter';
import { getImageUrl } from '../../utils/imageUtils';

interface OrderItemDetailProps {
  item: CartItem;
}

/**
 * Composant pour afficher un article individuel dans le détail de commande
 */
export const OrderItemDetail = ({ item }: OrderItemDetailProps) => {
  const product = item.variant?.product;
  const variant = item.variant;
  const image = product?.images?.[0];
  const imageUrl = image ? getImageUrl(image.url) : null;
  const productName = product?.name || 'Produit inconnu';
  const variantInfo = [
    variant?.color && `${variant.color}`,
    variant?.size && `Taille ${variant.size}`
  ].filter(Boolean).join(' - ');
  const totalPrice = (product?.price || 0) * item.quantity;

  return (
    <div className="flex gap-4 items-start">
      {/* Image produit */}
      <div className="h-20 w-20 bg-[#f3f4f6] border border-[#e5e7eb] rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={image?.alt || productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
            }}
          />
        ) : (
          <p className="font-[Geist] text-[12px] leading-[16px] text-[#99a1af] text-center">
            Pas d'image
          </p>
        )}
      </div>

      {/* Infos produit */}
      <div className="flex-1 flex flex-col gap-1">
        <h4 className="font-[Geist] font-medium text-[16px] leading-[24px] tracking-[-0.4px] uppercase text-black">
          {productName}
        </h4>
        {variantInfo && (
          <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565]">
            {variantInfo}
          </p>
        )}
        <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565]">
          Quantité : {item.quantity}
        </p>
      </div>

      {/* Prix */}
      <div className="flex flex-col items-end">
        <p className="font-[Geist] font-medium text-[16px] leading-[24px] text-black">
          {formatPrice(totalPrice)}
        </p>
      </div>
    </div>
  );
};


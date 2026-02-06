import type { CartItem as CartItemType } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';
import { formatPrice } from '../../utils/priceFormatter';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>;
  onRemove: (itemId: number) => Promise<void>;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const product = item.variant?.product;
  const variant = item.variant;
  const imageUrl = getImageUrl(product?.images?.[0]?.url) || '/placeholder-product.jpg';
  const itemPrice = product?.price ? product.price * item.quantity : 0;

  const handleIncrease = async () => {
    await onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start overflow-hidden gap-4 sm:gap-0">
      {/* Image produit - plus petite sur mobile, taille Figma sur desktop */}
      <div className="flex flex-col items-start justify-center pr-0 sm:pr-1 flex-shrink-0">
        <img
          src={imageUrl}
          alt={product?.name || 'Product'}
          className="w-24 h-32 sm:w-[128px] sm:h-[171px] object-cover"
        />
      </div>

      {/* Détails produit */}
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:justify-between gap-4 sm:gap-5 w-full">
        {/* Colonne gauche */}
        <div className="flex flex-col items-start gap-[14px] flex-1 w-full">
          {/* Nom produit */}
          <h3 className="font-[Geist] text-[11.4px] leading-[14px] font-medium text-black uppercase">
            {product?.name?.toUpperCase() || 'PRODUCT NAME'}
          </h3>

          {/* Quantity et Size */}
          <div className="flex flex-col items-start">
            {/* Quantity */}
            <div className="flex items-center pr-[22px]">
              <span className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black uppercase">
                Quantity:
              </span>
              <span className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black px-[8.9px]">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black hover:opacity-70 px-1"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Size */}
            <span className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black uppercase">
              Size: {variant?.size || 'N/A'}
            </span>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="font-[Geist] text-[11.6px] leading-[14px] font-medium text-black uppercase hover:opacity-70"
          >
            Remove
          </button>
        </div>

        {/* Prix total - à droite sur desktop, à gauche sur mobile */}
        <div className="font-[Geist] text-[10.9px] leading-[14px] font-medium text-black uppercase flex-shrink-0 sm:self-start self-start">
          Total {formatPrice(itemPrice)}
        </div>
      </div>
    </div>
  );
};

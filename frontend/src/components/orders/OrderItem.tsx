import type { CartItem } from '../../types/index';
import { formatPrice } from '../../utils/priceFormatter';
import { getImageUrl } from '../../utils/imageUtils';

interface OrderItemProps {
  item: CartItem;
}

/**
 * Composant OrderItem - Affiche un article dans une commande
 */
export const OrderItem = ({ item }: OrderItemProps) => {
  const product = item.variant?.product;
  const variant = item.variant;
  const image = product?.images?.[0];

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Image produit */}
      <div className="w-20 h-20 flex-shrink-0 border border-gray-200 overflow-hidden bg-gray-100">
        {image ? (() => {
          const imageUrl = getImageUrl(image.url);
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={image.alt || product?.name || 'Produit'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Pas d'image
            </div>
          );
        })() : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Pas d'image
          </div>
        )}
      </div>

      {/* Infos produit */}
      <div className="flex-1">
        <h4 className="font-medium uppercase tracking-tight mb-1">
          {product?.name || 'Produit inconnu'}
        </h4>
        <p className="text-sm text-gray-600 mb-1">
          {variant?.color && `${variant.color} - `}
          {variant?.size && `Taille ${variant.size}`}
        </p>
        <p className="text-sm text-gray-600">
          Quantité : {item.quantity}
        </p>
      </div>

      {/* Prix */}
      <div className="text-right">
        <p className="font-medium">
          {formatPrice((product?.price || 0) * item.quantity)}
        </p>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-500">
            {formatPrice(product?.price || 0)} × {item.quantity}
          </p>
        )}
      </div>
    </div>
  );
};


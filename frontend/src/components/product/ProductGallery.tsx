import type { Image, Product } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';
import { ProductBadge } from './ProductBadge';

interface ProductGalleryProps {
  images: Image[];
  productName: string;
  product?: Product;
}

/**
 * Galerie produit style A-COLD-WALL* (copie du site) :
 * - Toutes les images empilées verticalement à gauche
 * - Pas de thumbnails, pas de carrousel : on scroll la page pour voir chaque image
 * - Colonne droite (infos) reste sticky pendant le scroll
 */
export const ProductGallery = ({ images, productName, product }: ProductGalleryProps) => {
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-[2px]">
      {sortedImages.map((image, i) => (
        <div key={image.id} className="relative w-full bg-black/5">
          {product && i === 0 && <ProductBadge product={product} />}
          <picture className="block w-full">
            <img
              src={getImageUrl(image.url) || ''}
              alt={image.alt || `${productName} - ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-auto object-cover aspect-[3/4]"
            />
          </picture>
        </div>
      ))}
    </div>
  );
};

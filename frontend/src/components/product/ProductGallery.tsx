import type { Image } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';

interface ProductGalleryProps {
  images: Image[];
  productName: string;
}

/**
 * Galerie produit style A-COLD-WALL* (copie du site) :
 * - Toutes les images empilées verticalement à gauche
 * - Pas de thumbnails, pas de carrousel : on scroll la page pour voir chaque image
 * - Colonne droite (infos) reste sticky pendant le scroll
 */
export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const sortedImages = [...images]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .sort((a, b) => {
      const aIsBack = a.url.toLowerCase().includes('back');
      const bIsBack = b.url.toLowerCase().includes('back');
      return Number(aIsBack) - Number(bIsBack);
    });

  return (
    <div className="flex flex-col gap-[2px]">
      {sortedImages.map((image, i) => (
        <div key={image.id} className="relative w-full bg-white">
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

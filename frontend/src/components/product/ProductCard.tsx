import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Product } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

/**
 * Formate un prix en euros (format A-COLD-WALL* : €XX,XX)
 */
const formatPrice = (price: number): string => {
  const priceInEuros = price / 100;
  const formatted = priceInEuros.toFixed(2).replace('.', ',');
  return `€${formatted}`;
};

/**
 * Composant ProductCard - Carte produit style A-COLD-WALL*
 * 
 * Structure exacte copiée depuis A-COLD-WALL* :
 * - Lien vers page produit
 * - Figure avec aspect ratio 3/4
 * - Effet hover : 2 images superposées (première disparaît, deuxième apparaît)
 * - Nom produit en uppercase
 * - Prix barré + prix actuel
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [hoverImageError, setHoverImageError] = useState(false);

  const firstImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.order === 0) || product.images[0]
    : null;
  
  const secondImage = product.images && product.images.length > 1
    ? product.images.find(img => img.order === 1) || product.images[1]
    : null;

  const firstImageUrl = firstImage ? getImageUrl(firstImage.url) : null;
  const secondImageUrl = secondImage ? getImageUrl(secondImage.url) : null;

  // Calculer le prix réduit (30% de réduction comme dans FeaturedProducts)
  const originalPrice = product.price;
  const salePrice = Math.round(originalPrice * 0.7 * 100) / 100;
  const hasSale = true; // Pour l'instant, on affiche toujours le prix barré

  return (
    <li className="product-card">
      <Link 
        to={`/product/${product.id}`} 
        className="text-t3 group block"
      >
        <article>
          {/* Figure avec images et effet hover */}
          <figure className="mb-[2px] relative aspect-[3/4] overflow-hidden">
            {/* Image principale - visible par défaut, disparaît au hover sur desktop */}
            <div className="absolute inset-0 w-full h-full object-cover md:group-hover:opacity-0 transition-opacity">
              {firstImageUrl && !imageError ? (
                <img
                  src={firstImageUrl}
                  alt={firstImage?.alt || product.name}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-black opacity-10 flex items-center justify-center z-10">
                  <span className="text-gray-400 text-xs uppercase">No image</span>
                </div>
              )}
            </div>

            {/* Image hover - cachée par défaut, apparaît au hover sur desktop */}
            {secondImageUrl && (
              <div className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-opacity">
                {!hoverImageError ? (
                  <img
                    src={secondImageUrl}
                    alt={secondImage?.alt || product.name}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    loading="lazy"
                    onError={() => setHoverImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-black opacity-10 flex items-center justify-center z-10">
                    <span className="text-gray-400 text-xs uppercase">No image</span>
                  </div>
                )}
              </div>
            )}
          </figure>

          {/* Nom du produit */}
          <h4 className="uppercase">{product.name}</h4>

          {/* Prix */}
          <p></p>
          <div>
            {hasSale ? (
              <>
                <s className="mr-[.25em]">{formatPrice(originalPrice)}</s>
                <span>{formatPrice(salePrice)}</span>
              </>
            ) : (
              <span>{formatPrice(originalPrice)}</span>
            )}
          </div>
          <p></p>
        </article>
      </Link>
    </li>
  );
};

import type { Product } from '../../types';

interface ProductInfoProps {
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
 * Composant ProductInfo - Titre et prix style A-COLD-WALL*
 * 
 * Affiche :
 * - Titre du produit (h1, uppercase)
 * - Prix barré + prix réduit (30% de réduction)
 * - Description du produit
 */
export const ProductInfo = ({ product }: ProductInfoProps) => {
  // Calculer le prix réduit (30% de réduction)
  const originalPrice = product.price;
  const salePrice = Math.round(originalPrice * 0.7 * 100) / 100;
  const hasSale = true; // Pour l'instant, on affiche toujours le prix barré

  return (
    <div>
      {/* Titre produit */}
      <div className="text-h1">
        <h1>{product.name}</h1>
      </div>

      {/* Prix */}
      <div className="text-h1">
        {hasSale ? (
          <div>
            <s className="mr-[.25em]">{formatPrice(originalPrice)}</s>
            <span>{formatPrice(salePrice)}</span>
          </div>
        ) : (
          <span>{formatPrice(originalPrice)}</span>
        )}
      </div>

      {/* Description */}
      <div className="mt-8 text">
        <p>{product.description}</p>
      </div>
    </div>
  );
};

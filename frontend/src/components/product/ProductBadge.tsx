import type { Product } from '../../types';

interface ProductBadgeProps {
  product: Product;
}

/**
 * Composant ProductBadge - Badge "Nouveau", "Sale" ou "Stocks insuffisants" style A-COLD-WALL*
 * 
 * Affiche :
 * - Badge "Stocks insuffisants" si tous les variants sont épuisés (priorité absolue)
 * - Badge "Sale" si produit en promotion (prix barré)
 * - Badge "Nouveau" si produit créé il y a moins de 30 jours
 */
export const ProductBadge = ({ product }: ProductBadgeProps) => {
  // Vérifier si tous les variants sont épuisés (stock = 0)
  const isSoldOut = (() => {
    if (!product.variants || product.variants.length === 0) return false;
    return product.variants.every((variant) => (variant.stock || 0) === 0);
  })();

  // Calculer si le produit est nouveau (créé il y a moins de 30 jours)
  const isNew = (() => {
    if (!product.createdAt) return false;
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 30;
  })();

  // Vérifier si le produit est en promo (hasSale - pour l'instant toujours true selon ProductInfo)
  const hasSale = true; // Même logique que ProductInfo

  // Afficher "Stocks insuffisants" en priorité absolue
  if (isSoldOut) {
    return (
      <div className="absolute top-[8px] right-[8px] z-20 bg-black text-white px-[10px] py-[2.5px] rounded-md">
        <span className="font-[Geist] font-medium text-[12px] leading-[12px] tracking-[-0.35px] uppercase">
          STOCKS INSUFFISANTS
        </span>
      </div>
    );
  }

  // Afficher "Sale" en priorité
  if (hasSale) {
    return (
      <div className="absolute top-[8px] right-[8px] z-20 bg-black text-white px-[10px] py-[2.5px] rounded-md">
        <span className="font-[Geist] font-medium text-[12px] leading-[12px] tracking-[-0.35px] uppercase">
          SALE
        </span>
      </div>
    );
  }

  // Sinon afficher "Nouveau" si applicable
  if (isNew) {
    return (
      <div className="absolute top-[8px] right-[8px] z-20 bg-black text-white px-[10px] py-[2.5px] rounded-md">
        <span className="font-[Geist] font-medium text-[12px] leading-[12px] tracking-[-0.35px] uppercase">
          NOUVEAU
        </span>
      </div>
    );
  }

  return null;
};


import type { Variant } from '../../types';

interface StockBadgeProps {
  variant: Variant | null;
  stockThreshold?: number; // Seuil pour afficher "Dernières pièces" (défaut: 5)
}

/**
 * Composant StockBadge - Affichage du stock par variant
 * 
 * Option C hybride :
 * - Si stock > seuil : Affiche statut ("En stock")
 * - Si stock ≤ seuil : Affiche quantité exacte ("3 en stock")
 * - Si stock = 0 : Affiche "Rupture de stock"
 */
export const StockBadge = ({ variant, stockThreshold = 5 }: StockBadgeProps) => {
  if (!variant) return null;

  const stock = variant.stock || 0;

  // Rupture de stock
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 uppercase">
        Rupture de stock
      </span>
    );
  }

  // Stock faible (≤ seuil) : Afficher quantité
  if (stock <= stockThreshold) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 uppercase">
        {stock} {stock === 1 ? 'DERNIÈRE PIÈCE' : 'DERNIÈRES PIÈCES'}
      </span>
    );
  }

  // Stock normal (> seuil) : Afficher statut
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 uppercase">
      En stock
    </span>
  );
};


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { QuantitySelector } from './QuantitySelector';
import type { Variant } from '../../types';

interface AddToCartButtonProps {
  variant: Variant | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

/**
 * Composant AddToCartButton - Bouton ajout panier style A-COLD-WALL*
 * 
 * Bouton avec :
 * - Disabled si pas de variante sélectionnée
 * - Loading state pendant ajout
 * - Toast notification après succès
 * - Vérification stock
 */
export const AddToCartButton = ({
  variant,
  quantity,
  onQuantityChange,
}: AddToCartButtonProps) => {
  const { addToCart } = useCartContext();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    const maxQuantity = variant ? (variant.stock || 0) : 1;
    if (!maxQuantity || quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!variant) {
      showToast({
        message: 'Veuillez sélectionner une taille',
        duration: 2000,
      });
      return;
    }

    // Vérifier le stock (rupture de stock)
    if ((variant.stock || 0) === 0) {
      showToast({
        message: 'Rupture de stock',
        duration: 2000,
      });
      return;
    }

    // Vérifier le stock insuffisant
    if (variant.stock < quantity) {
      showToast({
        message: `Stock insuffisant. Seulement ${variant.stock} ${variant.stock === 1 ? 'article disponible' : 'articles disponibles'}`,
        duration: 2000,
      });
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(variant.id, quantity);
      
      // Afficher toast de succès avec lien vers le panier
      showToast({
        message: 'Ajouté au panier !',
        actionLabel: 'Voir le panier',
        onAction: () => navigate('/cart'),
        duration: 2000,
      });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Erreur lors de l\'ajout au panier',
        duration: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const maxQuantity = variant ? (variant.stock || 0) : 1;
  const isOutOfStock = variant ? (variant.stock || 0) === 0 : false;

  return (
    <div className="inline-flex items-center gap-3 w-full md:w-auto h-full">
      {/* Compteur quantité à gauche */}
      <div className="flex items-center">
        <QuantitySelector
          quantity={quantity}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          min={1}
          max={maxQuantity || undefined}
          disabled={!variant || isOutOfStock}
        />
      </div>

      {/* Bouton principal */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!variant || isAdding || isOutOfStock || (variant && variant.stock < quantity)}
        className="flex-1 inline-flex items-center justify-center gap-4 py-[9px] md:py-[5px] px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 disabled:cursor-not-allowed text-t2 text-white bg-black cursor-pointer transition-opacity h-full"
      >
        <span className="whitespace-nowrap">
          {isAdding ? 'AJOUT EN COURS...' : isOutOfStock ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}
        </span>
    </button>
    </div>
  );
};
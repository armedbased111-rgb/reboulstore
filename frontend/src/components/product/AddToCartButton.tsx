import { useState } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import type { Variant } from '../../types';

interface AddToCartButtonProps {
  variant: Variant | null;
  quantity?: number;
}

/**
 * Composant AddToCartButton - Bouton ajout panier style A-COLD-WALL*
 * 
 * Bouton avec :
 * - Disabled si pas de variante sélectionnée
 * - Loading state pendant ajout
 * - Success/error feedback
 * - Vérification stock
 */
export const AddToCartButton = ({
  variant,
  quantity = 1,
}: AddToCartButtonProps) => {
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!variant) {
      setMessage('Please select a size');
      return;
    }

    // Vérifier le stock
    if (variant.stock < quantity) {
      setMessage('Not enough stock');
      return;
    }

    try {
      setIsAdding(true);
      setMessage(null);
      await addToCart(variant.id, quantity);
      setMessage('Added to cart!');
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!variant || isAdding || (variant && variant.stock < quantity)}
        className="inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 whitespace-nowrap text-t2 text-white bg-black cursor-pointer"
      >
        {isAdding ? 'Adding...' : 'Add to cart'}
      </button>

      {/* Message feedback */}
      {message && (
        <p className={`mt-2 text-sm ${message.includes('Error') || message.includes('Not enough') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};
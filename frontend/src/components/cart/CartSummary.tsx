import { useState } from 'react';
import { formatPrice } from '../../utils/priceFormatter';
import { createCheckoutSession } from '../../services/checkout';
import { useCartContext } from '../../contexts/CartContext';

interface CartSummaryProps {
  subtotal: number;
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const { cart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Préparer les items pour le checkout (variantId, quantity)
      const items = cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      // Créer la session Stripe Checkout (fonctionne avec ou sans compte)
      const checkoutUrl = await createCheckoutSession(items);

      // Rediriger vers Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Erreur lors de la création de la session checkout:', err);
      setError(err.message || 'Une erreur est survenue lors du checkout');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      {/* Shipping info et Subtotal - vertical sur mobile, horizontal sur desktop */}
      <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-5 w-full">
        <span className="font-[Geist] text-[11.4px] leading-[14px] font-medium text-black uppercase">
          Shipping & Taxes calculated at checkout
        </span>

        <span className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black uppercase sm:text-right">
          Subtotal {formatPrice(subtotal)} EUR
        </span>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="text-red-600 text-sm font-[Geist] uppercase">
          {error}
        </div>
      )}

      {/* Bouton Checkout */}
      <button
        onClick={handleCheckout}
        disabled={loading || !cart || cart.items.length === 0}
        className="bg-black text-white rounded-md flex items-center justify-center py-1.5 px-6 font-[Geist] text-[12.6px] leading-4 font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full text-center uppercase"
      >
        {loading ? 'Redirection...' : 'Checkout now'}
      </button>
    </div>
  );
};

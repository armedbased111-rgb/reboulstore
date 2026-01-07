import { useState } from 'react';
import { formatPrice } from '../../utils/priceFormatter';
import { createCheckoutSession } from '../../services/checkout';
import { useCartContext } from '../../contexts/CartContext';
import { applyCoupon } from '../../services/coupons.service';

interface CartSummaryProps {
  subtotal: number;
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const { cart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    totalAfterDiscount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!cart || !couponCode.trim()) {
      setCouponError('Veuillez entrer un code promo');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const validation = await applyCoupon(couponCode.toUpperCase(), cart.id);
      setAppliedCoupon(validation);
      setCouponCode(''); // Vider le champ après application réussie
    } catch (err: unknown) {
      console.error('Erreur lors de l\'application du coupon:', err);
      setCouponError((err as { message?: string })?.message || 'Code promo invalide');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

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
      // Passer le code promo si un coupon est appliqué
      const checkoutUrl = await createCheckoutSession(
        items,
        appliedCoupon?.code,
      );

      // Rediriger vers Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      console.error('Erreur lors de la création de la session checkout:', err);
      setError((err as { message?: string })?.message || 'Une erreur est survenue lors du checkout');
      setLoading(false);
    }
  };

  // Calculer le total final avec réduction
  const finalTotal = appliedCoupon
    ? appliedCoupon.totalAfterDiscount
    : subtotal;

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      {/* Champ Code Promo */}
      <div className="flex flex-col gap-2 w-full">
        {!appliedCoupon ? (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Code promo"
              className="flex-1 px-3 py-1.5 border border-black/20 rounded-md font-[Geist] text-[11.4px] leading-[14px] uppercase focus:outline-none focus:border-black"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="px-4 py-1.5 bg-black text-white rounded-md font-[Geist] text-[11.4px] leading-[14px] font-medium uppercase hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {couponLoading ? '...' : 'Appliquer'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="flex flex-col">
              <span className="font-[Geist] text-[11.4px] leading-[14px] font-medium text-green-800 uppercase">
                Code {appliedCoupon.code} appliqué
              </span>
              <span className="font-[Geist] text-[10px] leading-[12px] text-green-600">
                Réduction: {formatPrice(appliedCoupon.discountAmount)} EUR
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-800 hover:text-green-900 font-[Geist] text-[11.4px] leading-[14px] uppercase"
            >
              Retirer
            </button>
          </div>
        )}
        {couponError && (
          <div className="text-red-600 text-[11px] font-[Geist] uppercase">
            {couponError}
          </div>
        )}
      </div>

      {/* Shipping info et Subtotal - vertical sur mobile, horizontal sur desktop */}
      <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-5 w-full">
        <span className="font-[Geist] text-[11.4px] leading-[14px] font-medium text-black uppercase">
          Shipping & Taxes calculated at checkout
        </span>

        <div className="flex flex-col items-end gap-1">
          {appliedCoupon && (
            <div className="flex flex-col items-end">
              <span className="font-[Geist] text-[10px] leading-[12px] text-black/60 line-through">
                Subtotal {formatPrice(subtotal)} EUR
              </span>
              <span className="font-[Geist] text-[10px] leading-[12px] text-green-600">
                -{formatPrice(appliedCoupon.discountAmount)} EUR
              </span>
            </div>
          )}
          <span className="font-[Geist] text-[11.1px] leading-[14px] font-medium text-black uppercase">
            {appliedCoupon ? 'Total' : 'Subtotal'} {formatPrice(finalTotal)} EUR
          </span>
        </div>
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

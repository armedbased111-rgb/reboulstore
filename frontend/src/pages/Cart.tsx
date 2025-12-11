import { useCartContext } from '../contexts/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyCart } from '../components/cart/EmptyCart';

export const Cart = () => {
  const { cart, loading, error, updateItem, removeItem } = useCartContext();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-black/60">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="w-full flex items-start justify-center text-left text-[11.4px] text-black font-[Geist]">
      {/* Container - padding adaptatif mobile/desktop */}
      <div className="flex-1 flex flex-col items-start pt-4 pb-8 px-4 sm:pt-1 sm:pb-[39px] sm:pl-1 sm:pr-0 max-w-full">
        {/* Section - max-width 420px sur desktop, full width sur mobile */}
        <div className="w-full flex flex-col items-start gap-6 sm:gap-8 max-w-full sm:max-w-[420px]">
          {/* Liste des items */}
          <div className="flex flex-col items-start gap-4 w-full">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Résumé et checkout */}
          <CartSummary subtotal={cart.total} />
        </div>
      </div>
    </div>
  );
};

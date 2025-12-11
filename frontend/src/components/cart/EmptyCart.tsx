import { Link } from 'react-router-dom';

export const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-medium text-black mb-4">
        Your cart is empty
      </h2>
      <p className="text-sm text-black/60 mb-8">
        Add items to your cart to continue shopping
      </p>
      <Link
        to="/catalog"
        className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-black/90 transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
};

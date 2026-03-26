import type { Product } from '../../types';
import { formatPrice } from '../../utils/priceFormatter';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div>
      {product.brand && (
        <p className="text-[12px] font-medium uppercase tracking-wide text-black/60 mb-1">
          {product.brand.name}
        </p>
      )}

      <h1 className="text-[32px] lg:text-[54px] font-medium leading-none mb-0">
        {product.name}
      </h1>

      <p className="text-[32px] lg:text-[54px] font-medium leading-none">
        {formatPrice(product.price)}
      </p>
    </div>
  );
};

import type { Product } from '../../types';
import { PRODUCT_PAGE_DECOR } from '../../copy/productPageDecor';
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

      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
        {PRODUCT_PAGE_DECOR.hudLine}
      </p>
    </div>
  );
};

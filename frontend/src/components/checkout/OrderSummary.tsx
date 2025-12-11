import { useState } from 'react';
import type { Cart } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';

interface OrderSummaryProps {
  cart: Cart | null;
}

export const OrderSummary = ({ cart }: OrderSummaryProps) => {
  const [discountCode, setDiscountCode] = useState('');

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.total;
  const shipping = 0; // TODO: Calculate shipping
  const total = subtotal + shipping;

  // Format price: €165.00 (with point, not comma for this component)
  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  return (
    <div className="w-[480px] flex flex-col items-start p-[38px] max-w-[480px] text-sm">
      <div className="flex flex-col items-start gap-[21px]">
        {/* Product list */}
        <div className="overflow-hidden flex items-start justify-center relative max-h-[360px]">
          <div className="flex-1 overflow-y-auto flex flex-col items-start py-[7px] pb-[3px] z-0">
            <div className="flex flex-col items-start">
              {cart.items.map((item, index) => {
                const product = item.variant?.product;
                const variant = item.variant;
                const imageUrl = getImageUrl(product?.images?.[0]?.url) || '/placeholder-product.jpg';
                const itemPrice = product?.price ? product.price * item.quantity : 0;

                return (
                  <div key={item.id} className={index > 0 ? "flex flex-col items-start pt-[14px]" : "h-[66px] relative"}>
                    <div className="h-[66px] relative">
                      {/* Image cell */}
                      <div className="absolute h-full top-0 bottom-0 left-0 flex flex-col items-start p-[1px] text-xs text-white">
                        <div className="w-16 h-16 shadow-[0px_1px_1.75px_rgba(0,0,0,0.12),0px_-0.5px_1.5px_rgba(0,0,0,0.09),0px_3px_4px_rgba(0,0,0,0.03)] rounded-xl bg-[#f1f1f1] flex flex-col items-start relative">
                          <img
                            src={imageUrl}
                            alt={product?.name || 'Product'}
                            className="rounded-xl max-w-full overflow-hidden max-h-full object-cover flex-shrink-0 z-0"
                          />
                          {/* Quantity badge */}
                          <div className="absolute -top-[7px] -right-[7.3px] flex flex-col items-start z-[1]">
                            <div className="rounded-md bg-black/50 border-2 border-white flex items-center justify-center py-[1px] px-[6.7px] min-w-6 min-h-6">
                              <span className="leading-[18px] font-medium text-white">{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product name & size cell */}
                      <div className="absolute w-[calc(100%-130.6px)] top-0 right-[64.6px] left-[66px] flex flex-col items-start justify-center py-[12.5px] pl-[14px] min-h-[64px]">
                        <div className="flex flex-col items-start">
                          <div className="flex flex-col items-start">
                            <span className="leading-[21px] text-black">{product?.name}</span>
                          </div>
                          <div className="flex flex-col items-start text-xs text-black/56">
                            <span className="leading-[18px]">{variant?.size || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price cell */}
                      <div className="absolute top-[12.5px] left-[339.4px] flex flex-col items-start justify-center pl-[14px]">
                        <div className="flex flex-col items-end">
                          <span className="leading-[21px]">{formatPrice(itemPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Discount code section */}
        <div className="flex items-start gap-[14px] text-[#707070]">
          <div className="w-[324.9px] flex flex-col items-start relative">
            <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
              <div className="w-[322.9px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Discount code</label>
          </div>
          <button className="shadow-[0px_0px_0px_1px_#dadada_inset] rounded-md bg-[#f1f1f1] overflow-hidden flex flex-col items-start py-[14.8px] px-[14px] opacity-50 text-center text-black">
            <div className="flex items-start justify-center">
              <span className="leading-[21px] font-medium">Apply</span>
            </div>
          </button>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-start">
          {/* Subtotal */}
          <div className="flex items-start gap-[154.9px]">
            <div className="w-[198.5px] flex flex-col items-start">
              <span className="leading-[21px]">Subtotal · {cart.items.length} item{cart.items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="leading-[21px]">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="flex flex-col items-start pt-[7px]">
            <div className="flex items-start gap-[105.7px]">
              <div className="w-[154.2px] flex flex-col items-start">
                <div className="flex items-center flex-wrap">
                  <span className="leading-[21px]">Shipping</span>
                </div>
              </div>
              <div className="flex flex-col items-end text-right text-black/56">
                <span className="leading-[21px]">Enter shipping address</span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col items-start pt-[17px] text-[19px]">
            <div className="flex items-center justify-center gap-[7px]">
              <div className="w-[297.1px] flex flex-col items-start">
                <span className="relative leading-[28.5px] font-medium">Total</span>
              </div>
              <div className="w-[99.9px] flex items-start text-xs text-black/56">
                <div className="w-[99.9px] relative">
                  <div className="absolute top-[6px] left-0 flex flex-col items-start py-0.5 pt-0.5">
                    <span className="leading-[18px]">EUR</span>
                  </div>
                  <div className="absolute -top-[0.25px] left-[31.22px] text-[19px] leading-[28.5px] font-medium text-black flex items-center w-[69px] h-[29px]">
                    {formatPrice(total)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

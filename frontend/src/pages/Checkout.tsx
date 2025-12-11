import { useCartContext } from '../contexts/CartContext';
import { ExpressCheckout } from '../components/checkout/ExpressCheckout';
import { ContactForm } from '../components/checkout/ContactForm';
import { DeliveryForm } from '../components/checkout/DeliveryForm';
import { ShippingMethod } from '../components/checkout/ShippingMethod';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Checkout = () => {
  const { cart, loading: cartLoading } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full min-h-[900px] bg-white relative overflow-y-auto text-[21px] text-black font-[Helvetica Neue]">
      <div className="w-full flex flex-col items-start min-h-[900px]">
        {/* Main container - max-width 1060px, centered */}
        <div className="w-full flex items-start justify-center min-h-[1672.28px]">
          <div className="w-[770px] flex items-start justify-end">
            {/* Left column - Form */}
            <div className="w-[580px] border-r border-[#dedede] flex flex-col items-start justify-center py-[38px] px-[38px] max-w-[580px]">
              <div className="w-[503px] h-auto flex flex-col items-start">
                {/* Form sections with gap 32px */}
                <div className="flex flex-col items-start gap-8">
                  {/* Express checkout + Contact */}
                  <div className="bg-white flex flex-col items-start gap-[17px] text-center text-sm text-black/56">
                    <ExpressCheckout />
                    <ContactForm />
                  </div>

                  {/* Delivery + Shipping */}
                  <div className="bg-white flex flex-col items-start">
                    <DeliveryForm />
                    <ShippingMethod />
                  </div>

                  {/* Payment */}
                  <div className="bg-white flex flex-col items-start gap-[14px]">
                    <PaymentForm />
                    {/* Pay now button */}
                    <button className="w-full rounded-md bg-black flex flex-col items-start p-[14px] text-center text-base text-white">
                      <div className="w-full flex items-start justify-center">
                        <div className="w-full flex flex-col items-center">
                          <span className="relative leading-6 font-medium">Pay now</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Footer links */}
                <div className="w-[503px] h-[82px] flex flex-col items-start justify-center pt-[46px] text-center text-sm">
                  <div className="w-full h-[36px] border-t border-[#dedede] flex flex-col items-start pt-[14px]">
                    <div className="flex items-start flex-wrap gap-x-[14px]">
                      <a href="#" className="rounded-md flex flex-col items-start">
                        <div className="flex items-start justify-center">
                          <span className="leading-[21px]">Refund policy</span>
                        </div>
                      </a>
                      <a href="#" className="rounded-md flex flex-col items-start">
                        <div className="flex items-start justify-center">
                          <span className="leading-[21px]">Privacy policy</span>
                        </div>
                      </a>
                      <a href="#" className="rounded-md flex flex-col items-start">
                        <div className="flex items-start justify-center">
                          <span className="leading-[21px]">Terms of service</span>
                        </div>
                      </a>
                      <a href="#" className="rounded-md flex flex-col items-start">
                        <div className="flex items-start justify-center">
                          <span className="leading-[21px]">Cancellations</span>
                        </div>
                      </a>
                      <a href="#" className="rounded-md flex flex-col items-start">
                        <div className="flex items-start justify-center">
                          <span className="leading-[21px]">Contact</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="bg-[#fafafa] w-[670px] flex flex-col items-start text-sm">
              <OrderSummary cart={cart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

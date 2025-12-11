import { useState } from 'react';

export const PaymentForm = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    nameOnCard: '',
    useShippingAddress: true,
    rememberMe: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col items-start gap-[14px]">
      {/* Header */}
      <div className="flex flex-col items-start gap-[5px]">
        <div className="flex flex-col items-start">
          <span className="relative leading-[25.2px] font-medium text-base">Payment</span>
        </div>
        <div className="flex flex-col items-start text-sm text-black/56">
          <span className="relative leading-[21px]">All transactions are secure and encrypted.</span>
        </div>
      </div>

      {/* Credit card form */}
      <div className="flex flex-col items-start gap-[26px] text-sm">
        <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
          {/* Header with credit card title and payment icons */}
          <div className="w-[501px] rounded-t-md bg-[#f6f6f6] flex items-center justify-center py-[13px] px-[14px] relative gap-[11px]">
            <div className="w-[295px] flex items-start z-0 flex-shrink-0">
              <div className="flex flex-col items-start">
                <span className="relative leading-[21px]">Credit card</span>
              </div>
            </div>
            <div className="w-[167px] flex flex-col items-start z-[1] flex-shrink-0 text-xs">
              <div className="flex items-start">
                <div className="flex items-center flex-wrap gap-x-[5px]">
                  {/* Payment method icons */}
                  <span className="text-xs">Visa</span>
                  <span className="text-xs">MC</span>
                  <span className="text-xs">Amex</span>
                  <div className="rounded-sm bg-white border border-black/7 flex flex-col items-start py-0.5 px-0 max-h-6">
                    <div className="w-9 flex flex-col items-center justify-center">
                      <span className="leading-[18px] font-medium">+5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Border */}
            <div className="absolute top-[-1px] right-[-1px] bottom-[-1px] left-[-1px] rounded-t-md border border-black z-[2] pointer-events-none"></div>
          </div>

          {/* Form fields */}
          <div className="w-[501px] rounded-b-md bg-black/4 border-t border-[#dedede] flex flex-col items-start p-[14px] text-[14.4px] text-[#707070]">
            <div className="flex flex-col items-start">
              {/* Card number */}
              <div className="flex flex-col items-start relative">
                <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start relative z-0">
                  <div className="w-[471px] h-12 relative rounded-md overflow-hidden flex-shrink-0 z-0">
                    <div className="absolute w-full top-0 right-0 left-0 h-[49px] overflow-hidden flex flex-col items-start py-[16.4px] pr-11 pl-[11.3px]">
                      <div className="overflow-hidden flex items-start justify-center">
                        <input
                          type="text"
                          placeholder="Card number"
                          value={paymentData.cardNumber}
                          onChange={(e) => handleChange('cardNumber', e.target.value)}
                          className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Lock icon */}
                  <div className="absolute top-[32%] right-[15px] w-[18px] h-[36%] pointer-events-none z-[1]">🔒</div>
                </div>
                <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Card number</label>
              </div>

              {/* Expiry & Security code */}
              <div className="flex items-start justify-center gap-[14px]">
                {/* Expiry date */}
                <div className="w-[229.5px] flex flex-col items-start">
                  <div className="flex flex-col items-start relative">
                    <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                      <div className="w-[227.5px] h-12 relative rounded-md overflow-hidden flex-shrink-0">
                        <div className="absolute w-full top-0 right-0 left-0 h-[49px] overflow-hidden flex flex-col items-start">
                          <div className="overflow-hidden flex items-start justify-center py-4 px-[11px]">
                            <input
                              type="text"
                              placeholder="Expiration date (MM / YY)"
                              value={paymentData.expiryDate}
                              onChange={(e) => handleChange('expiryDate', e.target.value)}
                              className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Expiration date (MM / YY)</label>
                  </div>
                </div>

                {/* Security code */}
                <div className="w-[229.5px] flex flex-col items-start">
                  <div className="flex flex-col items-start relative">
                    <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start relative z-0">
                      <div className="w-[227.5px] h-12 relative rounded-md overflow-hidden flex-shrink-0 z-0">
                        <div className="absolute w-full top-0 right-0 left-0 h-[49px] overflow-hidden flex flex-col items-start">
                          <div className="overflow-hidden flex items-start justify-center py-4 px-[11px]">
                            <input
                              type="text"
                              placeholder="Security code"
                              value={paymentData.securityCode}
                              onChange={(e) => handleChange('securityCode', e.target.value)}
                              className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Info icon */}
                      <div className="absolute top-[32%] right-[15px] w-[18px] h-[36%] pointer-events-none z-[1]">ℹ️</div>
                    </div>
                    <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Security code</label>
                  </div>
                </div>
              </div>

              {/* Name on card */}
              <div className="flex flex-col items-start relative">
                <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                  <div className="w-[471px] h-12 relative rounded-md overflow-hidden flex-shrink-0">
                    <div className="absolute w-full top-0 right-0 left-0 h-[49px] overflow-hidden flex flex-col items-start">
                      <div className="overflow-hidden flex items-start justify-center py-4 px-[11px]">
                        <input
                          type="text"
                          placeholder="Name on card"
                          value={paymentData.nameOnCard}
                          onChange={(e) => handleChange('nameOnCard', e.target.value)}
                          className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Name on card</label>
              </div>
            </div>

            {/* Billing address checkbox */}
            <div className="flex items-start relative text-sm text-black">
              <div className="h-[19px] w-[18px] flex flex-col items-start justify-center py-[1px] pl-[1px] relative">
                <div className={`w-[18px] flex-1 rounded border border-[#dedede] bg-white overflow-hidden flex flex-col items-start justify-center ${paymentData.useShippingAddress ? 'border-[#592ff4]' : ''}`}>
                  <div className="flex-1 rounded-sm bg-transparent opacity-30"></div>
                </div>
                {paymentData.useShippingAddress && (
                  <div className="absolute top-[5px] left-[5px] w-[10px] h-[10px] bg-[#592ff4] rounded-sm"></div>
                )}
              </div>
              <div className="flex flex-col items-start pl-[11px] max-w-[473px]">
                <span className="leading-[21px]">Use shipping address as billing address</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remember me section */}
        <div className="h-[117.7px] relative text-base">
          <div className="absolute w-full top-[19.19px] right-0 left-0 h-[14px]"></div>
          <div className="absolute w-full top-[84.19px] right-0 left-0 h-[11px]"></div>
          
          <div className="absolute w-full top-0 right-0 left-0 flex flex-col items-start">
            <span className="relative leading-[19.2px] font-medium">Remember me</span>
          </div>

          <div className="absolute w-full top-[33.19px] right-0 left-0 rounded-md bg-white border border-[#dedede] flex flex-col items-start text-sm">
            <div className="w-[501px] rounded-md flex items-start p-[14px] gap-[11px]">
              <div className="h-[19px] w-[18px] flex flex-col items-start justify-center py-[1px] pl-[1px] relative">
                <div className={`w-[18px] flex-1 rounded border border-[#dedede] bg-white overflow-hidden flex flex-col items-start justify-center ${paymentData.rememberMe ? 'border-[#592ff4]' : ''}`}>
                  <div className="flex-1 rounded-sm bg-transparent"></div>
                </div>
                {paymentData.rememberMe && (
                  <div className="absolute top-[5px] left-[5px] w-[10px] h-[10px] bg-[#592ff4] rounded-sm"></div>
                )}
              </div>
              <div className="w-[444px] flex flex-col items-start">
                <span className="leading-[21px]">Save my information for a faster checkout</span>
              </div>
            </div>
          </div>

          <div className="absolute w-full top-[95.19px] right-0 left-0 flex items-start justify-center text-xs text-black/56">
            <div className="w-[459px] flex items-center gap-[5px]">
              <div className="w-[10px] h-[10px] min-w-[10px] max-w-[459px] min-h-[10px] max-h-[22.5px]">🔒</div>
              <div className="flex flex-col items-start">
                <span className="leading-[18px]">Secure and encrypted</span>
              </div>
              <div className="w-11 max-h-full">
                <a href="#" className="underline">shop</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

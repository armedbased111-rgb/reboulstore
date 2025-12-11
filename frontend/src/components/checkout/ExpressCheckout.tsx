export const ExpressCheckout = () => {
  return (
    <>
      {/* Express checkout section */}
      <div className="flex flex-col items-start gap-[17px]">
        <div className="h-[18px] relative">
          <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="relative leading-[21px]">Express checkout</span>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-start justify-center flex-wrap gap-x-[11px]">
          {/* Shop Pay button */}
          <button className="h-12 rounded-md bg-[#592ff4] flex items-center justify-center px-[98.5px]">
            <span className="text-white">shop</span>
          </button>
          
          {/* Google Pay button */}
          <button className="h-12 w-[246px] bg-black rounded-md">
            <span className="text-white text-sm">G Pay</span>
          </button>
        </div>
      </div>

      {/* OR divider */}
      <div className="flex items-center">
        <div className="h-px flex-1 border-b border-[#dedede]"></div>
        <div className="px-[14px] flex flex-col items-center">
          <span className="leading-[21px]">OR</span>
        </div>
        <div className="h-px flex-1 border-b border-[#dedede]"></div>
      </div>
    </>
  );
};

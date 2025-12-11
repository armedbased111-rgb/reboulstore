export const ShippingMethod = () => {
  return (
    <div className="flex flex-col items-start gap-[14px] text-base text-black">
      <div className="flex flex-col items-start">
        <span className="relative leading-[19.2px] font-medium">Shipping method</span>
      </div>
      
      <div className="rounded-md bg-[#f6f6f6] flex flex-col items-start p-[17px] text-sm text-black/56">
        <div className="flex flex-col items-start py-0 px-[33.1px]">
          <span className="relative leading-[21px]">
            Enter your shipping address to view available shipping methods.
          </span>
        </div>
      </div>
    </div>
  );
};

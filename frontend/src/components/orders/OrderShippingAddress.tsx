interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface OrderShippingAddressProps {
  address: ShippingAddress;
}

/**
 * Composant pour afficher l'adresse de livraison
 */
export const OrderShippingAddress = ({ address }: OrderShippingAddressProps) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 lg:py-[15px] lg:px-[24px] lg:min-h-[168px] flex flex-col">
      <h2 className="font-[Geist] font-medium text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black mb-[6px]">
        ADRESSE DE LIVRAISON
      </h2>
      
      <div className="flex flex-col flex-1">
        <p className="font-[Geist] font-medium text-[14px] leading-[20px] text-black">
          {address.firstName} {address.lastName}
        </p>
        <p className="font-[Geist] text-[14px] leading-[20px] text-black">
          {address.street}
        </p>
        <p className="font-[Geist] text-[14px] leading-[20px] text-black">
          {address.postalCode} {address.city}
        </p>
        <p className="font-[Geist] text-[14px] leading-[20px] text-black">
          {address.country}
        </p>
        {address.phone && (
          <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] pt-2">
            {address.phone}
          </p>
        )}
      </div>
    </div>
  );
};


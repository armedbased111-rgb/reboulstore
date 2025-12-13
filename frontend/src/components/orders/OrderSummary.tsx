import { formatPrice } from '../../utils/priceFormatter';

interface OrderSummaryProps {
  total: number;
  onDownloadInvoice?: () => void;
}

/**
 * Composant pour afficher le récapitulatif de la commande
 */
export const OrderSummary = ({ total, onDownloadInvoice }: OrderSummaryProps) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <h2 className="font-[Geist] font-medium text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black">
          RÉCAPITULATIF
        </h2>
        
        {onDownloadInvoice && (
          <button
            onClick={onDownloadInvoice}
            className="border border-black rounded-[5px] px-6 py-2 font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black hover:bg-gray-100 transition-colors"
          >
            Télécharger la facture
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[#4a5565]">
          <p className="font-[Geist] text-[14px] leading-[20px]">Sous-total</p>
          <p className="font-[Geist] text-[14px] leading-[20px] text-black">{formatPrice(total)}</p>
        </div>
        
        <div className="flex items-center justify-between text-[#4a5565]">
          <p className="font-[Geist] text-[14px] leading-[20px]">Livraison</p>
          <p className="font-[Geist] text-[14px] leading-[20px] text-black">Incluse</p>
        </div>
        
        <div className="border-t border-[#e5e7eb] pt-2 flex items-center justify-between">
          <p className="font-[Geist] font-medium text-[14px] leading-[20px] text-black">Total</p>
          <p className="font-[Geist] font-medium text-[14px] leading-[20px] text-black">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
};


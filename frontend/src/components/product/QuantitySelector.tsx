import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

/**
 * Composant QuantitySelector - Sélecteur de quantité style A-COLD-WALL*
 * 
 * Boutons +/- avec nombre au centre
 * - Minimum : 1 (ou min prop)
 * - Maximum : stock disponible (ou max prop)
 * - Désactivé si stock = 0
 */
export const QuantitySelector = ({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max,
  disabled = false,
}: QuantitySelectorProps) => {
  const canDecrease = !disabled && quantity > min;
  const canIncrease = !disabled && (!max || quantity < max);

  return (
    <div className="flex items-center gap-1.5">
      {/* Bouton - */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        disabled={!canDecrease}
        className="flex items-center justify-center w-6 h-6 border border-white rounded bg-transparent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
        aria-label="Diminuer la quantité"
      >
        <Minus className="w-3 h-3" />
      </button>

      {/* Nombre */}
      <span className="font-[Geist] font-medium text-[12px] leading-[16px] tracking-[-0.35px] text-white min-w-[1.5ch] text-center">
        {quantity}
      </span>

      {/* Bouton + */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        disabled={!canIncrease}
        className="flex items-center justify-center w-6 h-6 border border-white rounded bg-transparent text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
        aria-label="Augmenter la quantité"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};


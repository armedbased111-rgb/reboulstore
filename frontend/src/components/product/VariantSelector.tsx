import type { Variant } from '../../types';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
}

/**
 * Composant VariantSelector - Sélection taille style A-COLD-WALL*
 * 
 * Select dropdown avec :
 * - Liste des tailles disponibles
 * - Arrow custom (triangle noir)
 * - Border noir arrondie
 * - Callback onVariantChange
 */
export const VariantSelector = ({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) => {
  // Gérer le changement de sélection
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = e.target.value;
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      onVariantChange(variant);
    }
  };

  return (
    <div className="inline">
      <div className="relative">
        {/* Arrow custom (triangle noir) */}
        <div className="h-[10px] w-[10px] -rotate-[135deg] border-t border-l border-black absolute top-1/2 -translate-y-[7px] right-[14px] pointer-events-none"></div>

        {/* Select dropdown */}
        <select
          name="variant"
          value={selectedVariant?.id || ''}
          onChange={handleChange}
          className="appearance-none focus:outline-none border border-black rounded-md pl-4 pr-10 text-t2 bg-transparent py-[9px] md:py-[5px] cursor-pointer"
        >
          <option value="" disabled>
            Select Size
          </option>
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.size} {variant.color && `- ${variant.color}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
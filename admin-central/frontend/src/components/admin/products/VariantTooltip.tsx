import { useState, useRef, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Product, Variant } from '../../../types/reboul.types';
import { cn } from '../../../utils/cn';

interface VariantTooltipProps {
  product: Product;
  variants: Variant[];
  onVariantClick: (product: Product, variant: Variant) => void;
}

/**
 * Composant tooltip pour afficher et permettre de cliquer sur les variants
 */
export default function VariantTooltip({
  product,
  variants,
  onVariantClick,
}: VariantTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible]);

  return (
    <div className="relative" style={{ zIndex: isVisible ? 1000 : 'auto' }}>
      <button
        ref={buttonRef}
        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
        onMouseEnter={() => setIsVisible(true)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Package className="w-4 h-4" />
        <span>
          {variants.length} variant{variants.length > 1 ? 's' : ''}
        </span>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[1000] p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl min-w-[200px] max-w-[300px]"
          style={{
            top: buttonRef.current
              ? `${buttonRef.current.getBoundingClientRect().top - (buttonRef.current.getBoundingClientRect().height + 8)}px`
              : 'auto',
            left: buttonRef.current
              ? `${buttonRef.current.getBoundingClientRect().left}px`
              : 'auto',
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="font-semibold mb-2">Variants ({variants.length})</div>
          <div className="space-y-1">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onVariantClick(product, variant);
                  setIsVisible(false);
                }}
                className={cn(
                  'w-full flex justify-between items-center cursor-pointer hover:bg-gray-800 px-2 py-1 rounded transition-colors text-left',
                )}
              >
                <span>
                  {variant.color} - {variant.size}
                </span>
                <span
                  className={cn(
                    'ml-2',
                    variant.stock > 0 ? 'text-green-400' : 'text-red-400',
                  )}
                >
                  Stock: {variant.stock}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


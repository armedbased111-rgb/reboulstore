import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interface pour une variante de produit
 */
export interface ProductVariant {
  id?: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
}

interface ProductVariantsManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  className?: string;
}

/**
 * Composant pour gérer les variants d'un produit
 * 
 * Fonctionnalités :
 * - Ajouter/supprimer des variants
 * - Gérer taille, couleur, stock, SKU
 * - Validation SKU unique
 */
export default function ProductVariantsManager({
  variants,
  onChange,
  className,
}: ProductVariantsManagerProps) {
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const addVariant = () => {
    onChange([
      ...variants,
      {
        color: '',
        size: '',
        stock: 0,
        sku: '',
      },
    ]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
    // Nettoyer les erreurs de ce variant
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number,
  ) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    onChange(newVariants);

    // Validation SKU unique
    if (field === 'sku' && typeof value === 'string') {
      const skuErrors: Record<number, Record<string, string>> = { ...errors };
      const duplicateIndex = newVariants.findIndex(
        (v, i) => i !== index && v.sku === value && value.trim() !== '',
      );
      
      if (duplicateIndex !== -1) {
        skuErrors[index] = { ...skuErrors[index], sku: 'SKU déjà utilisé' };
        skuErrors[duplicateIndex] = { ...skuErrors[duplicateIndex], sku: 'SKU déjà utilisé' };
      } else {
        if (skuErrors[index]) {
          delete skuErrors[index].sku;
          if (Object.keys(skuErrors[index]).length === 0) {
            delete skuErrors[index];
          }
        }
        if (skuErrors[duplicateIndex]) {
          delete skuErrors[duplicateIndex].sku;
          if (Object.keys(skuErrors[duplicateIndex]).length === 0) {
            delete skuErrors[duplicateIndex];
          }
        }
      }
      setErrors(skuErrors);
    }

    // Effacer l'erreur du champ modifié
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const validateVariant = (variant: ProductVariant, index: number): boolean => {
    const variantErrors: Record<string, string> = {};

    if (!variant.color.trim()) {
      variantErrors.color = 'La couleur est requise';
    }

    if (!variant.size.trim()) {
      variantErrors.size = 'La taille est requise';
    }

    if (variant.stock < 0) {
      variantErrors.stock = 'Le stock ne peut pas être négatif';
    }

    if (!variant.sku.trim()) {
      variantErrors.sku = 'Le SKU est requis';
    } else {
      // Vérifier unicité SKU
      const duplicateIndex = variants.findIndex(
        (v, i) => i !== index && v.sku === variant.sku,
      );
      if (duplicateIndex !== -1) {
        variantErrors.sku = 'SKU déjà utilisé';
      }
    }

    if (Object.keys(variantErrors).length > 0) {
      setErrors({ ...errors, [index]: variantErrors });
      return false;
    }

    return true;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Variants du produit
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Définir les différentes combinaisons taille/couleur avec stock et SKU
          </p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center justify-center px-3 py-2 text-sm text-black border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter un variant
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Aucun variant défini. Cliquez sur "Ajouter un variant" pour commencer.
        </p>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={variant.id || index}
              className="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-900">
                  Variant #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="Supprimer ce variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Couleur */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Couleur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    onBlur={() => validateVariant(variant, index)}
                    className={cn(
                      'w-full px-2 py-1.5 border rounded text-sm',
                      errors[index]?.color
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-black focus:border-black',
                    )}
                    placeholder="Ex: Noir, Blanc, Bleu"
                  />
                  {errors[index]?.color && (
                    <p className="mt-1 text-xs text-red-600">{errors[index].color}</p>
                  )}
                </div>

                {/* Taille */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Taille <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    onBlur={() => validateVariant(variant, index)}
                    className={cn(
                      'w-full px-2 py-1.5 border rounded text-sm',
                      errors[index]?.size
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-black focus:border-black',
                    )}
                    placeholder="Ex: S, M, L, XL"
                  />
                  {errors[index]?.size && (
                    <p className="mt-1 text-xs text-red-600">{errors[index].size}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                    onBlur={() => validateVariant(variant, index)}
                    className={cn(
                      'w-full px-2 py-1.5 border rounded text-sm',
                      errors[index]?.stock
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-black focus:border-black',
                    )}
                    placeholder="0"
                  />
                  {errors[index]?.stock && (
                    <p className="mt-1 text-xs text-red-600">{errors[index].stock}</p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                    onBlur={() => validateVariant(variant, index)}
                    className={cn(
                      'w-full px-2 py-1.5 border rounded text-sm font-mono',
                      errors[index]?.sku
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-black focus:border-black',
                    )}
                    placeholder="Ex: PROD-001-BLK-S"
                  />
                  {errors[index]?.sku && (
                    <p className="mt-1 text-xs text-red-600">{errors[index].sku}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

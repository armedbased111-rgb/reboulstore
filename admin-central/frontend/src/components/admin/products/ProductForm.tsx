import { useState, useEffect } from 'react';
import { Product } from '../../../types/reboul.types';
import { Category } from '../../../services/reboul-categories.service';
import { Brand } from '../../../services/reboul-brands.service';
import { reboulCategoriesService } from '../../../services/reboul-categories.service';
import { reboulBrandsService } from '../../../services/reboul-brands.service';
import { Plus, X } from 'lucide-react';
import ProductImagesUpload, { ProductImage } from './ProductImagesUpload';
import ProductVariantsManager, { ProductVariant } from './ProductVariantsManager';

/**
 * Props pour le formulaire de produit
 */
interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

/**
 * Composant formulaire pour créer/éditer un produit
 */
export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || '',
    brandId: initialData?.brandId || '',
    materials: initialData?.materials || '',
    careInstructions: initialData?.careInstructions || '',
    madeIn: initialData?.madeIn || '',
  });
  const [sizeChartItems, setSizeChartItems] = useState<Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }>>(initialData?.customSizeChart || []);
  const [productImages, setProductImages] = useState<ProductImage[]>(
    initialData?.images?.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: null,
      alt: img.alt || null,
      order: img.order || 0,
    })) || []
  );
  const [productVariants, setProductVariants] = useState<ProductVariant[]>(
    initialData?.variants?.map((v) => ({
      id: v.id,
      color: v.color,
      size: v.size,
      stock: v.stock,
      sku: v.sku,
    })) || []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les catégories et marques
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          reboulCategoriesService.getAll(),
          reboulBrandsService.getAll(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories/marques:', error);
      }
    };
    loadOptions();
  }, []);

  // Initialiser le formulaire avec les données initiales lors de l'édition
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        categoryId: initialData.categoryId || '',
        brandId: initialData.brandId || '',
        materials: initialData.materials || '',
        careInstructions: initialData.careInstructions || '',
        madeIn: initialData.madeIn || '',
      });
      setSizeChartItems(initialData.customSizeChart || []);
      setProductImages(
        initialData.images?.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: null,
          alt: img.alt || null,
          order: img.order || 0,
        })) || []
      );
      setProductVariants(
        initialData.variants?.map((v) => ({
          id: v.id,
          color: v.color,
          size: v.size,
          stock: v.stock,
          sku: v.sku,
        })) || []
      );
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addSizeChartItem = () => {
    setSizeChartItems([...sizeChartItems, { size: '' }]);
  };

  const removeSizeChartItem = (index: number) => {
    setSizeChartItems(sizeChartItems.filter((_, i) => i !== index));
  };

  const updateSizeChartItem = (
    index: number,
    field: 'size' | 'chest' | 'length' | 'waist' | 'hip',
    value: string | number | undefined
  ) => {
    const updated = [...sizeChartItems];
    if (field === 'size') {
      updated[index] = { ...updated[index], size: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: value as number | undefined };
    }
    setSizeChartItems(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        customSizeChart: sizeChartItems.length > 0 ? sizeChartItems : undefined,
        materials: formData.materials || undefined,
        careInstructions: formData.careInstructions || undefined,
        madeIn: formData.madeIn || undefined,
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du produit <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ex: T-shirt Premium"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          placeholder="Description détaillée du produit..."
        />
      </div>

      {/* Prix */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Prix (€) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
            errors.price ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="99.99"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Catégorie <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          value={formData.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
            errors.categoryId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
      </div>

      {/* Marque */}
      <div>
        <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
          Marque
        </label>
        <select
          id="brandId"
          value={formData.brandId}
          onChange={(e) => handleChange('brandId', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
        >
          <option value="">Aucune marque</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Matériaux */}
      <div>
        <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
          Matériaux
        </label>
        <input
          type="text"
          id="materials"
          value={formData.materials}
          onChange={(e) => handleChange('materials', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          placeholder="Ex: 100% Cotton"
        />
        <p className="mt-1 text-xs text-gray-500">Ex: 100% Cotton, 50% Polyester 50% Cotton</p>
      </div>

      {/* Instructions d'entretien */}
      <div>
        <label htmlFor="careInstructions" className="block text-sm font-medium text-gray-700">
          Instructions d'entretien
        </label>
        <textarea
          id="careInstructions"
          rows={3}
          value={formData.careInstructions}
          onChange={(e) => handleChange('careInstructions', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          placeholder="Ex: Machine wash cold, Do not bleach, Tumble dry low"
        />
        <p className="mt-1 text-xs text-gray-500">Instructions de lavage et d'entretien</p>
      </div>

      {/* Pays de fabrication */}
      <div>
        <label htmlFor="madeIn" className="block text-sm font-medium text-gray-700">
          Pays de fabrication
        </label>
        <input
          type="text"
          id="madeIn"
          value={formData.madeIn}
          onChange={(e) => handleChange('madeIn', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
          placeholder="Ex: France, Italy, Portugal"
        />
      </div>

      {/* Size Chart personnalisé */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Size Chart personnalisé
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Si vide, le size chart de la catégorie sera utilisé
            </p>
          </div>
          <button
            type="button"
            onClick={addSizeChartItem}
            className="inline-flex items-center justify-center px-3 py-2 text-sm text-black border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une taille
          </button>
        </div>
        {sizeChartItems.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune taille définie (utilisera le size chart de la catégorie)</p>
        ) : (
          <div className="space-y-2">
            {sizeChartItems.map((item, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-2">
                <input
                  type="text"
                  placeholder="Taille (ex: S, M, L)"
                  value={item.size}
                  onChange={(e) => updateSizeChartItem(index, 'size', e.target.value)}
                  className="w-full sm:flex-1 px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm"
                  required
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2 sm:flex-1">
                  <input
                    type="number"
                    placeholder="Chest"
                    value={item.chest || ''}
                    onChange={(e) => updateSizeChartItem(index, 'chest', parseFloat(e.target.value) || undefined)}
                    className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Length"
                    value={item.length || ''}
                    onChange={(e) => updateSizeChartItem(index, 'length', parseFloat(e.target.value) || undefined)}
                    className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Waist"
                    value={item.waist || ''}
                    onChange={(e) => updateSizeChartItem(index, 'waist', parseFloat(e.target.value) || undefined)}
                    className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Hip"
                    value={item.hip || ''}
                    onChange={(e) => updateSizeChartItem(index, 'hip', parseFloat(e.target.value) || undefined)}
                    className="w-full px-2 py-2 sm:py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSizeChartItem(index)}
                  className="p-2 sm:p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded w-full sm:w-auto flex items-center justify-center sm:inline-flex"
                >
                  <X className="w-4 h-4" />
                  <span className="sm:hidden ml-2 text-sm">Supprimer</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images du produit */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <ProductImagesUpload
          images={productImages}
          onChange={setProductImages}
          maxImages={7}
        />
      </div>

      {/* Variants du produit */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <ProductVariantsManager
          variants={productVariants}
          onChange={setProductVariants}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black w-full sm:w-auto"
            disabled={isLoading}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}

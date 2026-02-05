import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import ProductForm from '../../../../components/admin/products/ProductForm';
import { reboulProductsService } from '../../../../services/reboul-products.service';
import { Product } from '../../../../types/reboul.types';

/**
 * Page de création d'un produit Reboul
 * 
 * Route : /admin/reboul/products/new (protégée)
 */
export default function CreateProductPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<Product>) => {
    setIsLoading(true);
    setError(null);

    try {
      const cleanData = {
        ...data,
        categoryId: data.categoryId != null && data.categoryId !== '' ? data.categoryId : undefined,
        brandId: data.brandId != null && data.brandId !== '' ? data.brandId : undefined,
      };
      
      await reboulProductsService.createProduct(cleanData);
      navigate('/admin/reboul/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du produit');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reboul/products');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nouveau produit</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créer un nouveau produit pour le site Reboul
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

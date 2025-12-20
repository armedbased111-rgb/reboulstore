import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import ProductForm from '../../../../components/admin/products/ProductForm';
import { reboulProductsService } from '../../../../services/reboul-products.service';
import { Product } from '../../../../types/reboul.types';

/**
 * Page d'édition d'un produit Reboul
 * 
 * Route : /admin/reboul/products/:id/edit (protégée)
 */
export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le produit
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID produit manquant');
        setIsLoading(false);
        return;
      }

      try {
        const data = await reboulProductsService.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (data: Partial<Product>) => {
    if (!id) return;

    setIsSaving(true);
    setError(null);

    try {
      // Nettoyer les données : ne pas envoyer de chaînes vides pour les UUIDs
      const cleanData = {
        ...data,
        categoryId: data.categoryId && data.categoryId.trim() !== '' ? data.categoryId : undefined,
        brandId: data.brandId && data.brandId.trim() !== '' ? data.brandId : undefined,
      };
      
      await reboulProductsService.updateProduct(id, cleanData);
      navigate('/admin/reboul/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reboul/products');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !product) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/admin/reboul/products')}
            className="mt-4 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            Retour à la liste
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Éditer le produit</h1>
          <p className="mt-1 text-sm text-gray-600">
            Modifier les informations du produit
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        {product && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSaving}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

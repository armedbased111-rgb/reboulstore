import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulBrandsService, Brand } from '../../../../services/reboul-brands.service';
import FileUpload from '../../../../components/admin/FileUpload';

/**
 * Page de création d'une marque Reboul
 * 
 * Route : /admin/reboul/brands/new (protégée)
 */
export default function CreateBrandPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    megaMenuImage1: '',
    megaMenuImage2: '',
    megaMenuVideo1: '',
    megaMenuVideo2: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        logoUrl: formData.logoUrl || undefined,
        megaMenuImage1: formData.megaMenuImage1 || undefined,
        megaMenuImage2: formData.megaMenuImage2 || undefined,
        megaMenuVideo1: formData.megaMenuVideo1 || undefined,
        megaMenuVideo2: formData.megaMenuVideo2 || undefined,
        description: formData.description || undefined,
      };
      
      await reboulBrandsService.createBrand(dataToSend);
      navigate('/admin/reboul/brands');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la marque');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reboul/brands');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nouvelle marque</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créer une nouvelle marque pour le site Reboul
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (auto-généré si vide)
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="auto-généré depuis le nom"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Logo */}
          <div>
            <FileUpload
              label="Logo"
              value={formData.logoUrl || undefined}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              type="image"
            />
          </div>

          {/* Mega Menu Images */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Mega Menu - Images</h3>
            <div className="space-y-3 sm:space-y-4">
              <FileUpload
                label="Image 1"
                value={formData.megaMenuImage1 || undefined}
                onChange={(url) => setFormData({ ...formData, megaMenuImage1: url })}
                type="image"
              />
              <FileUpload
                label="Image 2"
                value={formData.megaMenuImage2 || undefined}
                onChange={(url) => setFormData({ ...formData, megaMenuImage2: url })}
                type="image"
              />
            </div>
          </div>

          {/* Mega Menu Videos */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Mega Menu - Vidéos</h3>
            <p className="text-sm text-gray-500 mb-3 sm:mb-4">Les vidéos sont prioritaires sur les images si fournies</p>
            <div className="space-y-3 sm:space-y-4">
              <FileUpload
                label="Vidéo 1"
                value={formData.megaMenuVideo1 || undefined}
                onChange={(url) => setFormData({ ...formData, megaMenuVideo1: url })}
                type="video"
              />
              <FileUpload
                label="Vidéo 2"
                value={formData.megaMenuVideo2 || undefined}
                onChange={(url) => setFormData({ ...formData, megaMenuVideo2: url })}
                type="video"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading ? 'Création...' : 'Créer la marque'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

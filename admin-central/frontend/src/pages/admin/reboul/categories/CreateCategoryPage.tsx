import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulCategoriesService, Category } from '../../../../services/reboul-categories.service';
import FileUpload from '../../../../components/admin/FileUpload';
import { Plus, X } from 'lucide-react';

/**
 * Page de création d'une catégorie Reboul
 * 
 * Route : /admin/reboul/categories/new (protégée)
 */
export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    sizeChart: [],
  });
  const [sizeChartItems, setSizeChartItems] = useState<Array<{
    size: string;
    chest?: number;
    length?: number;
    waist?: number;
    hip?: number;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        sizeChart: sizeChartItems.length > 0 ? sizeChartItems : undefined,
        imageUrl: formData.imageUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        description: formData.description || undefined,
      };
      
      await reboulCategoriesService.createCategory(dataToSend);
      navigate('/admin/reboul/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la catégorie');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reboul/categories');
  };

  const addSizeChartItem = () => {
    setSizeChartItems([...sizeChartItems, { size: '' }]);
  };

  const removeSizeChartItem = (index: number) => {
    setSizeChartItems(sizeChartItems.filter((_, i) => i !== index));
  };

  const updateSizeChartItem = (index: number, field: string, value: string | number) => {
    const updated = [...sizeChartItems];
    updated[index] = { ...updated[index], [field]: value };
    setSizeChartItems(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nouvelle catégorie</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créer une nouvelle catégorie pour le site Reboul
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Image Hero */}
          <div>
            <FileUpload
              label="Image Hero"
              value={formData.imageUrl || undefined}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              type="image"
              helpText="Si une vidéo est fournie, elle sera prioritaire"
            />
          </div>

          {/* Video Hero */}
          <div>
            <FileUpload
              label="Vidéo Hero"
              value={formData.videoUrl || undefined}
              onChange={(url) => setFormData({ ...formData, videoUrl: url })}
              type="video"
              helpText="Prioritaire sur l'image si fournie"
            />
          </div>

          {/* Size Chart */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Size Chart
              </label>
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
              <p className="text-sm text-gray-500">Aucune taille définie</p>
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
              {isLoading ? 'Création...' : 'Créer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

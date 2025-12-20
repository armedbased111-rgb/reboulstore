import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulCategoriesService, Category } from '../../../../services/reboul-categories.service';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { cn } from '../../../../utils/cn';

/**
 * Format de la date
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Page de gestion des catégories Reboul
 * 
 * Route : /admin/reboul/categories (protégée)
 * 
 * Affiche :
 * - Liste des catégories avec pagination
 * - Recherche par nom
 * - CRUD complet (create, edit, delete)
 * - Upload image/vidéo hero section
 * - Size chart par catégorie
 */
export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reboulCategoriesService.getCategories({
        page,
        limit,
        search: search || undefined,
      });
      setCategories(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
      console.error('Erreur lors du chargement des catégories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      return;
    }

    try {
      await reboulCategoriesService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des catégories : {error.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Catégories Reboul</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les catégories du site Reboul
            </p>
          </div>
          <Link
            to="/admin/reboul/categories/new"
            className={cn(
              'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full sm:w-auto'
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle catégorie
          </Link>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Tableau catégories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Chargement des catégories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Aucune catégorie trouvée</p>
            </div>
          ) : (
            <>
              {/* Desktop/Tablette : Tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Slug
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produits
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Média
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Size Chart
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Date création
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {category.slug}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          {category.productsCount || 0}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {category.videoUrl && (
                              <Video className="w-4 h-4 text-blue-500" />
                            )}
                            {category.imageUrl && !category.videoUrl && (
                              <ImageIcon className="w-4 h-4 text-gray-500" />
                            )}
                            {!category.imageUrl && !category.videoUrl && (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                          {category.sizeChart && category.sizeChart.length > 0 ? (
                            <div className="flex items-center text-sm text-gray-500">
                              <FileText className="w-4 h-4 mr-1" />
                              {category.sizeChart.length} taille(s)
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {category.createdAt ? formatDate(category.createdAt) : '—'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/reboul/categories/${category.id}/edit`}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Supprimer"
                              onClick={() => handleDelete(category.id, category.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile : Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">{category.slug}</p>
                      </div>
                      <div className="flex space-x-2 ml-4 flex-shrink-0">
                        <Link
                          to={`/admin/reboul/categories/${category.id}/edit`}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                          title="Supprimer"
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Produits</span>
                        <p className="font-medium text-gray-900">{category.productsCount || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Média</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {category.videoUrl && (
                            <Video className="w-4 h-4 text-blue-500" />
                          )}
                          {category.imageUrl && !category.videoUrl && (
                            <ImageIcon className="w-4 h-4 text-gray-500" />
                          )}
                          {category.sizeChart && category.sizeChart.length > 0 && (
                            <FileText className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    {category.createdAt && (
                      <div className="text-xs text-gray-500">
                        Créé le {formatDate(category.createdAt)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                        pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={cn(
                        'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                        pagination.page === pagination.totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> à{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        sur <span className="font-medium">{pagination.total}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => changePage(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className={cn(
                            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                            pagination.page === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          Précédent
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter((pageNum) => {
                            return (
                              pageNum === 1 ||
                              pageNum === pagination.totalPages ||
                              (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                            );
                          })
                          .map((pageNum, index, array) => {
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && pageNum - prevPage > 1;
                            return (
                              <div key={pageNum} className="flex">
                                {showEllipsis && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => changePage(pageNum)}
                                  className={cn(
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                    pageNum === pagination.page
                                      ? 'z-10 bg-black border-black text-white'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  )}
                                >
                                  {pageNum}
                                </button>
                              </div>
                            );
                          })}
                        <button
                          onClick={() => changePage(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className={cn(
                            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                            pagination.page === pagination.totalPages
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          Suivant
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

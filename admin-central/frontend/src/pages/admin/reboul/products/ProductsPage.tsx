import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { useReboulProducts } from '../../../../hooks/useReboulProducts';
import { reboulCategoriesService, Category } from '../../../../services/reboul-categories.service';
import { reboulBrandsService, Brand } from '../../../../services/reboul-brands.service';
import { reboulProductsService } from '../../../../services/reboul-products.service';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import VariantEditModal from '../../../../components/admin/products/VariantEditModal';
import VariantTooltip from '../../../../components/admin/products/VariantTooltip';
import { Product, Variant } from '../../../../types/reboul.types';

/**
 * Format du prix en euros
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

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
 * Page de gestion des produits Reboul
 * 
 * Route : /admin/reboul/products (protégée)
 * 
 * Affiche :
 * - Liste des produits avec pagination
 * - Recherche par nom
 * - Filtres (catégorie, marque, stock)
 * - Tri (nom, prix, date création)
 */
export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

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
  // Note: Le tri n'est pas encore implémenté côté backend
  // const [sortBy, setSortBy] = useState<string>('createdAt');
  // const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Fonction pour ouvrir la modale d'édition de variant
  const handleVariantClick = (product: Product, variant: Variant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
    setIsVariantModalOpen(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Fonction pour rafraîchir après sauvegarde
  const handleVariantSave = () => {
    refetch();
  };

  const { products, pagination, loading, error, updateParams, changePage, refetch } = useReboulProducts({
    page: 1,
    limit: 20,
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    brandId: brandFilter || undefined,
    // sortBy,
    // sortOrder,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams({ search: value || undefined });
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    updateParams({ categoryId: value || undefined });
  };

  const handleBrandFilter = (value: string) => {
    setBrandFilter(value);
    updateParams({ brandId: value || undefined });
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des produits : {error.message}
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Produits Reboul</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les produits du site Reboul
            </p>
          </div>
          <Link
            to="/admin/reboul/products/new"
            className={cn(
              'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full sm:w-auto'
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Link>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Recherche */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre catégorie */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre marque */}
            <div>
              <select
                value={brandFilter}
                onChange={(e) => handleBrandFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Toutes les marques</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau produits - Desktop/Tablette */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Chargement des produits...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Aucun produit trouvé</p>
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
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Variants
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
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.reference ? (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.reference}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 italic truncate max-w-xs">
                              Aucune référence
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          {(() => {
                            const category = categories.find((c) => c.id === product.categoryId);
                            return category ? category.name : product.categoryId ? product.categoryId.substring(0, 8) + '...' : '—';
                          })()}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {product.variants && product.variants.length > 0 ? (
                            <VariantTooltip
                              product={product}
                              variants={product.variants}
                              onVariantClick={handleVariantClick}
                            />
                          ) : (
                            <span className="text-gray-400">Aucun variant</span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/reboul/products/${product.id}/edit`}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Supprimer"
                              onClick={async () => {
                                if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
                                  try {
                                    await reboulProductsService.deleteProduct(product.id);
                                    window.location.reload();
                                  } catch (error) {
                                    console.error('Erreur lors de la suppression:', error);
                                    alert('Erreur lors de la suppression du produit');
                                  }
                                }
                              }}
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
                {products.map((product) => {
                  const category = categories.find((c) => c.id === product.categoryId);
                  return (
                    <div key={product.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                          {product.reference ? (
                            <p className="mt-1 text-sm text-gray-500">{product.reference}</p>
                          ) : (
                            <p className="mt-1 text-sm text-gray-400 italic">Aucune référence</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4 flex-shrink-0">
                          <Link
                            to={`/admin/reboul/products/${product.id}/edit`}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                            title="Supprimer"
                            onClick={async () => {
                              if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
                                try {
                                  await reboulProductsService.deleteProduct(product.id);
                                  window.location.reload();
                                } catch (error) {
                                  console.error('Erreur lors de la suppression:', error);
                                  alert('Erreur lors de la suppression du produit');
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Catégorie</span>
                          <p className="font-medium text-gray-900">{category ? category.name : '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Prix</span>
                          <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Créé le {formatDate(product.createdAt)}
                      </div>
                    </div>
                  );
                })}
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
                          .filter((page) => {
                            // Afficher la première page, la dernière, et les pages autour de la page actuelle
                            return (
                              page === 1 ||
                              page === pagination.totalPages ||
                              (page >= pagination.page - 1 && page <= pagination.page + 1)
                            );
                          })
                          .map((page, index, array) => {
                            // Ajouter des "..." entre les pages
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;
                            return (
                              <div key={page} className="flex">
                                {showEllipsis && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => changePage(page)}
                                  className={cn(
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                    page === pagination.page
                                      ? 'z-10 bg-black border-black text-white'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  )}
                                >
                                  {page}
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

          {/* Modale d'édition rapide de variant */}
          {selectedProduct && selectedVariant && (
            <VariantEditModal
              isOpen={isVariantModalOpen}
              onClose={handleCloseModal}
              product={selectedProduct}
              variant={selectedVariant}
              onSave={handleVariantSave}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

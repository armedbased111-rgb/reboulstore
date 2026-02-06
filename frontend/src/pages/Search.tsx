import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
// Category et Brand non utilisés directement dans ce fichier
import * as anime from 'animejs';
import { toMilliseconds, ANIMATION_EASES } from '../animations/utils/constants';

/**
 * Page Search - Résultats de recherche avec filtres et tri
 * 
 * Route : /search?q=query
 * 
 * Fonctionnalités :
 * - Affichage des résultats de recherche
 * - Sidebar filtres (catégorie, prix, couleur, taille)
 * - Tri (pertinence, prix, nouveautés, meilleures ventes)
 * - Pagination
 */
export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // États pour les filtres
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Charger les catégories et marques
  const { categories } = useCategories();
  const { brands } = useBrands();

  // Construire la query pour l'API
  const productQuery = {
    search: query,
    category: selectedCategory != null ? String(selectedCategory) : undefined,
    brand: selectedBrand != null ? String(selectedBrand) : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    page: currentPage,
    limit: 20,
    sortBy: sortBy === 'relevance' ? undefined : sortBy,
    sortOrder: (sortBy === 'price-asc' ? 'ASC' : sortBy === 'price-desc' ? 'DESC' : 'DESC') as 'ASC' | 'DESC',
  };

  const { products: allProducts, loading, error } = useProducts(productQuery);

  // Filtrer les produits par couleur et taille côté frontend
  let filteredProducts = allProducts.filter((product) => {
    // Filtrer par couleur
    if (selectedColors.length > 0) {
      const hasSelectedColor = product.variants?.some((v) =>
        selectedColors.includes(v.color)
      );
      if (!hasSelectedColor) return false;
    }

    // Filtrer par taille
    if (selectedSizes.length > 0) {
      const hasSelectedSize = product.variants?.some((v) =>
        selectedSizes.includes(v.size)
      );
      if (!hasSelectedSize) return false;
    }

    return true;
  });

  // Trier les produits filtrés
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === 'oldest') {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Pagination côté frontend (après filtrage et tri)
  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const products = filteredProducts.slice(startIndex, endIndex);
  const totalPagesFiltered = Math.ceil(filteredProducts.length / itemsPerPage);

  // Extraire les couleurs et tailles uniques de TOUS les produits (pas seulement filtrés)
  const availableColors = Array.from(
    new Set(
      allProducts.flatMap((p) => p.variants?.map((v) => v.color) || [])
    )
  ).sort();

  const availableSizes = Array.from(
    new Set(
      allProducts.flatMap((p) => p.variants?.map((v) => v.size) || [])
    )
  ).sort();

  // Total ajusté après filtrage frontend
  const total = filteredProducts.length;

  // Refs pour les animations
  const resultsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Animation d'apparition des résultats
  useEffect(() => {
    if (!loading && products.length > 0 && resultsRef.current) {
      anime.animate(resultsRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: toMilliseconds(0.4),
        easing: ANIMATION_EASES.DEFAULT,
      });
    }
  }, [loading, products]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceRange, selectedColors, selectedSizes, sortBy]);

  // Gérer les changements de filtres
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleBrandChange = (brandId: number) => {
    setSelectedBrand(brandId === selectedBrand ? null : brandId);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory != null ||
    selectedBrand != null ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    sortBy !== 'relevance';

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Rechercher des produits
          </h2>
          <p className="text-gray-600">
            Utilisez la barre de recherche pour trouver des produits
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec recherche et tri */}
      <div className="border-b border-gray-200 bg-white sticky top-[46px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Recherche actuelle */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Résultats pour <span className="font-semibold text-gray-900">"{query}"</span>
                </p>
                {total > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Tri */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Trier par :
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filtres - Desktop */}
          <aside
            ref={sidebarRef}
            className={`hidden md:block w-64 flex-shrink-0 ${
              isFiltersOpen ? 'block' : 'hidden'
            }`}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-[140px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Catégories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Marques */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Marques</h4>
                <div className="space-y-2">
                  {brands?.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand.id}
                        onChange={() => handleBrandChange(brand.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Prix : {priceRange[0]}€ - {priceRange[1]}€
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Couleurs */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Couleurs</h4>
                  <div className="space-y-2">
                    {availableColors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailles */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tailles</h4>
                  <div className="space-y-2">
                    {availableSizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Résultats */}
          <div ref={resultsRef} className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="mt-4 text-gray-600">Recherche en cours...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Erreur : {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {totalPagesFiltered > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPagesFiltered }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPagesFiltered ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        return (
                          <div key={page} className="flex">
                            {showEllipsis && (
                              <span className="px-4 py-2 text-sm text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                currentPage === page
                                  ? 'bg-black text-white border-black'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPagesFiltered, p + 1))}
                      disabled={currentPage === totalPagesFiltered}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Filtres - Mobile (Modal) */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  Réinitialiser
                </button>
              )}

              {/* Catégories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Marques */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Marques</h4>
                <div className="space-y-2">
                  {brands?.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand.id}
                        onChange={() => handleBrandChange(brand.id)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Prix : {priceRange[0]}€ - {priceRange[1]}€
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Couleurs */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Couleurs</h4>
                  <div className="space-y-2">
                    {availableColors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailles */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tailles</h4>
                  <div className="space-y-2">
                    {availableSizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


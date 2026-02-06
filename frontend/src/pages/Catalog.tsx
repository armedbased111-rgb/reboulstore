import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { getCategoryBySlug } from '../services/categories';
import { getBrandBySlug } from '../services/brands';
import { getImageUrl } from '../utils/imageUtils';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
import { SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';
import type { Category, Brand } from '../types';
import * as anime from 'animejs';
import { toMilliseconds, ANIMATION_EASES } from '../animations/utils/constants';

/**
 * Page Catalog - Catalogue de produits style A-COLD-WALL*
 * 
 * Structure exacte copiée depuis A-COLD-WALL* :
 * - Section banner avec titre "Shop All"
 * - Hero section avec image de catégorie (si catégorie sélectionnée)
 * - Section product-grid avec grille responsive
 * - Section pagination (à implémenter plus tard)
 */
export const Catalog = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const brandSlug = searchParams.get('brand');
  
  // État pour la catégorie
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // État pour la marque
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);

  // États pour les filtres et tri
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Charger les catégories et marques pour les filtres
  const { categories } = useCategories();
  const { brands } = useBrands();

  useEffect(() => {
    const fetchCategory = async () => {
      if (categorySlug) {
        setCategoryLoading(true);
        setCategoryError(null);
        try {
          const cat = await getCategoryBySlug(categorySlug);
          setCategory(cat);
          setCategoryLoading(false);
        } catch (err) {
          setCategoryError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie');
          setCategoryLoading(false);
        }
      } else {
        setCategory(null);
        setCategoryLoading(false);
        setCategoryError(null);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  useEffect(() => {
    const fetchBrand = async () => {
      if (brandSlug) {
        setBrandLoading(true);
        setBrandError(null);
        try {
          const br = await getBrandBySlug(brandSlug);
          setBrand(br);
          setBrandLoading(false);
        } catch (err) {
          setBrandError(err instanceof Error ? err.message : 'Erreur lors du chargement de la marque');
          setBrandLoading(false);
        }
      } else {
        setBrand(null);
        setBrandLoading(false);
        setBrandError(null);
      }
    };

    fetchBrand();
  }, [brandSlug]);

  // Construire la query pour l'API
  const productQuery = {
    search: searchQuery.trim() || undefined,
    category: (category?.id ?? selectedCategoryFilter)?.toString() || undefined,
    brand: brand?.slug || undefined,
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

  const total = filteredProducts.length;

  // Refs pour les animations
  const bannerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, selectedBrandFilter, priceRange, selectedColors, selectedSizes, sortBy]);

  // Gérer les changements de filtres
  const handleCategoryFilterChange = (categoryId: number) => {
    setSelectedCategoryFilter(categoryId === selectedCategoryFilter ? null : categoryId);
  };

  const handleBrandFilterChange = (brandId: number) => {
    setSelectedBrandFilter(brandId === selectedBrandFilter ? null : brandId);
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
    setSearchQuery('');
    setSelectedCategoryFilter(null);
    setSelectedBrandFilter(null);
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    selectedCategoryFilter != null ||
    selectedBrandFilter != null ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    sortBy !== 'relevance';

  // Animations orchestrées quand les produits sont chargés
  useEffect(() => {
    if (!loading && !error) {
      const tl = anime.createTimeline();

      // 1. Banner titre
      if (bannerRef.current) {
        tl.add(bannerRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: toMilliseconds(0.6),
          easing: ANIMATION_EASES.DEFAULT,
        });
      }

      // 2. Hero Section (si présente) - commence 0.4s avant la fin de l'animation précédente
      if (heroRef.current) {
        tl.add(heroRef.current, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: toMilliseconds(0.8),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=400');
      }

      // 3. Product Grid avec stagger - commence 0.5s avant la fin de l'animation précédente
      if (productGridRef.current && products.length > 0) {
        const productCards = productGridRef.current.querySelectorAll('.product-card');
        if (productCards.length > 0) {
          tl.add(productCards, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: toMilliseconds(0.5),
            delay: anime.stagger(toMilliseconds(0.08)),
            easing: ANIMATION_EASES.DEFAULT,
          }, '-=500');
        }
      }
    }
  }, [loading, error, products]);

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        {/* Header avec recherche, filtres et tri */}
        <div className="border-b border-gray-200 bg-white sticky top-[46px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col gap-4">
              {/* Barre de recherche */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
              </div>

              {/* Info et tri */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                  </p>
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filtres - Desktop */}
            <aside
              ref={sidebarRef}
              className="hidden md:block w-64 flex-shrink-0"
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
                    {categories?.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryFilter === cat.id}
                          onChange={() => handleCategoryFilterChange(cat.id)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Marques */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Marques</h4>
                  <div className="space-y-2">
                    {brands?.map((br) => (
                      <label
                        key={br.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrandFilter === br.id}
                          onChange={() => handleBrandFilterChange(br.id)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{br.name}</span>
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

            {/* Contenu principal */}
            <div className="flex-1">
              {/* Section Banner - Titre de la collection */}
              <div id="shopify-section-template--27249844748613__banner" className="shopify-section">
                <section className="m-[2px] last:mb-0">
                  <div ref={bannerRef} className="p-[2px] bg-[#FFFFFF] relative w-full pt-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 uppercase">
                      {category ? category.name : brand ? brand.name : 'Shop All'}
                    </h1>
                    <div className="text-sm mb-4"></div>
              
                    {/* Hero Section avec image/vidéo de catégorie */}
                    {category && !categoryLoading && !categoryError && (
                      <div ref={heroRef}>
                        <HeroSectionImage
                        title={category.name}
                        subtitle={category.description || 'Découvrez notre collection'}
                        buttonText="Shop now"
                        buttonLink={`/catalog?category=${category.slug}`}
                        videoSrc={category.videoUrl && category.videoUrl.trim() !== '' ? category.videoUrl : undefined}
                        imageSrc={getImageUrl(category.imageUrl) || '/placeholder-hero.jpg'}
                        aspectRatioMobile="4/5"
                        heightClass="md:h-[500px]"
                        />
                      </div>
                    )}

                    {/* Hero Section avec image/vidéo de marque */}
                    {brand && !brandLoading && !brandError && !category && (
                      <div ref={heroRef}>
                        <HeroSectionImage
                        title={brand.name}
                        subtitle={brand.description || 'Découvrez notre collection'}
                        buttonText="Shop now"
                        buttonLink={`/catalog?brand=${brand.slug}`}
                        videoSrc={brand.megaMenuVideo1 && brand.megaMenuVideo1.trim() !== '' ? brand.megaMenuVideo1 : undefined}
                        imageSrc={getImageUrl(brand.megaMenuImage1 || brand.logoUrl) || '/placeholder-hero.jpg'}
                        aspectRatioMobile="4/5"
                        heightClass="md:h-[500px]"
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Section Product Grid */}
              <div id="shopify-section-template--27249844748613__product-grid" className="shopify-section">
                <section className="m-[2px] last:mb-0">
                  <div className="p-[2px] bg-[#FFFFFF] relative w-full">
                    {loading && (
                      <div className="py-8 text-center uppercase">Chargement...</div>
                    )}
                    
                    {error && (
                      <div className="py-8 text-center uppercase text-red-500">
                        Erreur : {error}
                      </div>
                    )}
                    
                    {!loading && !error && (
                      <div ref={productGridRef}>
                        <ProductGrid products={products} />
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Section Pagination */}
              {!loading && !error && totalPagesFiltered > 1 && (
                <section className="m-[2px] last:mb-0">
                  <div className="p-[2px] bg-[#FFFFFF] relative w-full pt-2">
                    <nav role="navigation" aria-label="Pagination" className="pb-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 whitespace-nowrap text-sm text-black border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
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
                                  className={`inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none whitespace-nowrap text-sm ${
                                    currentPage === page
                                      ? 'text-white bg-black'
                                      : 'text-black border border-gray-300 hover:bg-gray-50'
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
                          className="inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 whitespace-nowrap text-sm text-black border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
                        >
                          Suivant
                        </button>
                      </div>
                    </nav>
                  </div>
                </section>
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
                    {categories?.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategoryFilter === cat.id}
                          onChange={() => handleCategoryFilterChange(cat.id)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Marques */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Marques</h4>
                  <div className="space-y-2">
                    {brands?.map((br) => (
                      <label
                        key={br.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrandFilter === br.id}
                          onChange={() => handleBrandFilterChange(br.id)}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">{br.name}</span>
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
    </main>
  );
};

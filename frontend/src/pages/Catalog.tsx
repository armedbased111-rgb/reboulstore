import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { Pagination } from '../components/catalog/Pagination';
import { getCategoryBySlug } from '../services/categories';
import { getBrandBySlug } from '../services/brands';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
import { SlidersHorizontal, X, Search as SearchIcon, ChevronDown } from 'lucide-react';
import type { Category, Brand } from '../types';
import * as anime from 'animejs';
import { toMilliseconds, ANIMATION_EASES } from '../animations/utils/constants';
import { SeoHead } from '../components/seo/SeoHead';
import { CATALOG_DECOR } from '../copy/catalogDecor';
import { TechnicalDecorFrame } from '../components/decorative';

const PRODUCTS_PER_PAGE = 24;

// Plages de prix prédéfinies
const PRICE_PRESETS = [
  { label: '< 100€', min: 0, max: 100 },
  { label: '100€ – 200€', min: 100, max: 200 },
  { label: '200€ – 400€', min: 200, max: 400 },
  { label: '> 400€', min: 400, max: 9999 },
];

// Section de filtre repliable
const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        className="flex items-center justify-between w-full text-left mb-3 group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500 group-hover:text-black transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-all ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

export const Catalog = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const brandSlug = searchParams.get('brand');

  // Catégorie et marque depuis URL
  const [category, setCategory] = useState<Category | null>(null);
  // Initialiser à true si categorySlug présent — évite une requête sans filtre au premier render
  const [categoryLoading, setCategoryLoading] = useState(!!categorySlug);
  const [, setCategoryError] = useState<string | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandLoading, setBrandLoading] = useState(!!brandSlug);
  const [, setBrandError] = useState<string | null>(null);

  // Filtres
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);
  const [pricePreset, setPricePreset] = useState<number | null>(null); // index du preset
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(9999);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const { categories } = useCategories();
  const { brands } = useBrands();

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, selectedBrandSlug, minPrice, maxPrice, sortBy, categorySlug, brandSlug]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (categorySlug) {
        setCategoryLoading(true);
        setCategoryError(null);
        try {
          const cat = await getCategoryBySlug(categorySlug);
          setCategory(cat);
        } catch (err) {
          setCategoryError(err instanceof Error ? err.message : 'Erreur');
        } finally {
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
        } catch (err) {
          setBrandError(err instanceof Error ? err.message : 'Erreur');
        } finally {
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

  // Résolution de la marque active : URL > sidebar
  const activeBrandSlug = brand?.slug || selectedBrandSlug || undefined;

  // Résolution de la catégorie active : URL > sidebar
  const activeCategoryId = (category?.id ?? selectedCategoryFilter)?.toString() || undefined;

  // Query API — tout côté serveur (sauf couleur/taille non supportées par l'API)
  const productQuery = {
    search: searchQuery.trim() || undefined,
    category: activeCategoryId,
    brand: activeBrandSlug,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 9999 ? maxPrice : undefined,
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    sortBy: sortBy === 'relevance' || sortBy === 'newest' || sortBy === 'oldest'
      ? sortBy === 'newest' || sortBy === 'oldest' ? 'createdAt' : undefined
      : sortBy === 'price-asc' || sortBy === 'price-desc' ? 'price' : undefined,
    sortOrder: (
      sortBy === 'price-asc' ? 'ASC'
      : sortBy === 'price-desc' ? 'DESC'
      : sortBy === 'oldest' ? 'ASC'
      : 'DESC'
    ) as 'ASC' | 'DESC',
  };

  // Ne pas lancer la requête tant que la catégorie ou la marque n'est pas encore résolue
  const isResolvingSlug = (!!categorySlug && categoryLoading) || (!!brandSlug && brandLoading);
  const { products, total, totalPages, loading, error } = useProducts(isResolvingSlug ? undefined : productQuery);

  // Filtres actifs
  const hasActiveFilters =
    !!searchQuery.trim() ||
    selectedCategoryFilter != null ||
    selectedBrandSlug != null ||
    pricePreset != null ||
    sortBy !== 'relevance';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryFilter(null);
    setSelectedBrandSlug(null);
    setPricePreset(null);
    setMinPrice(0);
    setMaxPrice(9999);
    setSortBy('relevance');
  };

  const handlePricePreset = (idx: number) => {
    if (pricePreset === idx) {
      // Désélectionner
      setPricePreset(null);
      setMinPrice(0);
      setMaxPrice(9999);
    } else {
      const preset = PRICE_PRESETS[idx];
      setPricePreset(idx);
      setMinPrice(preset.min);
      setMaxPrice(preset.max);
    }
  };

  const handleBrandToggle = (slug: string) => {
    setSelectedBrandSlug((prev) => (prev === slug ? null : slug));
  };

  const handleCategoryToggle = (id: number) => {
    setSelectedCategoryFilter((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refs animations
  const bannerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !error) {
      const tl = anime.createTimeline();
      if (bannerRef.current) {
        tl.add(bannerRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: toMilliseconds(0.6),
          easing: ANIMATION_EASES.DEFAULT,
        });
      }
      if (heroRef.current) {
        tl.add(heroRef.current, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: toMilliseconds(0.8),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=400');
      }
      if (productGridRef.current && products.length > 0) {
        const cards = productGridRef.current.querySelectorAll('.product-card');
        if (cards.length > 0) {
          tl.add(cards, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: toMilliseconds(0.5),
            delay: anime.stagger(toMilliseconds(0.05)),
            easing: ANIMATION_EASES.DEFAULT,
          }, '-=400');
        }
      }
    }
  }, [loading, error, products]);

  // Contenu de la sidebar (partagé desktop + mobile)
  const filtersContent = (
    <div>
      {/* Catégories */}
      {!categorySlug && (
        <FilterSection title="Catégories">
          <div className="space-y-1">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryToggle(cat.id)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Marques */}
      {!brandSlug && (
        <FilterSection title="Marques">
          <div className="space-y-1">
            {brands?.map((br) => (
              <button
                key={br.id}
                onClick={() => handleBrandToggle(br.slug)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  selectedBrandSlug === br.slug
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {br.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Prix */}
      <FilterSection title="Prix">
        <div className="space-y-1">
          {PRICE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePricePreset(idx)}
              className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                pricePreset === idx
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <SeoHead
        title="Catalogue | Reboul Store"
        description="Parcourez le catalogue Reboul Store: vetements premium, marques iconiques et nouveautes selectionnees."
        path={searchParams.toString() ? `/catalog?${searchParams.toString()}` : '/catalog'}
      />
      <div className="w-full">
        {/* Barre sticky : recherche + tri */}
        <div className="border-b border-gray-200 bg-white sticky top-[46px] z-40">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
              {/* Ligne 1 : Recherche (pleine largeur mobile, flex-1 desktop) */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Ligne 2 mobile / inline desktop : Tri + bouton Filtres */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:flex-none px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black bg-white min-h-[44px]"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="oldest">Anciens</option>
                </select>

                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:border-black min-h-[44px] whitespace-nowrap"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-black inline-block" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden w-56 flex-shrink-0 md:block">
              <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
                <div className="relative p-[2px]">
                  <TechnicalDecorFrame insetClassName="inset-2" omitCorners={['tl', 'tr']} />
                  <div className="relative z-[3]">
                    <div className="mb-6 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-900">
                          Filtres
                        </span>
                        <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-black/25">
                          {CATALOG_DECOR.filtersHudLine}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="shrink-0 text-xs uppercase tracking-wide text-gray-400 hover:text-black"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </div>
                    {filtersContent}
                  </div>
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <div className="relative min-w-0 flex-1 p-[2px]">
              <TechnicalDecorFrame
                datum={CATALOG_DECOR.frameDatum}
                datumClassName="bottom-2 left-2 max-w-[min(72%,14rem)] sm:bottom-2.5 sm:left-3"
                insetClassName="inset-2 sm:inset-3"
                omitCorners={['tl', 'bl', 'br']}
              />
              <div className="relative z-[3]">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 mb-4">
                <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
                <span>/</span>
                <Link to="/catalog" className="hover:text-black transition-colors">Catalogue</Link>
                {category && <><span>/</span><span className="text-gray-900 capitalize">{category.name}</span></>}
                {brand && !category && <><span>/</span><span className="text-gray-900">{brand.name}</span></>}
              </nav>

              {/* Banner titre */}
              <div ref={bannerRef} className="mb-4">
                <h1 className="text-2xl font-medium uppercase md:text-3xl lg:text-4xl">
                  {category ? category.name : brand ? brand.name : 'Shop All'}
                </h1>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
                  {CATALOG_DECOR.hudLine}
                </p>
                {!loading && (
                  <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">
                    {total} produit{total > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Chips filtres actifs */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategoryFilter != null && categories?.find(c => c.id === selectedCategoryFilter) && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full capitalize">
                      {categories.find(c => c.id === selectedCategoryFilter)!.name}
                      <button onClick={() => setSelectedCategoryFilter(null)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedBrandSlug && brands?.find(b => b.slug === selectedBrandSlug) && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full">
                      {brands.find(b => b.slug === selectedBrandSlug)!.name}
                      <button onClick={() => setSelectedBrandSlug(null)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {pricePreset !== null && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full">
                      {PRICE_PRESETS[pricePreset].label}
                      <button onClick={() => { setPricePreset(null); setMinPrice(0); setMaxPrice(9999); }} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs rounded-full">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}


              {/* Grille produits */}
              {loading && (
                <div className="py-16 text-center text-xs uppercase tracking-widest text-gray-400">
                  Chargement...
                </div>
              )}
              {error && (
                <div className="py-16 text-center text-xs uppercase text-red-500">
                  Erreur : {error}
                </div>
              )}
              {!loading && !error && (
                <div ref={productGridRef}>
                  <ProductGrid products={products} />
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    total={total}
                    limit={PRODUCTS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mobile (drawer) */}
        {isFiltersOpen && (
          <div className="fixed inset-0 z-[10000] md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-72 overflow-y-auto bg-white shadow-xl">
              <div className="relative p-6">
                <TechnicalDecorFrame insetClassName="inset-3" omitCorners={['tl', 'tr']} />
                <div className="relative z-[3]">
                  <div className="mb-6 flex items-start justify-between gap-2">
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-semibold uppercase tracking-widest">Filtres</span>
                      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-black/25">
                        {CATALOG_DECOR.filtersHudLine}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFiltersOpen(false)}
                      className="shrink-0 p-1 hover:bg-gray-100"
                      aria-label="Fermer les filtres"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        clearFilters();
                        setIsFiltersOpen(false);
                      }}
                      className="mb-4 text-xs uppercase tracking-wide text-gray-400 hover:text-black"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  )}
                  {filtersContent}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { getCategoryBySlug } from '../services/categories';
import { getBrandBySlug } from '../services/brands';
import { getImageUrl } from '../utils/imageUtils';
import type { Category, Brand } from '../types';

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

  // Récupérer la catégorie si un slug est présent dans l'URL
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

  // Récupérer la marque si un slug est présent dans l'URL
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

  const { products, loading, error, totalPages, page } = useProducts({
    limit: 20, // Nombre de produits par page
    page: 1,
    category: category?.id, // Filtrer par catégorie si présente
    brand: brand?.id, // Filtrer par marque si présente (TODO: ajouter support backend)
  });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        {/* Section Banner - Titre de la collection */}
        <div id="shopify-section-template--27249844748613__banner" className="shopify-section">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-[#FFFFFF] relative w-full pt-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 uppercase">
                {category ? category.name : brand ? brand.name : 'Shop All'}
              </h1>
              <div className="text-sm mb-4"></div>
              
              {/* Hero Section avec image/vidéo de catégorie */}
              {category && !categoryLoading && !categoryError && (
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
              )}

              {/* Hero Section avec image/vidéo de marque */}
              {brand && !brandLoading && !brandError && !category && (
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
                <ProductGrid products={products} />
              )}
            </div>
          </section>
        </div>

        {/* Section Pagination - À implémenter plus tard */}
        {!loading && !error && totalPages > 1 && (
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-[#FFFFFF] relative w-full pt-2">
              <nav role="navigation" aria-label="Pagination" className="pb-4">
                <ul role="list" className="grid gap-2 auto-cols-auto grid-flow-col justify-start">
                  {/* Pagination sera implémentée plus tard */}
                  <li>
                    <button
                      disabled
                      aria-current="page"
                      aria-label={`Page ${page}`}
                      className="inline-block py-2.5 md:py-1.5 px-6 rounded-[10px] md:rounded-md outline-none disabled:opacity-50 whitespace-nowrap text-sm text-white bg-black"
                    >
                      {page}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

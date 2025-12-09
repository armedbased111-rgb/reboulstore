import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { getCategoryBySlug } from '../services/categories';
import { getImageUrl } from '../utils/imageUtils';
import type { Category } from '../types';

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
  
  // État pour la catégorie
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

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

  const { products, loading, error, totalPages, page } = useProducts({
    limit: 20, // Nombre de produits par page
    page: 1,
    category: category?.id, // Filtrer par catégorie si présente
  });

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        {/* Section Banner - Titre de la collection */}
        <div id="shopify-section-template--27249844748613__banner" className="shopify-section">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-[#FFFFFF] relative w-full pt-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 uppercase">
                {category ? category.name : 'Shop All'}
              </h1>
              <div className="text-sm mb-4"></div>
              
              {/* Hero Section avec image de catégorie */}
              {category && !categoryLoading && !categoryError && (
                <HeroSectionImage
                  title={category.name}
                  subtitle={category.description || 'Découvrez notre collection'}
                  buttonText="Shop now"
                  buttonLink={`/catalog?category=${category.slug}`}
                  imageSrc={getImageUrl(category.imageUrl) || '/placeholder-hero.jpg'}
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

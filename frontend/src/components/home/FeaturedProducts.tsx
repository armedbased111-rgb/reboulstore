import { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Product, Category } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useProducts } from '../../hooks/useProducts';
import { getCategoryBySlug } from '../../services/categories';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

/**
 * Composant pour une image produit avec gestion d'erreur
 * Utilise un état pour éviter les boucles infinies de re-render
 */
const ProductImage = ({ 
  src, 
  alt, 
  className
}: { 
  src: string | null; 
  alt: string; 
  className?: string;
}) => {
  const [hasError, setHasError] = useState(false);

  // Si pas d'URL ou erreur de chargement, afficher placeholder
  if (!src || hasError) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-xs uppercase">No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className || 'w-full h-full object-cover'}
      loading="lazy"
      onError={() => {
        // Une seule fois : si erreur, on passe hasError à true et on n'essaie plus de charger
        setHasError(true);
      }}
    />
  );
};

/**
 * Props du composant FeaturedProducts
 */
interface FeaturedProductsProps {
  /** Titre de la section (ex: "Winter Sale", "ACW* Arsenal") */
  title: string;
  /** Liste des produits à afficher (optionnel si categorySlug est fourni) */
  products?: Product[];
  /** Slug de la catégorie pour récupérer automatiquement les produits (optionnel) */
  categorySlug?: string;
  /** Nombre limite de produits à afficher (par défaut: 10) */
  limit?: number;
}

/**
 * Composant FeaturedProducts - Carousel de produits mis en avant
 * Style inspiré A-COLD-WALL* : Carousel horizontal avec navigation prev/next
 * Utilise Swiper pour le swipe tactile et la navigation
 * 
 * Structure :
 * - Titre avec boutons de navigation
 * - Liste de produits en carousel horizontal avec Swiper
 * - Chaque produit : image avec hover effect, titre, prix
 * 
 * Deux modes d'utilisation :
 * 1. Avec prop `products` : Liste de produits fournie directement
 * 2. Avec prop `categorySlug` : Récupère automatiquement les produits de la catégorie
 */
export const FeaturedProducts = ({ 
  title, 
  products: productsProp, 
  categorySlug,
  limit = 10 
}: FeaturedProductsProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // État pour stocker l'ID de la catégorie (récupéré depuis le slug)
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Si categorySlug est fourni, récupérer l'ID de la catégorie
  useEffect(() => {
    if (categorySlug) {
      console.log('🔍 FeaturedProducts: Récupération catégorie avec slug:', categorySlug);
      // Utiliser des fonctions de mise à jour pour éviter les warnings
      setCategoryLoading(true);
      setCategoryError(null);
      getCategoryBySlug(categorySlug)
        .then((category: Category) => {
          console.log('✅ FeaturedProducts: Catégorie trouvée:', category);
          if (category && category.id) {
            setCategoryId(category.id);
          } else {
            console.warn('⚠️ FeaturedProducts: Catégorie trouvée mais sans ID:', category);
            setCategoryError('Catégorie invalide');
          }
          setCategoryLoading(false);
        })
        .catch((err: unknown) => {
          console.error('❌ FeaturedProducts: Erreur catégorie:', err);
          setCategoryError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie');
          setCategoryLoading(false);
        });
    } else {
      setCategoryId(null);
    }
  }, [categorySlug]);

  // Si categoryId est disponible, récupérer les produits de la catégorie
  const query = useMemo(() => {
    if (categoryId) {
      return { category: categoryId, limit };
    }
    return undefined;
  }, [categoryId, limit]);

  const { products: productsFromCategory, loading, error } = useProducts(query);

  // Déterminer quelle liste de produits utiliser
  const products = categorySlug ? productsFromCategory : (productsProp || []);

  // Mettre à jour l'état des boutons selon la position du swiper
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const updateButtons = () => {
      if (prevButtonRef.current) {
        prevButtonRef.current.disabled = swiper.isBeginning;
        prevButtonRef.current.style.opacity = swiper.isBeginning ? '0' : '1';
      }
      if (nextButtonRef.current) {
        nextButtonRef.current.disabled = swiper.isEnd;
        nextButtonRef.current.style.opacity = swiper.isEnd ? '0' : '1';
      }
    };

    // Attendre que Swiper soit initialisé
    swiper.on('init', updateButtons);
    swiper.on('slideChange', updateButtons);
    swiper.on('reachBeginning', updateButtons);
    swiper.on('reachEnd', updateButtons);
    
    // Mettre à jour après un court délai pour s'assurer que Swiper est prêt
    const timeoutId = setTimeout(() => {
      updateButtons();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      swiper.off('init', updateButtons);
      swiper.off('slideChange', updateButtons);
      swiper.off('reachBeginning', updateButtons);
      swiper.off('reachEnd', updateButtons);
    };
  }, [products.length]);

  // Navigation
  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  // Obtenir la première image d'un produit (URL complète)
  const getFirstImage = (product: Product): string | null => {
    if (product.images && product.images.length > 0) {
      return getImageUrl(product.images[0].url);
    }
    return null; // Pas d'image, on affichera un placeholder CSS
  };

  // Obtenir la deuxième image (pour hover effect) - URL complète
  const getSecondImage = (product: Product): string | null => {
    if (product.images && product.images.length > 1) {
      return getImageUrl(product.images[1].url);
    }
    return null;
  };

  // Convertir le prix en nombre (peut être string depuis l'API)
  const getPriceAsNumber = (price: number | string): number => {
    if (typeof price === 'string') {
      return parseFloat(price) || 0;
    }
    return price;
  };

  // Calculer le prix réduit (exemple : 30% de réduction)
  const getSalePrice = (price: number | string) => {
    const numPrice = getPriceAsNumber(price);
    return Math.round(numPrice * 0.7 * 100) / 100; // 30% de réduction
  };

  // Si chargement de la catégorie, ne rien afficher
  if (categorySlug && categoryLoading) {
    return null;
  }

  // Si erreur lors du chargement de la catégorie, ne rien afficher
  if (categorySlug && categoryError) {
    return null;
  }

  // Si chargement des produits, erreur ou pas de produits (mode categorySlug), ne rien afficher
  if (categorySlug && (loading || error || products.length === 0)) {
    return null;
  }

  // Si pas de produits (mode avec products prop), ne rien afficher
  if (!categorySlug && (!productsProp || productsProp.length === 0)) {
    return null;
  }

  return (
    <section className="m-[2px] last:mb-0">
      <div className="p-[2px] relative w-full">
        <div className="pb-4">
          {/* Header avec titre et navigation */}
          <div className="flex justify-between items-start mb-4">
            {/* Titre */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mr-4 mt-2 mb-4 uppercase tracking-tight">
              {title}
            </h2>

            {/* Boutons de navigation */}
            <div className="my-[20px] flex gap-2 mr-3">
              {/* Bouton Previous */}
              <button
                ref={prevButtonRef}
                onClick={slidePrev}
                className="disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed"
                aria-label="Produits précédents"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="13" 
                  viewBox="0 0 14 13" 
                  xmlSpace="preserve"
                  className="fill-current"
                >
                  <path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" />
                </svg>
              </button>

              {/* Bouton Next */}
              <button
                ref={nextButtonRef}
                onClick={slideNext}
                className="rotate-180 disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed"
                aria-label="Produits suivants"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="13" 
                  viewBox="0 0 14 13" 
                  xmlSpace="preserve"
                  className="fill-current"
                >
                  <path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Liste de produits - Carousel horizontal avec Swiper */}
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation]}
            spaceBetween={2}
            slidesPerView="auto"
            breakpoints={{
              0: {
                slidesPerView: 2.2,
                spaceBetween: 2,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 2,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 2,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 2,
              },
            }}
            className="!pb-4"
            style={{
              paddingLeft: '0',
              paddingRight: '0',
            }}
          >
            {products.map((product) => {
              const firstImage = getFirstImage(product);
              const secondImage = getSecondImage(product);
              const productPrice = getPriceAsNumber(product.price);
              const salePrice = getSalePrice(productPrice);

              return (
                <SwiperSlide
                  key={product.id}
                  className="!w-[166px] sm:!w-[222px] md:!w-[254px]"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm group block"
                  >
                    <article>
                      {/* Image avec hover effect - Dimensions A-COLD-WALL* : 254x338 (aspect ratio ~3/4) */}
                      <figure className="mb-[2px] relative aspect-[3/4] overflow-hidden bg-gray-100">
                        {firstImage ? (
                          <>
                            {/* Première image (visible par défaut) */}
                            <div className="absolute inset-0 w-full h-full md:group-hover:opacity-0 transition-opacity duration-300">
                              <ProductImage
                                src={firstImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Deuxième image (visible au hover) */}
                            {secondImage && (
                              <div className="absolute inset-0 w-full h-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <ProductImage
                                  src={secondImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <ProductImage src={null} alt={product.name} />
                        )}
                      </figure>

                      {/* Titre produit */}
                      <h4 className="uppercase text-sm font-regular">
                        {product.name}
                      </h4>

                      {/* Prix */}
                      <div className="text-xs">
                        <s className="mr-[.25em] text-gray-500">
                          {productPrice.toFixed(2)} EUR
                        </s>
                        <span className="font-normal">
                          {salePrice.toFixed(2)} EUR
                        </span>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

    </section>
  );
};

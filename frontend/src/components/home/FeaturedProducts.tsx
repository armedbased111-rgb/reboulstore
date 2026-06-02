import { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Product, Category } from '../../types';
import { HOME_FEATURED_DECOR } from '../../copy/homeSectionsDecor';
import { getImageUrl } from '../../utils/imageUtils';
import { TechnicalDecorFrame } from '../decorative';
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
  title: string;
  viewAllLink?: string;
  products?: Product[];
  categorySlug?: string;
  limit?: number;
  /** Image de fond pour un mini-hero au-dessus du carousel */
  heroBg?: string;
  heroBgMobile?: string;
  /** Tag affiché en haut à gauche du mini-hero (ex: "SS26") */
  brandTag?: string;
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
  viewAllLink,
  products: productsProp,
  categorySlug,
  limit = 10,
  heroBg,
  heroBgMobile,
  brandTag,
}: FeaturedProductsProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // État pour stocker l'ID de la catégorie (récupéré depuis le slug)
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(!!categorySlug);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Si categorySlug est fourni, récupérer l'ID de la catégorie
  useEffect(() => {
    if (categorySlug) {
      console.log('🔍 FeaturedProducts: Récupération catégorie avec slug:', categorySlug);
      queueMicrotask(() => setCategoryError(null));
      getCategoryBySlug(categorySlug)
        .then((category: Category) => {
          console.log('✅ FeaturedProducts: Catégorie trouvée:', category);
            if (category && category.id != null) {
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
      queueMicrotask(() => {
        setCategoryId(null);
        setCategoryLoading(false);
      });
    }
  }, [categorySlug]);

  // Si categoryId est disponible, récupérer les produits de la catégorie
  const query = useMemo(() => {
    if (categoryId != null) {
      return { category: String(categoryId), limit };
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

  // Trie les images : d'abord par order, puis les "back" à la fin
  const getSortedImages = (product: Product) => {
    if (!product.images || product.images.length === 0) return [];
    return [...product.images]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .sort((a, b) => {
        const aIsBack = a.url.toLowerCase().includes('back');
        const bIsBack = b.url.toLowerCase().includes('back');
        return Number(aIsBack) - Number(bIsBack);
      });
  };

  // Obtenir la première image d'un produit (face en priorité)
  const getFirstImage = (product: Product): string | null => {
    const sorted = getSortedImages(product);
    return sorted.length > 0 ? getImageUrl(sorted[0].url) : null;
  };

  // Obtenir la deuxième image (hover effect — back en priorité si dispo)
  const getSecondImage = (product: Product): string | null => {
    const sorted = getSortedImages(product);
    if (sorted.length <= 1) return null;
    const back = sorted.find(img => img.url.toLowerCase().includes('back'));
    return getImageUrl((back ?? sorted[1]).url);
  };

  // Convertir le prix en nombre (peut être string depuis l'API)
  const getPriceAsNumber = (price: number | string): number => {
    if (typeof price === 'string') return parseFloat(price) || 0;
    return price;
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
      {/* Mini-hero optionnel */}
      {heroBg && (
        <div className="relative w-full aspect-[4/1] overflow-hidden">
          {/* Image de fond — mobile ou desktop */}
          <img
            src={heroBgMobile && typeof window !== 'undefined' && window.innerWidth < 768 ? heroBgMobile : heroBg}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          {/* Gradient bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Contenu */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 z-10">
            {/* Tag haut gauche */}
            {brandTag && (
              <span className="self-start font-mono text-[9px] uppercase tracking-[0.22em] text-white/60 border border-white/20 px-2 py-0.5">
                {brandTag}
              </span>
            )}
            {/* Titre + nav bas */}
            <div className="flex items-end justify-between gap-4">
              {viewAllLink ? (
                <Link to={viewAllLink} className="hover:opacity-70 transition-opacity">
                  <h2 className="text-[26px] md:text-[36px] font-normal leading-none text-white uppercase">{title}</h2>
                </Link>
              ) : (
                <h2 className="text-[26px] md:text-[36px] font-normal leading-none text-white uppercase">{title}</h2>
              )}
              <div className="flex shrink-0 gap-3 pb-1">
                <button ref={prevButtonRef} onClick={slidePrev} className="disabled:opacity-0 cursor-pointer transition-opacity" aria-label="Précédent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" className="fill-white"><path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" /></svg>
                </button>
                <button ref={nextButtonRef} onClick={slideNext} className="rotate-180 disabled:opacity-0 cursor-pointer transition-opacity" aria-label="Suivant">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" className="fill-white"><path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full p-[2px]">
        <TechnicalDecorFrame
          datum={HOME_FEATURED_DECOR.frameDatum}
          datumClassName="bottom-2 left-2 max-w-[min(72%,14rem)] sm:bottom-2.5 sm:left-3"
          insetClassName="inset-2 sm:inset-3"
          omitCorners={['tr', 'bl']}
        />
        <div className="relative z-[3] pb-4">
          {/* Header classique — seulement si pas de mini-hero */}
          {!heroBg && (
            <div className="mb-[16px] flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                {viewAllLink ? (
                  <Link to={viewAllLink} className="block hover:opacity-60 transition-opacity">
                    <h2 className="text-[28px] font-normal leading-none">{title}</h2>
                  </Link>
                ) : (
                  <h2 className="text-[28px] font-normal leading-none">{title}</h2>
                )}
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
                  {HOME_FEATURED_DECOR.hudLine}
                </p>
              </div>
              <div className="mr-3 flex shrink-0 gap-2">
                <button ref={prevButtonRef} onClick={slidePrev} className="disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed" aria-label="Produits précédents">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" xmlSpace="preserve" className="fill-current"><path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" /></svg>
                </button>
                <button ref={nextButtonRef} onClick={slideNext} className="rotate-180 disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed" aria-label="Produits suivants">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" xmlSpace="preserve" className="fill-current"><path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" /></svg>
                </button>
              </div>
            </div>
          )}

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
                      <h4 className="text-[12px] font-medium uppercase mt-[4px]">
                        {product.name}
                      </h4>

                      {/* Prix */}
                      <p className="text-[12px] font-normal mt-[2px]">
                        {productPrice.toFixed(2)} EUR
                      </p>
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

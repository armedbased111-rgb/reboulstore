import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { HOME_CATEGORY_DECOR } from '../../copy/homeSectionsDecor';
import { useCategories } from '../../hooks/useCategories';
import { getImageUrl } from '../../utils/imageUtils';
import { TechnicalDecorFrame } from '../decorative';
import { getProducts } from '../../services/products';
import type { Product } from '../../types';

// Import Swiper styles
import 'swiper/swiper-bundle.css';




/**
 * Composant CategorySection - Section "Shop by category" avec carousel
 * Style inspiré A-COLD-WALL* : Grandes cartes d'images avec texte en overlay
 * 
 * Structure :
 * - Titre "Shop by category" avec boutons de navigation
 * - Carousel horizontal avec Swiper
 * - Chaque catégorie : grande image avec texte "Sweats" + bouton "Shop now"
 */
export const CategorySection = () => {
  const { categories, loading, error } = useCategories();
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const [categoryImages, setCategoryImages] = useState<Record<number, string | null>>({});

  // Charger une image produit aléatoire pour chaque catégorie
  useEffect(() => {
    if (categories.length === 0) return;
    categories.forEach(async (cat) => {
      try {
        const response = await getProducts({ category: String(cat.id), limit: 50 });
        const withImages = response.products.filter(
          (p: Product) => p.images && p.images.length > 0
        );
        if (withImages.length === 0) return;
        const pick = withImages[Math.floor(Math.random() * withImages.length)];
        const sorted = [...pick.images!]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .filter(img => !img.url.toLowerCase().includes('back'));
        const img = sorted[0] || pick.images![0];
        const url = getImageUrl(img.url);
        if (url) setCategoryImages(prev => ({ ...prev, [cat.id]: url }));
      } catch (error) {
        console.error('Error loading category image', error);
      }
    });
  }, [categories]);

  // Mettre à jour l'état des boutons selon la position du swiper
  // (Même logique que FeaturedProducts)
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
    
    // Mettre à jour après un court délai
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
  }, [categories.length]);

  // Navigation
  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  // Si chargement, erreur ou pas de catégories, ne rien afficher
  if (loading || error || categories.length === 0) {
    return null;
  }

  return (
    <section className="m-[2px] last:mb-0">
      <div className="relative w-full p-[2px]">
        <TechnicalDecorFrame
          datum={HOME_CATEGORY_DECOR.frameDatum}
          datumClassName="bottom-2 left-2 max-w-[min(72%,14rem)] sm:bottom-2.5 sm:left-3"
          insetClassName="inset-2 sm:inset-3"
          omitCorners={['tr', 'bl']}
        />
        <div className="relative z-[3] pb-4">
          <div className="mb-[16px] flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-medium uppercase tracking-tight md:text-3xl lg:text-4xl">
                Shop by category
              </h2>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
                {HOME_CATEGORY_DECOR.hudLine}
              </p>
            </div>

            <div className="mr-3 flex shrink-0 gap-2">
              {/* Bouton Previous */}
              <button
                ref={prevButtonRef}
                onClick={slidePrev}
                className="disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed"
                aria-label="Catégories précédentes"
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
                aria-label="Catégories suivantes"
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

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation]}
            spaceBetween={2}
            slidesPerView="auto"
            breakpoints={{
              0: {
                slidesPerView: 1.2,
                spaceBetween: 2,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 2,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 2,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 2,
              },
            }}
            className="!pb-4"
            style={{
              paddingLeft: '0',
              paddingRight: '0',
            }}
          >
            {categories.map((category) => (
              <SwiperSlide
                key={category.id}
                className="!w-[300px] sm:!w-[400px] md:!w-[500px] lg:!w-[600px]"
              >
                <Link
                  to={`/catalog?category=${category.slug}`}
                  className="block group"
                >
                  <article className="relative">
                    {/* Image produit aléatoire de la catégorie */}
                    <figure className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                      {categoryImages[category.id] ? (
                        <img
                          src={categoryImages[category.id]!}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm uppercase">{category.name}</span>
                        </div>
                      )}

                    </figure>
                    <p className="text-[12px] font-medium uppercase mt-[4px] tracking-wide">
                      {category.name} — SHOP NOW
                    </p>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
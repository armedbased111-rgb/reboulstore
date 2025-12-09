import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useCategories } from '../../hooks/useCategories';
import { getImageUrl } from '../../utils/imageUtils';

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
      <div className="p-[2px] relative w-full">
        <div className="pb-4">
          {/* Header avec titre et navigation */}
          <div className="flex gap-x-2 justify-between">
            {/* Titre */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 uppercase tracking-tight">
              Shop by category
            </h2>

            {/* Boutons de navigation */}
            <div className="my-1 flex gap-2 mr-3">
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

          {/* Carousel de catégories avec Swiper */}
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
                  to={`/collections/${category.slug}`}
                  className="block group"
                >
                  <article className="relative">
                    {/* Image de la catégorie */}
                    <figure className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                      {getImageUrl(category.imageUrl) ? (
                        <img
                          src={getImageUrl(category.imageUrl)!}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        // Placeholder si pas d'image
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm uppercase">
                            {category.name}
                          </span>
                        </div>
                      )}

                      {/* Overlay avec texte et bouton - Positionné sur l'image */}
                      {/* Nom de la catégorie - Positionné au milieu à gauche */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 p-6">
                        <h3 className="text-white text-2xl md:text-3xl font-light uppercase">
                          {category.name}
                        </h3>
                      </div>

                      {/* Bouton "Shop now" - Positionné en bas à gauche */}
                      <div className="absolute bottom-0 left-0 p-6">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // La navigation se fait via le Link parent
                          }}
                          className="bg-black rounded-md text-white px-6 py-2 text-sm uppercase font-light hover:bg-gray-800 transition-colors"
                        >
                          Shop now
                        </button>
                      </div>
                    </figure>
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
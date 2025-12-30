import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useBrands } from '../../hooks/useBrands';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

/**
 * Props du composant BrandCarousel
 */
interface BrandCarouselProps {
  /** Titre de la section (optionnel, par défaut: "Nos Marques") */
  title?: string;
  /** Nombre limite de marques à afficher (optionnel, par défaut: toutes) */
  limit?: number;
}

/**
 * Composant BrandCarousel - Carousel horizontal avec logos des marques
 * Style inspiré A-COLD-WALL* : Minimaliste, premium, espacement généreux
 * 
 * Structure :
 * - Titre avec boutons de navigation
 * - Carousel horizontal avec Swiper
 * - Chaque marque : logo cliquable (lien vers catalogue filtré par marque)
 * 
 * Responsive :
 * - Mobile : 2-3 logos visibles
 * - Desktop : 5-6 logos visibles
 */
export const BrandCarousel = ({ 
  title = 'Nos Marques',
  limit 
}: BrandCarouselProps) => {
  const { brands, loading, error } = useBrands();
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Filtrer les marques avec logos et limiter si nécessaire
  const brandsWithLogos = brands
    .filter(brand => brand.logoUrl)
    .slice(0, limit);

  // Mettre à jour l'état des boutons selon la position du swiper
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const updateButtons = () => {
      if (prevButtonRef.current) {
        prevButtonRef.current.disabled = swiper.isBeginning;
        prevButtonRef.current.style.opacity = swiper.isBeginning ? '0.3' : '1';
      }
      if (nextButtonRef.current) {
        nextButtonRef.current.disabled = swiper.isEnd;
        nextButtonRef.current.style.opacity = swiper.isEnd ? '0.3' : '1';
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
  }, [brandsWithLogos.length]);

  // Navigation
  const slidePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  // Si chargement, erreur ou pas de marques, ne rien afficher
  if (loading || error || brandsWithLogos.length === 0) {
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
                aria-label="Marques précédentes"
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
                className="disabled:opacity-0 cursor-pointer transition-opacity disabled:cursor-not-allowed"
                aria-label="Marques suivantes"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="13" 
                  viewBox="0 0 14 13" 
                  xmlSpace="preserve"
                  className="fill-current"
                >
                  <path d="M0 7.07h11.8L6.64 12.19l.81.81 5.74-5.69L14 6.5l-.81-.81L6.64 0l-.81.81L11.8 6.93H0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Swiper */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2.2}
              slidesPerGroup={1}
              breakpoints={{
                640: {
                  slidesPerView: 3.5,
                  spaceBetween: 24,
                },
                768: {
                  slidesPerView: 4.5,
                  spaceBetween: 32,
                },
                1024: {
                  slidesPerView: 5.5,
                  spaceBetween: 40,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 48,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className="brand-carousel"
            >
              {brandsWithLogos.map((brand) => (
                <SwiperSlide key={brand.id}>
                  <Link
                    to={`/catalog?brand=${brand.slug}`}
                    className="block group"
                  >
                    <div className="aspect-square bg-gray-50 rounded-sm p-4 md:p-6 flex items-center justify-center transition-all duration-200 group-hover:bg-gray-100 border border-transparent group-hover:border-gray-200">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-full h-full object-contain max-w-[120px] max-h-[120px] opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                          loading="lazy"
                          onError={(e) => {
                            // Si erreur de chargement, afficher placeholder
                            e.currentTarget.style.display = 'none';
                            const placeholder = e.currentTarget.nextElementSibling;
                            if (placeholder) {
                              placeholder.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      {/* Placeholder si pas de logo ou erreur */}
                      <div className="hidden w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs uppercase text-center">
                          {brand.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import type { Image, Product } from '../../types';
import { getImageUrl } from '../../utils/imageUtils';
import { ProductBadge } from './ProductBadge';

// @ts-expect-error - Swiper CSS imports (pas de déclarations TypeScript)
import 'swiper/css';
// @ts-expect-error - Swiper CSS imports (pas de déclarations TypeScript)
import 'swiper/css/navigation';

interface ProductGalleryProps {
  images: Image[];
  productName: string;
  product?: Product;
}

/**
 * Composant ProductGallery - Carrousel d'images style A-COLD-WALL*
 * 
 * Carrousel Swiper horizontal avec :
 * - Images triées par order
 * - Navigation prev/next (mobile)
 * - Aspect ratio 4:3
 * - Grille d'images sur desktop (pas de carrousel)
 */
export const ProductGallery = ({ images, productName, product }: ProductGalleryProps) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Trier les images par order
  const sortedImages = images.sort((a, b) => a.order - b.order);

  // Gestion états prev/next
  const handleSwiper = (swiperInstance: SwiperType) => {
    setSwiper(swiperInstance);
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  return (
    <div>
      {/* Boutons navigation mobile */}
      <div className="flex justify-end pt-[2px] pb-2 lg:hidden">
        <div className="flex gap-2 mr-3">
          <button
            onClick={() => swiper?.slidePrev()}
            disabled={isBeginning}
            className="disabled:opacity-0 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="13"
              viewBox="0 0 14 13"
            >
              <path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" />
            </svg>
          </button>
          <button
            onClick={() => swiper?.slideNext()}
            disabled={isEnd}
            className="rotate-180 disabled:opacity-0 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="13"
              viewBox="0 0 14 13"
            >
              <path d="M14 5.93H2.2L7.36.81 6.55 0 .81 5.69 0 6.5l.81.81L6.55 13l.81-.81L2.2 7.07H14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carrousel Swiper (mobile) + Grille (desktop) */}
      <div className="relative">
        {/* Badge produit (overlay) */}
        {product && <ProductBadge product={product} />}

        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className="lg:!grid lg:grid-cols-1 lg:gap-[2px]"
        >
          {sortedImages.map((image) => (
            <SwiperSlide key={image.id}>
              <picture className="block relative">
                {/* Aspect ratio placeholder (4:3 = 133.33%) */}
                <span
                  className="w-full block bg-black opacity-10"
                  style={{ paddingBottom: '133.33%' }}
                ></span>

                {/* Image */}
                <img
                  src={getImageUrl(image.url) || ''}
                  alt={image.alt || productName}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              </picture>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
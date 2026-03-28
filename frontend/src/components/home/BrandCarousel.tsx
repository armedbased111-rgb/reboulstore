import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { HOME_BRANDS_DECOR } from '../../copy/homeSectionsDecor';
import { useBrands } from '../../hooks/useBrands';
import { TechnicalDecorFrame } from '../decorative';

import 'swiper/swiper-bundle.css';

interface BrandCarouselProps {
  title?: string;
  limit?: number;
}

const PAGE_SIZE = 9;

export const BrandCarousel = ({
  title = 'Nos Marques',
  limit
}: BrandCarouselProps) => {
  const { brands, loading, error } = useBrands();

  const brandsWithLogos = brands
    .filter(brand => brand.logoUrl)
    .slice(0, limit);

  // Découper en pages de 9
  const pages: typeof brandsWithLogos[] = [];
  for (let i = 0; i < brandsWithLogos.length; i += PAGE_SIZE) {
    pages.push(brandsWithLogos.slice(i, i + PAGE_SIZE));
  }

  if (loading || error || brandsWithLogos.length === 0) return null;

  return (
    <section className="m-[2px] last:mb-0">
      <div className="relative w-full p-[2px]">
        <TechnicalDecorFrame
          datum={HOME_BRANDS_DECOR.frameDatum}
          datumClassName="bottom-2 left-2 max-w-[min(72%,14rem)] sm:bottom-2.5 sm:left-3"
          insetClassName="inset-2 sm:inset-3"
          omitCorners={['br', 'bl']}
        />
        <div className="relative z-[3] pb-4">
          <div className="mb-[16px]">
            <h2 className="text-[28px] font-normal leading-none">{title}</h2>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
              {HOME_BRANDS_DECOR.hudLine}
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={pages.length > 1}
            className="brand-grid-swiper [&_.swiper-pagination]:!bottom-0 [&_.swiper-pagination-bullet]:!bg-black [&_.swiper-pagination-bullet-active]:!bg-black"
          >
            {pages.map((page, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-3 gap-[2px] pb-8">
                  {page.map((brand) => (
                    <div key={brand.id} className="h-[100px] md:h-[120px] flex items-center justify-center px-8 md:px-16 lg:px-20">
                      <img
                        src={brand.logoUrl!}
                        alt={brand.name}
                        className="w-full h-full object-contain max-h-[48px] md:max-h-[52px]"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useBrands } from '../../hooks/useBrands';

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
      <div className="p-[2px] relative w-full">
        <div className="pb-4">
          <h2 className="text-[28px] font-normal leading-none mb-4">
            {title}
          </h2>

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

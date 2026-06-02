import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HeroSectionDecor } from '../decorative';
import { cloudinaryUrl } from '../../utils/imageUtils';

interface HeroSlide {
  imageSrc?: string;
  imageSrcMobile?: string; // image portrait pour mobile (<768px)
  videoSrc?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSectionImageProps {
  // Mode simple (rétrocompatible)
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageSrc?: string;
  videoSrc?: string;
  objectFit?: 'cover' | 'contain';
  // Props legacy (ignorées, rétrocompatibilité Catalog)
  aspectRatioMobile?: string;
  aspectRatioDesktop?: string;
  maxHeightClass?: string;
  heightClass?: string;
  // Mode slideshow
  slides?: HeroSlide[];
  autoplayInterval?: number; // ms, défaut 5000
}

export const HeroSectionImage = ({
  title = '',
  subtitle = '',
  buttonText = '',
  buttonLink = '/',
  imageSrc = '/placeholder-hero.jpg',
  videoSrc,
  slides,
  autoplayInterval = 5000,
}: HeroSectionImageProps) => {
  // Normalise en tableau de slides
  const allSlides: HeroSlide[] = slides ?? [{
    imageSrc,
    videoSrc,
    title,
    subtitle,
    buttonText,
    buttonLink,
  }];

  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 500);
  }, []);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // mobile only : imageSrcMobile présent, imageSrc absent
  // desktop only : imageSrc présent, imageSrcMobile absent
  // both : les deux présents
  const visibleSlides = allSlides.filter(s =>
    isMobile ? !!s.imageSrcMobile : !!s.imageSrc
  );

  const safeIndex = current % (visibleSlides.length || 1);
  const slide = visibleSlides[safeIndex] ?? allSlides[0];
  const rawSrc = (isMobile && slide.imageSrcMobile) ? slide.imageSrcMobile : slide.imageSrc;
  const activeSrc = rawSrc ? cloudinaryUrl(rawSrc, isMobile ? 828 : 1920) : rawSrc;

  const nextSlide = useCallback(() => {
    if (visibleSlides.length <= 1) return;
    goTo((safeIndex + 1) % visibleSlides.length);
  }, [visibleSlides.length, safeIndex, goTo]);

  useEffect(() => {
    if (visibleSlides.length <= 1) return;
    const timer = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, visibleSlides.length, autoplayInterval]);

  return (
    <section className={`relative w-full overflow-hidden ${isMobile && slide.imageSrcMobile ? 'aspect-[3/5]' : 'h-[35vh] md:h-[45vh]'}`}>
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: fading ? 0 : 1 }}
      >
        {slide.videoSrc ? (
          <video
            key={slide.videoSrc}
            src={slide.videoSrc}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            key={activeSrc}
            src={activeSrc}
            alt={slide.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      <HeroSectionDecor />

      {/* Content — copie exacte ACW* : positionné à ~55% du haut */}
      <div
        className="absolute left-0 bottom-[6%] z-[3] md:bottom-[8%] px-[16px] md:px-[20px] transition-opacity duration-400"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <h1 className="text-[32px] md:text-[44px] lg:text-[54px] font-light text-white uppercase tracking-normal leading-none mb-[16px] md:mb-[24px]">
          {slide.title}
        </h1>
        <Link
          to={slide.buttonLink}
          className="inline-block bg-black text-white text-[16px] md:text-[20px] font-normal px-[16px] py-[6px] rounded-[6px] hover:opacity-80 transition-opacity cursor-pointer"
        >
          {slide.buttonText}
        </Link>
      </div>

      {/* Dots — seulement si plusieurs slides */}
      {visibleSlides.length > 1 && (
        <div className="absolute bottom-8 right-8 z-[10] md:bottom-10 md:right-14 flex gap-2 items-center">
          {visibleSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? 'w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  );
};

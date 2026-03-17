import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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

  // Démarre sur un slide aléatoire
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * allSlides.length));
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
  const activeSrc = (isMobile && slide.imageSrcMobile) ? slide.imageSrcMobile : slide.imageSrc;

  const nextRandom = useCallback(() => {
    if (visibleSlides.length <= 1) return;
    let next;
    do { next = Math.floor(Math.random() * visibleSlides.length); }
    while (next === safeIndex);
    goTo(next);
  }, [visibleSlides.length, safeIndex, goTo]);

  useEffect(() => {
    if (visibleSlides.length <= 1) return;
    const timer = setInterval(nextRandom, autoplayInterval);
    return () => clearInterval(timer);
  }, [nextRandom, visibleSlides.length, autoplayInterval]);

  return (
    <section className="relative w-full h-[92vh] overflow-hidden">

      {/* Media */}
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
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

      {/* Content — ancré en bas à gauche */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-8 pb-12 md:px-14 md:pb-16 transition-opacity duration-400"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase text-white/60 mb-4 font-light">
          {slide.subtitle}
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white uppercase tracking-tight leading-none mb-8 max-w-2xl">
          {slide.title}
        </h1>
        <Link
          to={slide.buttonLink}
          className="self-start bg-white text-black text-xs tracking-[0.2em] uppercase font-medium px-8 py-3.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          {slide.buttonText}
        </Link>
      </div>

      {/* Dots — seulement si plusieurs slides */}
      {visibleSlides.length > 1 && (
        <div className="absolute bottom-8 right-8 md:bottom-10 md:right-14 flex gap-2 items-center">
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

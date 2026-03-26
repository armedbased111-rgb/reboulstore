import { useMemo, useEffect, useState } from 'react';
import { HeroSectionImage } from '../components/home/HeroSectionImage';


interface HeroSlide {
  id: string;
  imageSrc: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fallback_1',
    imageSrc: 'https://res.cloudinary.com/dxen69pdo/image/upload/v1773351718/homepage/homepage/hero.png',
    title: 'SS26 Pre Release',
    subtitle: 'Stone Island SS26',
    buttonText: 'Shop now',
    buttonLink: '/catalog',
  },
  {
    id: 'fallback_2',
    imageSrc: 'https://res.cloudinary.com/dxen69pdo/image/upload/v1773352040/homepage/homepage/hero_2.png',
    title: 'SS26 Pre Release',
    subtitle: 'Stone Island SS26',
    buttonText: 'Shop now',
    buttonLink: '/catalog',
  },
];
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CategorySection } from '../components/home/CategorySection';
import { BrandCarousel } from '../components/home/BrandCarousel';
import { useProducts } from '../hooks/useProducts';
import { animateRevealUp, animateStaggerFadeIn } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Home - Page d'accueil
 */
export const Home = () => {
  const query = useMemo(() => ({ limit: 10 }), []);
  const { products, loading } = useProducts(query);
  const queryBestSellers = useMemo(() => ({ brand: 'stone-island', limit: 10 }), []);
  const { products: bestSellers } = useProducts(queryBestSellers);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);

  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setHeroSlides(data); })
      .catch(() => {}); // garde le fallback si image-ui off
  }, []);

  const createRevealUp = (duration: number = 1.4, distance: number = 40) =>
    useScrollAnimation((element) => {
      animateRevealUp(element, { duration, distance });
    }, { threshold: 0.2, rootMargin: '100px' });

  const createStaggerFade = (checkLoading: boolean = false) =>
    useScrollAnimation((element) => {
      if (checkLoading && (loading || products.length === 0)) return;
      const cards = element.querySelectorAll('.product-card');
      if (cards.length > 0) {
        animateStaggerFadeIn(cards, {
          duration: 1.2,
          stagger: 0.15,
          distance: 30
        });
      }
    }, { threshold: 0.1, rootMargin: '150px' });

  const heroImageRef = createRevealUp(1.5, 50);
  const categorySectionRef = createRevealUp();
  const brandCarouselRef = createRevealUp();
  const featuredProductsRef1 = createStaggerFade(true);
  const featuredProductsRef4 = createStaggerFade();

  return (
    <div className='px-[4px]'>
      {/* Hero Section avec slideshow */}
      <div ref={heroImageRef}>
        <HeroSectionImage
          slides={heroSlides}
          autoplayInterval={6000}
        />

      </div>

      {/* Featured Products Carousel */}
      {!loading && products.length > 0 && (
        <div ref={featuredProductsRef1} className="mt-[32px]">
          <FeaturedProducts
            title="NOUVEAUTÉS"
            viewAllLink="/catalog"
            products={products}
          />
        </div>
      )}

      {/* Category Section - Shop by category */}
      <div ref={categorySectionRef}>
        <CategorySection />
      </div>

      {/* Featured Products - avant les marques */}
      {bestSellers.length > 0 && (
        <div ref={featuredProductsRef4}>
          <FeaturedProducts
            title="BEST SELLERS — STONE ISLAND"
            products={bestSellers}
            viewAllLink="/catalog?brand=stone-island"
          />
        </div>
      )}

      {/* Brand Carousel - Nos Marques */}
      <div ref={brandCarouselRef}>
        <BrandCarousel title="Nos Marques" />
      </div>

    </div>
  );
};

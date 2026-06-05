import { useMemo, useEffect, useState } from 'react';
import { HeroSectionImage } from '../components/home/HeroSectionImage';


interface HeroSlide {
  id: string;
  imageSrc: string;
  imageSrcMobile?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'slide_1780012531',
    imageSrc: 'https://res.cloudinary.com/dxen69pdo/image/upload/v1780661871/homepage/hero/slide_1780012531.png',
    imageSrcMobile: 'https://res.cloudinary.com/dxen69pdo/image/upload/v1780663627/homepage/hero/slide_1780012531_mobile.png',
    title: 'MM6 × Salomon',
    subtitle: 'Collaboration SS26',
    buttonText: 'Découvrir',
    buttonLink: '/catalog/salomon',
  },
];
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CategorySection } from '../components/home/CategorySection';
import { BrandCarousel } from '../components/home/BrandCarousel';
import { useProducts } from '../hooks/useProducts';
import { animateRevealUp, animateStaggerFadeIn } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';
import { SeoHead } from '../components/seo/SeoHead';

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

  const heroImageRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.5, distance: 50 });
  }, { threshold: 0.2, rootMargin: '100px' });

  const categorySectionRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.4, distance: 40 });
  }, { threshold: 0.2, rootMargin: '100px' });

  const brandCarouselRef = useScrollAnimation((element) => {
    animateRevealUp(element, { duration: 1.4, distance: 40 });
  }, { threshold: 0.2, rootMargin: '100px' });

  const featuredProductsRef1 = useScrollAnimation((element) => {
    if (loading || products.length === 0) return;
    const cards = element.querySelectorAll('.product-card');
    if (cards.length > 0) {
      animateStaggerFadeIn(cards, {
        duration: 1.2,
        stagger: 0.15,
        distance: 30
      });
    }
  }, { threshold: 0.1, rootMargin: '150px' });

  const featuredProductsRef4 = useScrollAnimation((element) => {
    const cards = element.querySelectorAll('.product-card');
    if (cards.length > 0) {
      animateStaggerFadeIn(cards, {
        duration: 1.2,
        stagger: 0.15,
        distance: 30
      });
    }
  }, { threshold: 0.1, rootMargin: '150px' });

  return (
    <div className='px-[4px]'>
      <SeoHead
        title="Reboul Store | Concept Store Premium Streetwear"
        description="Decouvrez la selection premium Reboul Store: streetwear, pieces exclusives et collections pointues."
        path="/"
      />
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
            heroBg="https://res.cloudinary.com/dxen69pdo/image/upload/f_auto,q_auto,w_1920/homepage/hero/slide_1780365503.jpg"
            heroBgMobile="https://res.cloudinary.com/dxen69pdo/image/upload/f_auto,q_auto,w_828/homepage/hero/slide_1780365503_mobile.jpg"
            brandTag="SS26 Collection"
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

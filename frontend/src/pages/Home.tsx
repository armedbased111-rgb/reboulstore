import { useMemo } from 'react';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CategorySection } from '../components/home/CategorySection';
import { BrandCarousel } from '../components/home/BrandCarousel';
import { useProducts } from '../hooks/useProducts';
import { HeroSectionVideo } from '@/components/home/HeroSectionVideo';
import { PromoCard } from '@/components/home/PromoCard';
import { animateRevealUp, animateStaggerFadeIn } from '../animations';
import { useScrollAnimation } from '../animations/utils/useScrollAnimation';

/**
 * Page Home - Page d'accueil
 * Structure basique pour l'instant, les paramètres de layout seront ajustés depuis A-COLD-WALL*
 */
export const Home = () => {
  // Mémoriser l'objet query pour éviter les re-renders infinis
  const query = useMemo(() => ({ limit: 10 }), []);
  
  // Récupérer les produits pour le carousel (limite à 10 pour l'instant)
  const { products, loading } = useProducts(query);

  // Animations déclenchées au scroll pour chaque section (plus lentes)
  const heroImageRef = useScrollAnimation((element) => {
    animateRevealUp(element, {
      duration: 1.5,
      distance: 50
    });
  }, { threshold: 0.2, rootMargin: '100px' });

  const featuredProductsRef1 = useScrollAnimation((element) => {
    if (!loading && products.length > 0) {
      const cards = element.querySelectorAll('.product-card');
      if (cards.length > 0) {
        animateStaggerFadeIn(cards, {
          duration: 1.2,
          stagger: 0.15,
          distance: 30
        });
      }
    }
  }, { threshold: 0.1, rootMargin: '150px' });

  const categorySectionRef = useScrollAnimation((element) => {
    animateRevealUp(element, {
      duration: 1.4,
      distance: 40
    });
  }, { threshold: 0.2, rootMargin: '100px' });

  const brandCarouselRef = useScrollAnimation((element) => {
    animateRevealUp(element, {
      duration: 1.4,
      distance: 40
    });
  }, { threshold: 0.2, rootMargin: '100px' });

  const heroVideoRef = useScrollAnimation((element) => {
    animateRevealUp(element, {
      duration: 1.5,
      distance: 50
    });
  }, { threshold: 0.2, rootMargin: '100px' });

  const featuredProductsRef2 = useScrollAnimation((element) => {
    const cards = element.querySelectorAll('.product-card');
    if (cards.length > 0) {
      animateStaggerFadeIn(cards, {
        duration: 1.2,
        stagger: 0.15,
        distance: 30
      });
    }
  }, { threshold: 0.1, rootMargin: '150px' });

  const promoCardRef = useScrollAnimation((element) => {
    animateRevealUp(element, {
      duration: 1.4,
      distance: 40
    });
  }, { threshold: 0.2, rootMargin: '100px' });

  const featuredProductsRef3 = useScrollAnimation((element) => {
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
      {/* Hero Section avec image */}
      <div ref={heroImageRef}>
        <HeroSectionImage
          title="Winter Sale"
          subtitle="Up To 50% Off"
          buttonText="Shop now"
          buttonLink="/catalog"
          imageSrc="https://res.cloudinary.com/dxen69pdo/image/upload/v1768255803/homepage/homepage/background.jpg"
        />
      </div>

      {/* Featured Products Carousel */}
      {!loading && products.length > 0 && (
        <div ref={featuredProductsRef1}>
          <FeaturedProducts
            title="Winter Sale"
            products={products}
          />
        </div>
      )}

      {/* Category Section - Shop by category */}
      <div ref={categorySectionRef}>
        <CategorySection />
      </div>

      {/* Brand Carousel - Nos Marques */}
      <div ref={brandCarouselRef}>
        <BrandCarousel title="Nos Marques" />
      </div>

      
      {/* Hero Section with video */}
      <div ref={heroVideoRef}>
        <HeroSectionVideo
          title="Winter Sale"
          subtitle="Up To 50% Off"
          buttonText="Shop now"
          buttonLink="/catalog"
          videoSrc="https://res.cloudinary.com/dxen69pdo/video/upload/v1768255804/homepage/homepage/acw-video.mp4"
        />
      </div>
      {/* Featured Products pour une catégorie spécifique */}
      <div ref={featuredProductsRef2}>
        <FeaturedProducts
          title="COLLECTION ENFANTS"
          categorySlug="kids"
          limit={10}
        />
      </div>
      <div ref={promoCardRef}>
        <PromoCard
      gridImage1='https://res.cloudinary.com/dxen69pdo/image/upload/v1768255806/homepage/homepage/addon.jpg'
      gridImage1Alt='VISAG3'
      gridImage1Link='/page1'
      gridImage1Description='VISAG3'
      gridImage2='https://res.cloudinary.com/dxen69pdo/image/upload/v1768255807/homepage/homepage/addon2.jpg'
      gridImage2Alt='VISAG3'
      gridImage2Link='/page2'
      gridImage2Description='VISAG3'
  imageUrl="https://res.cloudinary.com/dxen69pdo/image/upload/v1768255808/homepage/homepage/promoimage.jpg"
  imageAlt="Material Study"
  overlayTopText="A-COLD-WALL* MATERIAL STUDY"
  overlayTitle="Alaska Alaska"
  overlayNumber="003"
  title="Material Study 03: Alaska Alaska"
  description={[
    "Episode 03, curated by Tawanda Chiweshe and Francisco Gaspar of Alaska Alaska, whose practice is rooted in what they call \"contemporary landscapes\".",
    "Their work reflects a convergence of diverse worldviews, resulting in outcomes that are both deeply considered and open-ended. Objects, spaces, and ideas become vessels for conversation across disciplines."
  ]}
        />
      </div>
      <div ref={featuredProductsRef3}>
        <FeaturedProducts
          title="OUTERWEAR WINTER SALE"
          categorySlug="vestes"
          limit={10}
        />
      </div>
    </div>
  );
};

import { useMemo } from 'react';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CategorySection } from '../components/home/CategorySection';
import { useProducts } from '../hooks/useProducts';
import { HeroSectionVideo } from '@/components/home/HeroSectionVideo';
import { PromoCard } from '@/components/home/PromoCard';

/**
 * Page Home - Page d'accueil
 * Structure basique pour l'instant, les paramètres de layout seront ajustés depuis A-COLD-WALL*
 */
export const Home = () => {
  // Mémoriser l'objet query pour éviter les re-renders infinis
  const query = useMemo(() => ({ limit: 10 }), []);
  
  // Récupérer les produits pour le carousel (limite à 10 pour l'instant)
  const { products, loading } = useProducts(query);

  return (
    <div className='px-[4px]'>
      {/* Hero Section avec image */}
      <HeroSectionImage
        title="Winter Sale"
        subtitle="Up To 50% Off"
        buttonText="Shop now"
        buttonLink="/catalog"
        imageSrc="/public/webdesign/background.png" // Tu remplaceras par ton image
      />

      {/* Featured Products Carousel */}
      {!loading && products.length > 0 && (
        <FeaturedProducts
          title="Winter Sale"
          products={products}
        />
      )}

      {/* Category Section - Shop by category */}
      <CategorySection />

      
      {/* Hero Section with video */}
      <HeroSectionVideo
        title="Winter Sale"
        subtitle="Up To 50% Off"
        buttonText="Shop now"
        buttonLink="/catalog"
        videoSrc="/public/webdesign/acw-video.mp4"
      />
      {/* Featured Products pour une catégorie spécifique */}
      <FeaturedProducts
      title="COLLECTION ENFANTS"
      categorySlug="kids"
      limit={10}
      />
      <PromoCard
      gridImage1='/webdesign/addon.jpeg'
      gridImage1Alt='VISAG3'
      gridImage1Link='/page1'
      gridImage1Description='VISAG3'
      gridImage2='/webdesign/addon2.jpeg'
      gridImage2Alt='VISAG3'
      gridImage2Link='/page2'
      gridImage2Description='VISAG3'
  imageUrl="/webdesign/promoimage.jpeg"
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
<FeaturedProducts
  title="OUTERWEAR WINTER SALE"
  categorySlug="vestes"
  limit={10}
/>
    </div>
  );
};

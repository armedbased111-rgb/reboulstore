import { useMemo } from 'react';
import { HeroSectionImage } from '../components/home/HeroSectionImage';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { useProducts } from '../hooks/useProducts';

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
    </div>
  );
};

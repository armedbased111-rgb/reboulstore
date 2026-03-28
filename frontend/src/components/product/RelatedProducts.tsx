import { useEffect, useState } from 'react';
import { PRODUCT_PAGE_DECOR } from '../../copy/productPageDecor';
import { ProductCard } from './ProductCard';
import { getProducts } from '../../services/products';
import type { Product } from '../../types';

interface RelatedProductsProps {
  categoryId?: number;
  currentProductId: number;
  limit?: number;
}

/**
 * Composant RelatedProducts - Produits similaires style A-COLD-WALL*
 * 
 * Structure exacte A-COLD-WALL* :
 * - Section avec m-[2px], p-[2px], bg-grey
 * - Titre h2 avec text-h2
 * - Grille responsive (2 cols mobile, auto-fit desktop)
 * - Liste de ProductCard avec même structure que Catalog
 */
export const RelatedProducts = ({
  categoryId,
  currentProductId,
  limit = 4,
}: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          category: String(categoryId),
          limit,
        });

        // Filtrer le produit actuel
        const filtered = response.products.filter(
          (p) => p.id !== currentProductId
        );

        setProducts(filtered.slice(0, limit));
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    } else {
      setLoading(false);
    }
  }, [categoryId, currentProductId, limit]);

  // Ne rien afficher si chargement ou pas de produits
  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="m-[2px] last:mb-0">
      <div className="relative w-full bg-grey p-[2px] pt-2 light:bg-inherit">
        <div className="mb-4">
          <h2 className="text-h2">Related Products</h2>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-black/25 sm:text-[9px]">
            {PRODUCT_PAGE_DECOR.relatedHudLine}
          </p>
        </div>
        <ul className="mb-4 grid grid-cols-2 gap-[2px] sm:[grid-template-columns:repeat(auto-fit,minmax(0,222px))] md:[grid-template-columns:repeat(auto-fit,minmax(0,254px))]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
};

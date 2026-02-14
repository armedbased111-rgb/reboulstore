import type { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface ProductGridProps {
  products: Product[];
}

/**
 * Composant ProductGrid - Grille de produits style A-COLD-WALL*
 * 
 * Structure exacte copiée depuis A-COLD-WALL* :
 * - Grille CSS avec gap de 2px
 * - Responsive : 2 colonnes mobile, auto-fit avec minmax desktop
 * - Liste <ul> avec <li> pour chaque produit
 */
export const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="p-[2px] bg-[#F3F3F3] relative w-full">
        <p className="text-center py-8 uppercase">Aucun produit disponible</p>
      </div>
    );
  }

  return (
    <ul
      className="
        grid
        gap-[2px]
        grid-cols-2
        sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
        md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
        lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]
        mb-4
        w-full
      "
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
};

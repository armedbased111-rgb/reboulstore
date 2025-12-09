import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { AddToCartButton } from '../components/product/AddToCartButton';
import { ProductTabs } from '../components/product/ProductTabs';
import { ProductInfo } from '../components/product/ProductInfo';
import { RelatedProducts } from '../components/product/RelatedProducts';
import type { Variant } from '../types';

/**
 * Page Product - Fiche produit style A-COLD-WALL*
 * 
 * Structure 2 colonnes :
 * - Gauche (40%) : Galerie d'images
 * - Droite (60%) : Infos produit (sticky)
 */
export const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Gérer loading
  if (loading) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase">Loading...</div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Gérer error
  if (error) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase text-red-500">
                Error: {error}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Gérer produit introuvable
  if (!product) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase">Product not found</div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Logique d'héritage pour le size chart
  const getSizeChart = () => {
    // 1. Priorité au size chart custom du produit
    if (product.customSizeChart && product.customSizeChart.length > 0) {
      return product.customSizeChart;
    }
    // 2. Sinon, utiliser celui de la catégorie
    if (product.category?.sizeChart && product.category.sizeChart.length > 0) {
      return product.category.sizeChart;
    }
    // 3. Sinon, aucun size chart
    return null;
  };

  const sizeChart = getSizeChart();

  // Préparer les onglets avec les vraies données
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div>
          <p className="mb-2">{product.description || 'No details available.'}</p>
          {(product.materials || product.madeIn || product.careInstructions) && (
            <div className="mt-4 space-y-1">
              {product.materials && (
                <p className="text-sm">
                  <strong>Materials:</strong> {product.materials}
                </p>
              )}
              {product.madeIn && (
                <p className="text-sm">
                  <strong>Made in:</strong> {product.madeIn}
                </p>
              )}
              {product.careInstructions && (
                <p className="text-sm">
                  <strong>Care:</strong> {product.careInstructions}
                </p>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'sizing',
      label: 'Sizing',
      content: sizeChart ? (
        <div>
          <p className="mb-4">Size chart:</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Size</th>
                {sizeChart.some((s) => s.chest) && <th className="py-2">Chest (cm)</th>}
                {sizeChart.some((s) => s.length) && <th className="py-2">Length (cm)</th>}
                {sizeChart.some((s) => s.waist) && <th className="py-2">Waist (cm)</th>}
                {sizeChart.some((s) => s.hip) && <th className="py-2">Hip (cm)</th>}
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((entry) => (
                <tr key={entry.size} className="border-b">
                  <td className="py-2">{entry.size}</td>
                  {sizeChart.some((s) => s.chest) && <td className="py-2">{entry.chest || '-'}</td>}
                  {sizeChart.some((s) => s.length) && <td className="py-2">{entry.length || '-'}</td>}
                  {sizeChart.some((s) => s.waist) && <td className="py-2">{entry.waist || '-'}</td>}
                  {sizeChart.some((s) => s.hip) && <td className="py-2">{entry.hip || '-'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Size chart coming soon.</p>
      ),
    },
    {
      id: 'shipping',
      label: 'Shipping',
      content: product.shop?.shippingPolicy ? (
        <div>
          {product.shop.shippingPolicy.description ? (
            <p className="mb-2">{product.shop.shippingPolicy.description}</p>
          ) : (
            <>
              {product.shop.shippingPolicy.freeShippingThreshold && (
                <p className="mb-2">
                  <strong>Free shipping</strong> on orders over €
                  {product.shop.shippingPolicy.freeShippingThreshold}
                </p>
              )}
              {product.shop.shippingPolicy.deliveryTime && (
                <p className="mb-2">
                  <strong>Delivery time:</strong> {product.shop.shippingPolicy.deliveryTime}
                </p>
              )}
              {product.shop.shippingPolicy.internationalShipping && (
                <p className="mb-2">International shipping available</p>
              )}
              {product.shop.shippingPolicy.shippingCost && (
                <p className="mb-2">
                  <strong>Shipping cost:</strong> {product.shop.shippingPolicy.shippingCost}
                </p>
              )}
            </>
          )}
          <p className="mt-4 text-sm">Shipping costs are calculated at checkout.</p>
        </div>
      ) : (
        <p>Shipping information coming soon.</p>
      ),
    },
    {
      id: 'returns',
      label: 'Returns',
      content: product.shop?.returnPolicy ? (
        <div>
          {product.shop.returnPolicy.conditions ? (
            <p className="mb-2">{product.shop.returnPolicy.conditions}</p>
          ) : (
            <>
              {product.shop.returnPolicy.returnWindow && (
                <p className="mb-2">
                  We accept returns within <strong>{product.shop.returnPolicy.returnWindow} days</strong> of purchase.
                </p>
              )}
              {product.shop.returnPolicy.returnShippingFree && (
                <p className="mb-2">Return shipping is free for all orders.</p>
              )}
              <p className="mb-2">
                Items must be unworn, unwashed, and with all original tags attached.
              </p>
            </>
          )}
          <p className="mt-4 text-sm">Please contact our customer service to initiate a return.</p>
        </div>
      ) : (
        <p>Returns policy coming soon.</p>
      ),
    },
  ];

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        <section className="m-[2px] last:mb-0">
          <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
            {/* Layout 2 colonnes */}
            <div className="lg:flex">
              {/* Colonne gauche : Galerie (40%) */}
              <div className="lg:min-w-[40%] lg:basis-[40%] lg:mr-8">
                {product.images && product.images.length > 0 ? (
                  <ProductGallery
                    images={product.images}
                    productName={product.name}
                  />
                ) : (
                  <div className="bg-gray-200 aspect-[3/4] flex items-center justify-center">
                    <span className="text-gray-400 uppercase">No images</span>
                  </div>
                )}
              </div>

              {/* Colonne droite : Infos produit (60%, sticky) */}
              <div className="basis-[60%]">
                <div className="lg:sticky pt-2" style={{ top: '78px' }}>
                  {/* Titre + Prix */}
                  <ProductInfo product={product} />

                  {/* Formulaire variantes + Add to cart */}
                  <div className="mt-8">
                    <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
                      {/* Sélecteur de variante */}
                      {product.variants && product.variants.length > 0 && (
                        <VariantSelector
                          variants={product.variants}
                          selectedVariant={selectedVariant}
                          onVariantChange={setSelectedVariant}
                        />
                      )}

                      {/* Bouton Add to cart */}
                      <AddToCartButton variant={selectedVariant} />
                    </div>
                  </div>

                  {/* Onglets */}
                  <ProductTabs tabs={tabs} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Related Products */}
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
          limit={4}
        />
      </div>
    </main>
  );
};
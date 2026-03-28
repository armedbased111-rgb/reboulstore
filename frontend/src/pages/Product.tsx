import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { AddToCartButton } from '../components/product/AddToCartButton';
import { ProductTabs } from '../components/product/ProductTabs';
import { ProductInfo } from '../components/product/ProductInfo';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { StockBadge } from '../components/product/StockBadge';
import { StockNotificationModal } from '../components/product/StockNotificationModal';
import { useToast } from '../contexts/ToastContext';
import type { Variant } from '../types';
import * as anime from 'animejs';
import { toMilliseconds, ANIMATION_EASES } from '../animations/utils/constants';
import { SeoHead } from '../components/seo/SeoHead';
import { PRODUCT_PAGE_DECOR } from '../copy/productPageDecor';
import { TechnicalDecorFrame } from '../components/decorative';

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
  const { showToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // Refs pour les animations
  const pageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Animations orchestrées quand le produit est chargé
  useEffect(() => {
    if (product && pageRef.current) {
      const tl = anime.createTimeline();

      // 1. Fade-in de la page
      tl.add(pageRef.current, {
        opacity: [0, 1],
        duration: toMilliseconds(0.3),
        easing: ANIMATION_EASES.DEFAULT,
      });

      // 2. Slide-up galerie (commence 0.3s avant la fin de l'animation précédente)
      if (galleryRef.current) {
        tl.add(galleryRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: toMilliseconds(0.6),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=300');
      }

      // 3b. Slide-up infos produit en parallèle avec la galerie
      if (productInfoRef.current) {
        tl.add(productInfoRef.current, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: toMilliseconds(0.6),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=600'); // En parallèle avec la galerie
      }

      // 4. Slide-up actions (commence 0.4s avant la fin de l'animation précédente)
      if (actionsRef.current) {
        tl.add(actionsRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: toMilliseconds(0.5),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=400');
      }

      // 5. Fade-in onglets (commence 0.3s avant la fin de l'animation précédente)
      if (tabsRef.current) {
        tl.add(tabsRef.current, {
          opacity: [0, 1],
          duration: toMilliseconds(0.4),
          easing: ANIMATION_EASES.DEFAULT,
        }, '-=300');
      }
    }
  }, [product]);

  // Gérer loading
  if (loading) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <SeoHead
          title="Produit | Reboul Store"
          description="Fiche produit Reboul Store."
          path={id ? `/product/${id}` : '/product'}
        />
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase">CHARGEMENT...</div>
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
        <SeoHead
          title="Produit indisponible | Reboul Store"
          description="Le produit demande est temporairement indisponible."
          path={id ? `/product/${id}` : '/product'}
          noindex
        />
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase text-red-500">
                ERREUR : {error}
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
        <SeoHead
          title="Produit introuvable | Reboul Store"
          description="Le produit demande est introuvable."
          path={id ? `/product/${id}` : '/product'}
          noindex
        />
        <div className="w-full">
          <section className="m-[2px] last:mb-0">
            <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
              <div className="py-8 text-center uppercase">PRODUIT INTROUVABLE</div>
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
      id: 'sizing',
      label: 'Tailles',
      content: sizeChart ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black">
                <td className="pb-2 pr-8 text-[12px] font-medium text-black">Taille</td>
                {sizeChart.some((s) => s.chest) && <td className="pb-2 pr-8 text-[12px] font-medium text-black">Poitrine (cm)</td>}
                {sizeChart.some((s) => s.length) && <td className="pb-2 pr-8 text-[12px] font-medium text-black">Longueur (cm)</td>}
                {sizeChart.some((s) => s.waist) && <td className="pb-2 pr-8 text-[12px] font-medium text-black">Taille (cm)</td>}
                {sizeChart.some((s) => s.hip) && <td className="pb-2 pr-8 text-[12px] font-medium text-black">Hanches (cm)</td>}
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((entry) => (
                <tr key={entry.size} className="border-b border-black/10">
                  <td className="py-2 pr-8 text-[12px] font-medium text-black">{entry.size}</td>
                  {sizeChart.some((s) => s.chest) && <td className="py-2 pr-8 text-[12px] text-black/70">{entry.chest ?? '—'}</td>}
                  {sizeChart.some((s) => s.length) && <td className="py-2 pr-8 text-[12px] text-black/70">{entry.length ?? '—'}</td>}
                  {sizeChart.some((s) => s.waist) && <td className="py-2 pr-8 text-[12px] text-black/70">{entry.waist ?? '—'}</td>}
                  {sizeChart.some((s) => s.hip) && <td className="py-2 pr-8 text-[12px] text-black/70">{entry.hip ?? '—'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[12px] text-black/60">Guide des tailles bientôt disponible.</p>
      ),
    },
    {
      id: 'shipping',
      label: 'Livraison',
      content: product.shop?.shippingPolicy ? (
        <div>
          {product.shop.shippingPolicy.description ? (
            <p className="mb-2 uppercase">{String(product.shop.shippingPolicy.description).toUpperCase()}</p>
          ) : (
            <>
              {product.shop.shippingPolicy.freeShippingThreshold && (
                <p className="mb-2 uppercase">
                  <strong>LIVRAISON GRATUITE</strong> POUR LES COMMANDES DE PLUS DE €{product.shop.shippingPolicy.freeShippingThreshold}
                </p>
              )}
              {product.shop.shippingPolicy.deliveryTime && (
                <p className="mb-2 uppercase">
                  <strong>DÉLAI DE LIVRAISON :</strong> {String(product.shop.shippingPolicy.deliveryTime).toUpperCase()}
                </p>
              )}
              {product.shop.shippingPolicy.internationalShipping && (
                <p className="mb-2 uppercase">LIVRAISON INTERNATIONALE DISPONIBLE</p>
              )}
              {product.shop.shippingPolicy.shippingCost && (
                <p className="mb-2 uppercase">
                  <strong>FRAIS DE LIVRAISON :</strong> {String(product.shop.shippingPolicy.shippingCost).toUpperCase()}
                </p>
              )}
            </>
          )}
          <p className="mt-4 text-sm uppercase">LES FRAIS DE LIVRAISON SONT CALCULÉS LORS DU CHECKOUT.</p>
        </div>
      ) : (
        <p className="uppercase">INFORMATIONS DE LIVRAISON BIENTÔT DISPONIBLES.</p>
      ),
    },
    {
      id: 'returns',
      label: 'Retours',
      content: product.shop?.returnPolicy ? (
        <div>
          {product.shop.returnPolicy.conditions ? (
            <p className="mb-2 uppercase">{String(product.shop.returnPolicy.conditions).toUpperCase()}</p>
          ) : (
            <>
              {product.shop.returnPolicy.returnWindow && (
                <p className="mb-2 uppercase">
                  NOUS ACCEPTONS LES RETOURS DANS LES <strong>{product.shop.returnPolicy.returnWindow} JOURS</strong> SUIVANT L'ACHAT.
                </p>
              )}
              {product.shop.returnPolicy.returnShippingFree && (
                <p className="mb-2 uppercase">LES FRAIS DE RETOUR SONT GRATUITS POUR TOUTES LES COMMANDES.</p>
              )}
              <p className="mb-2 uppercase">
                LES ARTICLES DOIVENT ÊTRE NON PORTÉS, NON LAVÉS ET AVEC TOUTES LES ÉTIQUETTES ORIGINALES ATTACHÉES.
              </p>
            </>
          )}
          <p className="mt-4 text-sm uppercase">VEUILLEZ CONTACTER NOTRE SERVICE CLIENT POUR INITIER UN RETOUR.</p>
        </div>
      ) : (
        <p className="uppercase">POLITIQUE DE RETOUR BIENTÔT DISPONIBLE.</p>
      ),
    },
  ];

  return (
    <main ref={pageRef} id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <SeoHead
        title={`${product.name} | Reboul Store`}
        description={product.description?.slice(0, 155) || `${product.name} disponible sur Reboul Store.`}
        path={`/product/${product.id}`}
        type="product"
        image={product.images?.[0]?.url || undefined}
      />
      <div className="w-full">
        <section className="m-[2px] last:mb-0">
          <div className="relative w-full bg-grey p-[2px] light:bg-inherit">
            <TechnicalDecorFrame
              datum={PRODUCT_PAGE_DECOR.frameDatum}
              datumClassName="bottom-2 left-2 max-w-[min(72%,14rem)] sm:bottom-2.5 sm:left-3"
              insetClassName="inset-2 sm:inset-3"
              omitCorners={['tl', 'bl', 'br']}
            />
            <div className="relative z-[3] lg:flex">
              {/* Colonne gauche : Galerie (42%) */}
              <div ref={galleryRef} className="lg:min-w-[42%] lg:basis-[42%]">
                {product.images && product.images.length > 0 ? (
                  <ProductGallery
                    images={product.images}
                    productName={product.name}
                    imageDecorBase={
                      product.variants?.[0]?.sku?.trim() || `IDX // ${product.id}`
                    }
                  />
                ) : (
                  <div className="bg-gray-100 aspect-[3/4] flex items-center justify-center">
                    <span className="text-gray-400 uppercase text-[12px]">AUCUNE IMAGE</span>
                  </div>
                )}
              </div>

              {/* Colonne droite : Infos produit (58%, sticky) */}
              <div className="lg:flex-1">
                <div className="lg:sticky pt-2 px-4 lg:pl-10 lg:pr-6" style={{ top: '78px' }}>
                  {/* Titre + Prix */}
                  <div ref={productInfoRef}>
                    <ProductInfo product={product} />
                  </div>

                  {/* Formulaire variantes + Add to cart */}
                  <div ref={actionsRef} className="mt-8">
                    {/* Container fixe pour éviter le décalage des boutons */}
                    <div className="flex flex-col gap-3">
                      {/* Ligne 1 : Sélecteur de variante + Bouton Add to cart (côte à côte, h-[34px]) */}
                      <div className="flex flex-row items-center gap-0 h-[34px]">
                        {/* Sélecteur de variante */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex items-center">
                            <VariantSelector
                              variants={product.variants}
                              selectedVariant={selectedVariant}
                              onVariantChange={(variant) => {
                                setSelectedVariant(variant);
                                setQuantity(1); // Réinitialiser la quantité quand on change de variant
                              }}
                            />
                          </div>
                        )}

                        {/* Bouton Add to cart avec compteur quantité */}
                        <div className="flex items-center flex-1">
                          <AddToCartButton variant={selectedVariant} quantity={quantity} />
                        </div>
                      </div>

                      {/* Ligne 2 : Badge stock (zone réservée fixe) */}
                      <div className="min-h-[28px] flex items-center gap-2">
                        {selectedVariant ? (
                          <>
                            <StockBadge variant={selectedVariant} />
                            {/* Bouton notification si rupture de stock */}
                            {(selectedVariant.stock || 0) === 0 && (
                              <button
                                type="button"
                                onClick={() => setIsNotificationModalOpen(true)}
                                className="font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] uppercase text-gray-600 hover:text-black underline transition-colors"
                              >
                                M'alerter quand disponible
                              </button>
                            )}
                          </>
                        ) : (
                          // Si aucun variant sélectionné mais qu'il y a des variants en rupture, proposer de s'inscrire
                          product.variants && product.variants.length > 0 && product.variants.every(v => (v.stock || 0) === 0) && (
                            <button
                              type="button"
                              onClick={() => setIsNotificationModalOpen(true)}
                              className="font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] uppercase text-gray-600 hover:text-black underline transition-colors"
                            >
                              M'alerter quand disponible
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description — après size/CTA comme sur ACW* */}
                  {product.description && (
                    <p className="mt-8 text-[20px] leading-[1.6] text-black/80">
                      {product.description}
                    </p>
                  )}

                  {/* Onglets */}
                  <div ref={tabsRef}>
                    <ProductTabs tabs={tabs} />
                  </div>
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

      {/* Modal notification rupture de stock */}
      <StockNotificationModal
        product={product}
        variantId={selectedVariant?.id}
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSubscribe={() => {
          showToast({
            message: 'Vous serez notifié quand ce produit sera disponible',
            duration: 2000,
          });
        }}
      />
    </main>
  );
};
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartContext } from '../../contexts/CartContext';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import type { Brand, Product, Category } from '../../types';
import { animateSlideDown, animateStaggerFadeIn, animateFadeOut, animateScalePulse } from '../../animations';
import * as anime from 'animejs';
import { toMilliseconds, convertEasing } from '../../animations/utils/constants';
import { getProducts } from '../../services/products';
import { getImageUrl } from '../../utils/imageUtils';
import { HeaderBarDecor, MegaMenuDecor } from '../decorative';

/** Ligne menu mobile : libellé + fil technique à droite (réagit au hover du groupe, pas de calque absolu). */
function MobileNavRow({
  trail,
  children,
}: {
  trail: string
  children: ReactNode
}) {
  return (
    <div className="group mb-[16px] flex items-center justify-between gap-3 pr-3">
      {children}
      <span
        aria-hidden
        className="pointer-events-none shrink-0 font-mono text-[7px] uppercase tracking-[0.22em] text-black/20 transition-colors duration-200 group-hover:text-black/50"
      >
        {trail}
      </span>
    </div>
  )
}

export const Header = () => {
  const { cart, loading: cartLoading } = useCartContext();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<Brand | null>(null);
  const [randomProductImage, setRandomProductImage] = useState<string | null>(null);
  const [loadingProductImage, setLoadingProductImage] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [randomProductImageCategory, setRandomProductImageCategory] = useState<string | null>(null);
  const [loadingProductImageCategory, setLoadingProductImageCategory] = useState(false);
  
  // État pour le slider des brands (afficher 10 à la fois)
  const [brandsPage, setBrandsPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const BRANDS_PER_PAGE = 10;
  const CATEGORIES_PER_PAGE = 10;

  // État pour le slider des catégories
  const [categoriesPage, setCategoriesPage] = useState(0);
  const [isCategoriesTransitioning, setIsCategoriesTransitioning] = useState(false);

  // Refs pour le slider (anciennes refs touch supprimées - swipe non utilisé)
  const brandsSliderRef = useRef<HTMLDivElement>(null);
  const brandsSliderContainerRef = useRef<HTMLDivElement>(null);
  const categoriesSliderRef = useRef<HTMLDivElement>(null);
  const categoriesSliderContainerRef = useRef<HTMLDivElement>(null);
  
  // États pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItemsCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Refs pour les animations
  const headerRef = useRef<HTMLElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const brandsMenuRef = useRef<HTMLDivElement>(null);
  const cartBadgeRef = useRef<HTMLAnchorElement>(null);
  
  // Ref pour le menu mobile
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Animation d'apparition du header au chargement
  useEffect(() => {
    if (headerRef.current) {
      anime.animate(headerRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: toMilliseconds(0.6),
        easing: convertEasing("power2.out"),
      });
    }
  }, []);

  // Animation d'ouverture/fermeture du mega menu CATALOGUE
  useEffect(() => {
    if (shopMenuRef.current) {
      if (isShopMenuOpen) {
        // Ouvrir : slide-down avec fade
        animateSlideDown(shopMenuRef.current, {
          duration: 0.4,
          distance: -30,
        });

        // Animer les catégories en stagger
        const categoryItems = shopMenuRef.current.querySelectorAll('li');
        if (categoryItems.length > 0) {
          animateStaggerFadeIn(categoryItems, {
            duration: 0.3,
            stagger: 0.05,
            distance: 10,
          });
        }

        // Animer les images
        const images = shopMenuRef.current.querySelectorAll('img');
        if (images.length > 0) {
          animateStaggerFadeIn(images, {
            duration: 0.4,
            stagger: 0.1,
            distance: 20,
          });
        }
      } else {
        // Fermer : fade out
        animateFadeOut(shopMenuRef.current, {
          duration: 0.2,
          distance: -10,
          easing: convertEasing("power2.in"),
        });
      }
    }
  }, [isShopMenuOpen]);

  // Animation d'ouverture/fermeture du mega menu BRANDS
  useEffect(() => {
    if (brandsMenuRef.current) {
      if (isBrandsMenuOpen) {
        // Ouvrir : slide-down avec fade
        animateSlideDown(brandsMenuRef.current, {
          duration: 0.4,
          distance: -30,
        });

        // Animer les marques en stagger
        const brandItems = brandsMenuRef.current.querySelectorAll('li');
        if (brandItems.length > 0) {
          animateStaggerFadeIn(brandItems, {
            duration: 0.3,
            stagger: 0.05,
            distance: 10,
          });
        }

        // Animer les images/vidéos
        const media = brandsMenuRef.current.querySelectorAll('img, video');
        if (media.length > 0) {
          animateStaggerFadeIn(media, {
            duration: 0.4,
            stagger: 0.1,
            distance: 20,
          });
        }
      } else {
        // Fermer : fade out
        animateFadeOut(brandsMenuRef.current, {
          duration: 0.2,
          distance: -10,
          easing: convertEasing("power2.in"),
        });
      }
    }
  }, [isBrandsMenuOpen]);

  // Animation du badge panier quand le nombre change
  useEffect(() => {
    if (cartBadgeRef.current && cartItemsCount > 0) {
      animateScalePulse(cartBadgeRef.current, {
        scale: 1.1,
        duration: 0.2,
        iterations: 1,
        easing: convertEasing("power2.out"),
      });
    }
  }, [cartItemsCount]);

  // Animation d'ouverture/fermeture du menu mobile (full-screen fade)
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        anime.animate(mobileMenuRef.current, {
          opacity: [0, 1],
          duration: toMilliseconds(0.3),
          easing: convertEasing('power2.out'),
        });
        document.body.style.overflow = 'hidden';
      } else {
        anime.animate(mobileMenuRef.current, {
          opacity: [1, 0],
          duration: toMilliseconds(0.2),
          easing: convertEasing('power2.in'),
        });
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);



  useEffect(() => {
    if (!hoveredBrand) {
      setRandomProductImage(null);
      setLoadingProductImage(false);
      return;
    }

    const fetchRandomProductImage = async () => {
      if (hoveredBrand.megaMenuImage1 || hoveredBrand.megaMenuVideo1) {
        setRandomProductImage(null);
        return;
      }

      try {
        setLoadingProductImage(true);
        const response = await getProducts({
          brand: hoveredBrand.slug,
          limit: 50,
        });

        // Filtrer les produits qui ont des images
        const productsWithImages = response.products.filter(
          (product: Product) => product.images && product.images.length > 0
        );

        if (productsWithImages.length > 0) {
          // Sélectionner un produit aléatoire
          const randomProduct = productsWithImages[
            Math.floor(Math.random() * productsWithImages.length)
          ];
          
          // Trier par order puis exclure les images "back"
          const sortedImages = [...randomProduct.images!]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .filter(img => !img.url.toLowerCase().includes('back'));
          const selectedImage = sortedImages[0] || randomProduct.images![0];
          
          // Construire l'URL complète de l'image avec getImageUrl
          const imageUrl = getImageUrl(selectedImage.url);
          
          if (imageUrl) {
            setRandomProductImage(imageUrl);
          } else {
            setRandomProductImage(null);
          }
        } else {
          setRandomProductImage(null);
        }
      } catch (error) {
        console.error('Error fetching random product image:', error);
        setRandomProductImage(null);
      } finally {
        setLoadingProductImage(false);
      }
    };

    fetchRandomProductImage();
  }, [hoveredBrand]);

  useEffect(() => {
    if (!hoveredCategory) {
      setRandomProductImageCategory(null);
      setLoadingProductImageCategory(false);
      return;
    }

    const fetchRandomProductImage = async () => {
      try {
        setLoadingProductImageCategory(true);
        const response = await getProducts({
          category: String(hoveredCategory.id),
          limit: 50,
        });

        const productsWithImages = response.products.filter(
          (product: Product) => product.images && product.images.length > 0
        );

        const getProductImage = (product: Product): string | null => {
          const sorted = [...product.images!]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .filter(img => !img.url.toLowerCase().includes('back'));
          const img = sorted[0] || product.images![0];
          return getImageUrl(img.url);
        };

        if (productsWithImages.length > 0) {
          const idx = Math.floor(Math.random() * productsWithImages.length);
          setRandomProductImageCategory(getProductImage(productsWithImages[idx]));
        } else {
          setRandomProductImageCategory(null);
        }
      } catch (error) {
        console.error('Error fetching random product image for category:', error);
        setRandomProductImageCategory(null);
      } finally {
        setLoadingProductImageCategory(false);
      }
    };

    fetchRandomProductImage();
  }, [hoveredCategory]);

  // Animation du slider des brands au changement de page
  useEffect(() => {
    if (brandsSliderRef.current && brands.length > 0) {
      setIsTransitioning(true);
      // Animation fade pour lisser la transition
      anime.animate(brandsSliderRef.current, {
        opacity: [0.7, 1],
        duration: toMilliseconds(0.3),
        easing: convertEasing('power2.out'),
        complete: () => {
          setIsTransitioning(false);
        },
      });
    }
  }, [brandsPage, brands.length]);

  // Animation du slider des catégories au changement de page
  useEffect(() => {
    if (categoriesSliderRef.current && categories.length > 0) {
      setIsCategoriesTransitioning(true);
      anime.animate(categoriesSliderRef.current, {
        opacity: [0.7, 1],
        duration: toMilliseconds(0.3),
        easing: convertEasing('power2.out'),
        complete: () => {
          setIsCategoriesTransitioning(false);
        },
      });
    }
  }, [categoriesPage, categories.length]);

  // Fonction pour changer de page avec animation
  const changeBrandsPage = (newPage: number, maxPage: number) => {
    if (isTransitioning) return;
    const clampedPage = Math.max(0, Math.min(maxPage - 1, newPage));
    if (clampedPage !== brandsPage) {
      setBrandsPage(clampedPage);
    }
  };

  const changeCategoriesPage = (newPage: number, maxPage: number) => {
    if (isCategoriesTransitioning) return;
    const clampedPage = Math.max(0, Math.min(maxPage - 1, newPage));
    if (clampedPage !== categoriesPage) {
      setCategoriesPage(clampedPage);
    }
  };

  // Fermeture du menu mobile avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <>
    <header ref={headerRef} className="bg-white relative z-[9999]">
      <div className="w-full relative">
        <div className="relative">
          <HeaderBarDecor />
          <div className="relative z-10 flex items-center justify-between min-h-[46px] px-[4px]">
          {/* Section gauche : Menu hamburger mobile (gauche) + Logo (centré mobile) + Navigation (desktop) */}
          <div className="flex items-center gap-[50px] flex-1 md:flex-none">
            {/* Menu mobile hamburger - À gauche avant le logo */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10"
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen
                ? <X className="w-5 h-5" strokeWidth={1.5} />
                : <Menu className="w-5 h-5" strokeWidth={1.5} />
              }
            </button>

            {/* Logo - Centré en mobile (position absolute), position normale en desktop */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center"
          >
            <span className="text-xl font-bold text-black uppercase tracking-tight">
              REBOULSTORE 2.0
            </span>
          </Link>

          {/* Navigation à gauche après le logo */}
            <nav className="hidden md:flex items-center gap-[37px]">
            {/* Menu CATALOGUE avec mega menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsShopMenuOpen(!isShopMenuOpen);
                  setIsBrandsMenuOpen(false);
                  if (!isShopMenuOpen) {
                    setCategoriesPage(0);
                    setIsCategoriesTransitioning(false);
                    setHoveredCategory(null);
                  }
                }}
                onMouseEnter={() => {
                  setIsShopMenuOpen(true);
                  setIsBrandsMenuOpen(false);
                  setCategoriesPage(0);
                  setIsCategoriesTransitioning(false);
                  setHoveredCategory(null);
                }}
                className="flex items-center gap-1 text-black uppercase text-[15px] font-medium hover:opacity-70 transition-opacity"
              >
                Catalogue
                <svg 
                  className={`w-3 h-3 transition-transform ${isShopMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Menu BRANDS avec mega menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsBrandsMenuOpen(!isBrandsMenuOpen);
                  setIsShopMenuOpen(false);
                  if (!isBrandsMenuOpen) {
                    setBrandsPage(0); // Reset à la première page quand on ouvre le menu
                    setIsTransitioning(false); // Reset l'état de transition
                    setHoveredBrand(null); // Réinitialiser hoveredBrand à l'ouverture
                  }
                }}
                onMouseEnter={() => {
                  setIsBrandsMenuOpen(true);
                  setIsShopMenuOpen(false);
                  setBrandsPage(0); // Reset à la première page quand on ouvre le menu
                  setIsTransitioning(false); // Reset l'état de transition
                  setHoveredBrand(null); // Réinitialiser hoveredBrand à l'ouverture
                }}
                className="flex items-center gap-1 text-black uppercase text-[15px] font-medium hover:opacity-70 transition-opacity"
              >
                Brands
                <svg 
                  className={`w-3 h-3 transition-transform ${isBrandsMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

          </nav>
          </div>

          {/* Utilitaires à droite — style ACW* : icônes épurées */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart */}
            <Link
              to="/cart"
              ref={cartBadgeRef}
              className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
              aria-label="Panier"
            >
              <ShoppingBag className="w-[18px] h-[18px] text-black" strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
                  {cartLoading ? '' : cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Icônes mobiles — Cart */}
          <div className="md:hidden flex items-center gap-1 relative z-[100]">
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-10 h-10"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5 text-black" strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
                  {cartLoading ? '' : cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        </div>

        {/* Mega Menu CATALOGUE - Style A-COLD-WALL* - Enfant du header pour être sticky */}
        {isShopMenuOpen && (
          <>
            {/* Overlay avec blur/shadow sur le contenu - Commence après PromoBanner + Navbar */}
            <div 
              className="fixed top-[92px] left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm z-[70]"
              onClick={() => setIsShopMenuOpen(false)}
            />
            
            {/* Menu */}
            <div 
              ref={shopMenuRef}
              className="absolute top-full left-0 right-0 z-[80] w-full bg-[#FFFFFF] h-auto relative"
              onMouseLeave={() => {
                setIsShopMenuOpen(false);
                setHoveredCategory(null);
              }}
            >
              <MegaMenuDecor channel="CAT" />
              <div className="relative z-[2] flex">
                {/* Colonne gauche : Catégories - Paginé 10/page, style ACW* compact */}
                <div
                  className="w-[500px] px-[4px] py-[1px] flex-shrink-0 relative"
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Shop All — toujours visible, hors pagination */}
                  <Link
                    to="/catalog"
                    className="block text-[15px] leading-[22px] uppercase hover:opacity-70 transition-opacity mb-1"
                    style={{ color: 'rgb(0, 0, 245)' }}
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    Shop All
                  </Link>

                  <div
                    ref={categoriesSliderContainerRef}
                    className="relative overflow-hidden"
                    style={{
                      minHeight: `${CATEGORIES_PER_PAGE * 22}px`,
                      height: `${CATEGORIES_PER_PAGE * 22}px`,
                    }}
                  >
                    {categoriesLoading ? (
                      <div className="text-[15px] text-gray-500">Chargement...</div>
                    ) : categoriesError ? (
                      <div className="text-[15px] text-red-500">Erreur de chargement</div>
                    ) : categories.length === 0 ? (
                      <div className="text-[15px] text-gray-500">Aucune catégorie</div>
                    ) : (
                      <div
                        ref={categoriesSliderRef}
                        className="flex flex-col transition-transform ease-out"
                        style={{
                          transform: `translateY(-${categoriesPage * (100 / Math.ceil(categories.length / CATEGORIES_PER_PAGE))}%)`,
                          height: `${Math.ceil(categories.length / CATEGORIES_PER_PAGE) * 100}%`,
                          transitionDuration: '400ms',
                        }}
                      >
                        {Array.from({ length: Math.ceil(categories.length / CATEGORIES_PER_PAGE) }).map((_, pageIndex) => {
                          const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
                          const pageItems = categories.slice(pageIndex * CATEGORIES_PER_PAGE, (pageIndex + 1) * CATEGORIES_PER_PAGE);
                          return (
                            <div
                              key={pageIndex}
                              className="flex-shrink-0"
                              style={{ height: `${100 / totalPages}%` }}
                            >
                              <ul>
                                {pageItems.map((category) => (
                                  <li key={category.id}>
                                    <Link
                                      to={`/catalog?category=${category.slug}`}
                                      className="block text-[15px] leading-[22px] text-black hover:opacity-70 transition-opacity"
                                      onClick={() => setIsShopMenuOpen(false)}
                                      onMouseEnter={() => setHoveredCategory(category)}
                                      onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                      {category.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pagination catégories */}
                  {!categoriesLoading && !categoriesError && categories.length > CATEGORIES_PER_PAGE && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const maxPage = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
                          changeCategoriesPage(categoriesPage - 1, maxPage);
                        }}
                        disabled={categoriesPage === 0 || isCategoriesTransitioning}
                        className="flex items-center justify-center w-8 h-8 text-black hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Page précédente"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-500 uppercase">
                        {categoriesPage + 1} / {Math.ceil(categories.length / CATEGORIES_PER_PAGE)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const maxPage = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
                          changeCategoriesPage(categoriesPage + 1, maxPage);
                        }}
                        disabled={categoriesPage >= Math.ceil(categories.length / CATEGORIES_PER_PAGE) - 1 || isCategoriesTransitioning}
                        className="flex items-center justify-center w-8 h-8 text-black hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Page suivante"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Section droite : Images dynamiques qui changent au hover */}
                {/* Toujours rendre le container mais le masquer complètement si aucune catégorie n'est survolée */}
                <div 
                  key={`images-container-category-${hoveredCategory?.id || 'empty'}`}
                  className={`flex-1 flex gap-[2px] px-[4px] mb-[10px] justify-end transition-opacity duration-300 ${
                    !hoveredCategory ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
                  }`}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {hoveredCategory && (
                    <>
                      {/* Image 1 : Produit aléatoire de la catégorie */}
                      <div className="max-w-[320px]" key={`image1-category-${hoveredCategory.id}`}>
                        {loadingProductImageCategory ? (
                          <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center mb-3">
                            <div className="text-xs text-gray-400">Chargement...</div>
                          </div>
                        ) : randomProductImageCategory ? (
                          <img 
                            key={`img1-random-category-${hoveredCategory.id}`}
                            src={randomProductImageCategory}
                            alt={hoveredCategory.name || 'Category Collection'}
                            className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback vers placeholder si erreur
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23F3F3F3" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center mb-3">
                            <div className="text-xs text-gray-400">Aucune image</div>
                          </div>
                        )}
                        <p className="text-xs text-black uppercase">
                          {hoveredCategory.name || 'OUR COLLECTIONS'}
                        </p>
                      </div>

                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mega Menu BRANDS - Style A-COLD-WALL* avec hover images */}
        {isBrandsMenuOpen && (
          <>
            {/* Overlay avec blur/shadow sur le contenu */}
            <div 
              className="fixed top-[92px] left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm z-[70]"
              onClick={() => setIsBrandsMenuOpen(false)}
            />
            
            {/* Menu */}
            <div 
              ref={brandsMenuRef}
              className="absolute top-full left-0 right-0 z-[80] w-full bg-[#FFFFFF] h-auto relative"
              onMouseLeave={() => {
                setIsBrandsMenuOpen(false);
                setHoveredBrand(null);
              }}
            >
              <MegaMenuDecor channel="BRD" />
              <div className="relative z-[2] flex">
                {/* Colonne gauche : Marques - Large espace avec slider vertical */}
                <div
                  className="w-[500px] px-[4px] py-[1px] flex-shrink-0 relative"
                  onMouseLeave={() => setHoveredBrand(null)}
                >
                  {/* Shop All Brands — toujours visible, hors pagination */}
                  <Link
                    to="/catalog"
                    className="block text-[15px] leading-[22px] uppercase hover:opacity-70 transition-opacity mb-1"
                    style={{ color: 'rgb(0, 0, 245)' }}
                    onClick={() => setIsBrandsMenuOpen(false)}
                  >
                    Shop All Brands
                  </Link>

                  {/* Container slider VERTICAL avec overflow hidden */}
                  <div
                    ref={brandsSliderContainerRef}
                    className="relative overflow-hidden"
                    style={{
                      minHeight: `${BRANDS_PER_PAGE * 22}px`,
                      height: `${BRANDS_PER_PAGE * 22}px`,
                    }}
                  >
                    {brandsLoading ? (
                      <div className="text-[15px] text-gray-500">Chargement...</div>
                    ) : brandsError ? (
                      <div className="text-[15px] text-red-500">Erreur de chargement</div>
                    ) : brands.length === 0 ? (
                      <div className="text-[15px] text-gray-500">Aucune marque</div>
                    ) : (
                      <div
                        ref={brandsSliderRef}
                        className="flex flex-col transition-transform ease-out"
                        style={{
                          transform: `translateY(-${brandsPage * (100 / Math.ceil(brands.length / BRANDS_PER_PAGE))}%)`,
                          height: `${Math.ceil(brands.length / BRANDS_PER_PAGE) * 100}%`,
                          transitionDuration: '400ms',
                        }}
                      >
                        {Array.from({ length: Math.ceil(brands.length / BRANDS_PER_PAGE) }).map((_, pageIndex) => {
                          const totalPages = Math.ceil(brands.length / BRANDS_PER_PAGE);
                          return (
                            <div
                              key={pageIndex}
                              className="flex-shrink-0"
                              style={{ height: `${100 / totalPages}%` }}
                            >
                              <ul>
                                {brands
                                  .slice(pageIndex * BRANDS_PER_PAGE, (pageIndex + 1) * BRANDS_PER_PAGE)
                                  .map((brand) => (
                                    <li key={brand.id}>
                                      <Link
                                        to={`/catalog?brand=${brand.slug}`}
                                        className="block text-[15px] leading-[22px] text-black hover:opacity-70 transition-opacity"
                                        onClick={() => setIsBrandsMenuOpen(false)}
                                        onMouseEnter={() => setHoveredBrand(brand)}
                                        onMouseLeave={() => setHoveredBrand(null)}
                                      >
                                        {brand.name}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Boutons navigation slider HORIZONTAL (gauche/droite) en dessous de la liste */}
                  {!brandsLoading && !brandsError && brands.length > BRANDS_PER_PAGE && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const maxPage = Math.ceil(brands.length / BRANDS_PER_PAGE);
                          changeBrandsPage(brandsPage - 1, maxPage);
                        }}
                        disabled={brandsPage === 0 || isTransitioning}
                        className="flex items-center justify-center w-8 h-8 text-black hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Page précédente"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-500 uppercase">
                        {brandsPage + 1} / {Math.ceil(brands.length / BRANDS_PER_PAGE)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const maxPage = Math.ceil(brands.length / BRANDS_PER_PAGE);
                          changeBrandsPage(brandsPage + 1, maxPage);
                        }}
                        disabled={brandsPage >= Math.ceil(brands.length / BRANDS_PER_PAGE) - 1 || isTransitioning}
                        className="flex items-center justify-center w-8 h-8 text-black hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Page suivante"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Section droite : Images/Vidéos qui changent au hover */}
                {/* Toujours rendre le container mais le masquer complètement si aucune marque n'est survolée */}
                <div 
                  key={`images-container-${hoveredBrand?.id || 'empty'}`}
                  className={`flex-1 flex gap-[2px] px-[4px] mb-[10px] justify-end transition-opacity duration-300 ${
                    !hoveredBrand ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
                  }`}
                  onMouseLeave={() => setHoveredBrand(null)}
                >
                    {/* Image 1 : Image aléatoire d'un produit de la marque OU megaMenuImage1 */}
                    {hoveredBrand && (
                      <>
                      <div className="max-w-[320px]" key={`image1-${hoveredBrand.id}`}>
                        {hoveredBrand.megaMenuVideo1 ? (
                        <video 
                          key={`video1-${hoveredBrand.id}`}
                          src={hoveredBrand.megaMenuVideo1}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                        />
                      ) : hoveredBrand.megaMenuImage1 ? (
                        <img 
                          key={`img1-${hoveredBrand.id}`}
                          src={hoveredBrand.megaMenuImage1}
                          alt={hoveredBrand.name || 'Brand Collection'}
                          className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback vers placeholder si erreur
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23F3F3F3" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : loadingProductImage ? (
                        <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center mb-3">
                          <div className="text-xs text-gray-400">Chargement...</div>
                        </div>
                      ) : randomProductImage ? (
                        <img 
                          key={`img1-random-${hoveredBrand.id}`}
                          src={randomProductImage}
                          alt={hoveredBrand.name || 'Brand Collection'}
                          className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback vers placeholder si erreur
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23F3F3F3" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center mb-3">
                          <div className="text-xs text-gray-400">Aucune image</div>
                        </div>
                      )}
                      <p className="text-xs text-black uppercase">
                        {hoveredBrand.name || 'OUR BRANDS'}
                      </p>
                    </div>

                    {/* Image 2 : Logo de la marque en noir OU megaMenuImage2 */}
                    <div className="max-w-[320px]" key={`image2-${hoveredBrand.id}`}>
                      {hoveredBrand.megaMenuVideo2 ? (
                        <video 
                          key={`video2-${hoveredBrand.id}`}
                          src={hoveredBrand.megaMenuVideo2}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                        />
                      ) : hoveredBrand.megaMenuImage2 ? (
                        <img 
                          key={`img2-${hoveredBrand.id}`}
                          src={hoveredBrand.megaMenuImage2}
                          alt={hoveredBrand.name || 'Brand Collection'}
                          className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback vers placeholder si erreur
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23F3F3F3" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : hoveredBrand.logoUrl ? (
                        <div className="w-full aspect-[4/5] bg-white flex items-center justify-center mb-3 p-8">
                          <img 
                            key={`logo-${hoveredBrand.id}`}
                            src={getImageUrl(hoveredBrand.logoUrl || '') || ''}
                            alt={hoveredBrand.name || 'Brand Logo'}
                            className="max-w-full max-h-full object-contain filter brightness-0"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback vers placeholder si erreur
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23FFFFFF" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ELogo%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/5] bg-white flex items-center justify-center mb-3">
                          <div className="text-xs text-gray-400">Aucun logo</div>
                        </div>
                      )}
                        <p className="text-xs text-black uppercase">
                          {`${hoveredBrand.name} COLLECTION`}
                        </p>
                      </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </header>
    
    {/* Menu Mobile Full-Screen — dans le sticky wrapper (z-9998 < header z-9999) */}
    {isMobileMenuOpen && (
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[9998] overflow-y-auto bg-white md:hidden"
        style={{ opacity: 0 }}
      >
        <nav className="pl-[5px] pt-[96px] pb-10">
          <MobileNavRow trail="ALL //">
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-w-0 flex-1 truncate text-[16px] font-normal leading-[18px] uppercase hover:opacity-50 transition-opacity"
              style={{ color: 'rgb(0, 0, 245)' }}
            >
              Shop All
            </Link>
          </MobileNavRow>

          {/* Catégories — scrollable, 5 visibles à la fois */}
          <div className="max-h-[340px] overflow-y-auto">
            {categoriesLoading ? null : categoriesError ? null : (
              categories.map((category) => (
                <MobileNavRow key={category.id} trail="CAT //">
                  <Link
                    to={`/catalog?category=${category.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block min-w-0 flex-1 truncate text-[16px] font-normal leading-[18px] capitalize text-black hover:opacity-50 transition-opacity"
                  >
                    {category.name}
                  </Link>
                </MobileNavRow>
              ))
            )}
          </div>

          <div className="mb-[16px] border-t border-gray-200" />

          {/* Marques — scrollable, 5 visibles à la fois */}
          <div className="max-h-[340px] overflow-y-auto">
            {brandsLoading ? null : brandsError ? null : (
              brands.map((brand) => (
                <MobileNavRow key={brand.id} trail="BRD //">
                  <Link
                    to={`/catalog?brand=${brand.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block min-w-0 flex-1 truncate text-[16px] font-normal leading-[18px] capitalize text-black hover:opacity-50 transition-opacity"
                  >
                    {brand.name}
                  </Link>
                </MobileNavRow>
              ))
            )}
          </div>
        </nav>
      </div>
    )}
    </>
  );
};
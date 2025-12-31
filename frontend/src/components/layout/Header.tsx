import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCartContext } from '../../contexts/CartContext';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useAuth } from '../../hooks/useAuth';
import { useQuickSearchContext } from '../../contexts/QuickSearchContext';
import { Button } from "@/components/ui/button"
import type { Brand, Product } from '../../types';
import { animateSlideDown, animateStaggerFadeIn, animateFadeOut, animateScalePulse } from '../../animations';
import * as anime from 'animejs';
import { toMilliseconds, convertEasing } from '../../animations/utils/constants';
import { getProducts } from '../../services/products';
import { getImageUrl } from '../../utils/imageUtils';

export const Header = () => {
  const { cart, loading: cartLoading } = useCartContext();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const { isAuthenticated, user } = useAuth();
  const { open: openQuickSearch } = useQuickSearchContext();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<Brand | null>(null);
  const [randomProductImage, setRandomProductImage] = useState<string | null>(null);
  const [loadingProductImage, setLoadingProductImage] = useState(false);
  
  // État pour le slider des brands (afficher 10 à la fois)
  const [brandsPage, setBrandsPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const BRANDS_PER_PAGE = 10;
  
  // Refs pour le slider touch
  const brandsSliderRef = useRef<HTMLDivElement>(null);
  const brandsSliderContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  
  // États pour le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCatalogueOpen, setIsMobileCatalogueOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  
  const cartItemsCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Refs pour les animations
  const headerRef = useRef<HTMLElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const brandsMenuRef = useRef<HTMLDivElement>(null);
  const cartBadgeRef = useRef<HTMLButtonElement>(null);
  
  // Refs pour le menu mobile
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCatalogueRef = useRef<HTMLUListElement>(null);
  const mobileBrandsRef = useRef<HTMLUListElement>(null);

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

  // Animation d'ouverture/fermeture du menu mobile
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        // Ouvrir : slide depuis la gauche
        anime.animate(mobileMenuRef.current, {
          translateX: ['-100%', '0%'],
          opacity: [0, 1],
          duration: toMilliseconds(0.4),
          easing: convertEasing('power2.out'),
        });

        // Bloquer le scroll du body
        document.body.style.overflow = 'hidden';
      } else {
        // Fermer : slide vers la gauche
        anime.animate(mobileMenuRef.current, {
          translateX: ['0%', '-100%'],
          opacity: [1, 0],
          duration: toMilliseconds(0.3),
          easing: convertEasing('power2.in'),
        });

        // Restaurer le scroll
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Animation transformation hamburger → X
  useEffect(() => {
    if (hamburgerButtonRef.current) {
      const line1 = hamburgerButtonRef.current.querySelector('#hamburger-line-1');
      const line2 = hamburgerButtonRef.current.querySelector('#hamburger-line-2');
      const line3 = hamburgerButtonRef.current.querySelector('#hamburger-line-3');

      if (line1 && line2 && line3) {
        if (isMobileMenuOpen) {
          // Transformation en X
          anime.animate(line1, {
            rotate: [0, 45],
            translateY: [0, 6],
            duration: toMilliseconds(0.3),
            easing: convertEasing('power2.out'),
          });
          anime.animate(line2, {
            opacity: [1, 0],
            duration: toMilliseconds(0.2),
          });
          anime.animate(line3, {
            rotate: [0, -45],
            translateY: [0, -6],
            duration: toMilliseconds(0.3),
            easing: convertEasing('power2.out'),
          });
        } else {
          // Retour à hamburger
          anime.animate(line1, {
            rotate: [45, 0],
            translateY: [6, 0],
            duration: toMilliseconds(0.3),
            easing: convertEasing('power2.out'),
          });
          anime.animate(line2, {
            opacity: [0, 1],
            duration: toMilliseconds(0.2),
          });
          anime.animate(line3, {
            rotate: [-45, 0],
            translateY: [-6, 0],
            duration: toMilliseconds(0.3),
            easing: convertEasing('power2.out'),
          });
        }
      }
    }
  }, [isMobileMenuOpen]);

  // Animation accordéon CATALOGUE mobile
  useEffect(() => {
    if (mobileCatalogueRef.current) {
      if (isMobileCatalogueOpen) {
        // Ouvrir accordéon : calculer la hauteur réelle
        const height = mobileCatalogueRef.current.scrollHeight;
        anime.animate(mobileCatalogueRef.current, {
          height: [0, height],
          opacity: [0, 1],
          duration: toMilliseconds(0.3),
          easing: convertEasing('power2.out'),
        });
      } else {
        // Fermer accordéon
        const height = mobileCatalogueRef.current.scrollHeight;
        anime.animate(mobileCatalogueRef.current, {
          height: [height, 0],
          opacity: [1, 0],
          duration: toMilliseconds(0.2),
          easing: convertEasing('power2.in'),
        });
      }
    }
  }, [isMobileCatalogueOpen]);

  // Animation accordéon BRANDS mobile
  useEffect(() => {
    if (mobileBrandsRef.current) {
      if (isMobileBrandsOpen) {
        // Ouvrir accordéon : calculer la hauteur réelle
        const height = mobileBrandsRef.current.scrollHeight;
        anime.animate(mobileBrandsRef.current, {
          height: [0, height],
          opacity: [0, 1],
          duration: toMilliseconds(0.3),
          easing: convertEasing('power2.out'),
        });
      } else {
        // Fermer accordéon
        const height = mobileBrandsRef.current.scrollHeight;
        anime.animate(mobileBrandsRef.current, {
          height: [height, 0],
          opacity: [1, 0],
          duration: toMilliseconds(0.2),
          easing: convertEasing('power2.in'),
        });
      }
    }
  }, [isMobileBrandsOpen]);

  // Récupérer une image aléatoire d'un produit de la marque au hover
  useEffect(() => {
    const fetchRandomProductImage = async () => {
      if (!hoveredBrand) {
        setRandomProductImage(null);
        return;
      }

      // Si la marque a déjà des images megaMenu, on les utilise
      if (hoveredBrand.megaMenuImage1 || hoveredBrand.megaMenuVideo1) {
        setRandomProductImage(null);
        return;
      }

      try {
        setLoadingProductImage(true);
        // Récupérer les produits de cette marque
        const response = await getProducts({
          brand: hoveredBrand.slug,
          limit: 50, // Récupérer jusqu'à 50 produits pour avoir plus de choix
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
          
          // Prendre la première image du produit (ou une aléatoire)
          const randomImageIndex = Math.floor(
            Math.random() * randomProduct.images!.length
          );
          const selectedImage = randomProduct.images![randomImageIndex];
          
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

  // Fonction pour changer de page avec animation
  const changeBrandsPage = (newPage: number, maxPage: number) => {
    if (isTransitioning) return;
    const clampedPage = Math.max(0, Math.min(maxPage - 1, newPage));
    if (clampedPage !== brandsPage) {
      setBrandsPage(clampedPage);
    }
  };

  // Gestion du touch/swipe VERTICAL pour le slider
  const handleTouchStart = (e: React.TouchEvent) => {
    // Ne pas bloquer si on clique directement sur un lien
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = Math.abs(touchStartX.current - touchCurrentX);
    const diffY = Math.abs(touchStartY.current - touchCurrentY);

    // Si le mouvement vertical est plus important que l'horizontal, c'est un swipe vertical
    if (diffY > diffX && diffY > 5) {
      isDragging.current = true;
      e.preventDefault(); // Empêcher le scroll par défaut
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      isDragging.current = false;
      return;
    }

    // Ne pas bloquer si on clique directement sur un lien
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      // Si on a swipé, ne pas suivre le lien
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      touchStartX.current = null;
      touchStartY.current = null;
      isDragging.current = false;
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Seuil minimum pour déclencher un swipe (30px pour être plus sensible)
    const minSwipeDistance = 30;

    // Si le mouvement vertical est plus important que l'horizontal
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      const maxPage = Math.ceil(brands.length / BRANDS_PER_PAGE);
      
      if (diffY > 0) {
        // Swipe vers le haut = page suivante
        changeBrandsPage(brandsPage + 1, maxPage);
      } else {
        // Swipe vers le bas = page précédente
        changeBrandsPage(brandsPage - 1, maxPage);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
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
    <header ref={headerRef} className="bg-white relative z-[60]">
      <div className="w-full relative">
        <div className="flex items-center justify-between min-h-[46px] px-[4px]">
          {/* Section gauche : Menu hamburger mobile (gauche) + Logo (centré mobile) + Navigation (desktop) */}
          <div className="flex items-center gap-[50px] flex-1 md:flex-none">
            {/* Menu mobile hamburger - À gauche avant le logo */}
            <button 
              ref={hamburgerButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 relative z-[100]"
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  id="hamburger-line-1"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  {...({ transformOrigin: 'center' } as any)}
                />
                <path 
                  id="hamburger-line-2"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  {...({ transformOrigin: 'center' } as any)}
                />
                <path 
                  id="hamburger-line-3"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                  {...({ transformOrigin: 'center' } as any)}
                />
              </svg>
            </button>

            {/* Logo - Centré en mobile (position absolute), position normale en desktop */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center"
          >
            <span className="text-xl font-bold text-black uppercase tracking-tight">
              REBOULSTORE 2.0*
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
                }}
                onMouseEnter={() => {
                  setIsShopMenuOpen(true);
                  setIsBrandsMenuOpen(false);
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
                  }
                }}
                onMouseEnter={() => {
                  setIsBrandsMenuOpen(true);
                  setIsShopMenuOpen(false);
                  setBrandsPage(0); // Reset à la première page quand on ouvre le menu
                  setIsTransitioning(false); // Reset l'état de transition
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

          {/* Utilitaires à droite - atteint le bord droit */}
          <div className="hidden md:flex items-center gap-6">
            {/* Bouton RECHERCHER - Ouvre QuickSearch */}
            <button
              onClick={() => openQuickSearch()}
              className='text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity'
            >
              RECHERCHER
            </button>
          
            {/* Account / Login button */}
            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
            >
              {isAuthenticated ? (user?.firstName ? user.firstName.toUpperCase() : 'MON COMPTE') : 'CONNEXION'}
            </Link>
            
            <Button ref={cartBadgeRef} asChild className="relative flex items-center gap-2 bg-black text-white rounded-md uppercase text-sm font-light hover:opacity-90 transition-opacity">
            <Link to="/cart">
              CART ({cartLoading ? '...' : cartItemsCount})
            </Link>
            </Button>
          </div>

          {/* Bouton recherche mobile - À droite */}
          <button 
            onClick={() => openQuickSearch()}
            className="md:hidden flex items-center justify-center w-10 h-10 relative z-[100]"
            aria-label="Rechercher"
          >
            <Search className="w-5 h-5 text-black" />
          </button>
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
              className="absolute top-full left-0 right-0 w-full h-auto bg-[#FFFFFF] z-[80]"
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <div className="flex">
                {/* Colonne gauche : Catégories - Large espace */}
                <div className="w-[500px] px-[4px] py-[1px] flex-shrink-0">
                  <ul>
                    {categoriesLoading ? (
                      <li className="text-base text-gray-500">Chargement...</li>
                    ) : categoriesError ? (
                      <li className="text-base text-red-500">Erreur de chargement</li>
                    ) : categories.length === 0 ? (
                      <li className="text-base text-gray-500">Aucune catégorie</li>
                    ) : (
                      categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            to={`/catalog?category=${category.slug}`}
                            className="block text-[18px] uppercase text-black hover:opacity-70 transition-opacity"
                            onClick={() => setIsShopMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))
                    )}
                    <li>
                      <Link
                        to="/catalog"
                        className="block uppercase text-[18px] text-black hover:opacity-70 transition-opacity"
                        onClick={() => setIsShopMenuOpen(false)}
                      >
                        Shop All
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Section droite : Images promotionnelles - Espace plus compact */}
                <div className="flex-1 flex gap-[2px] px-[4px] mb-[10px] justify-end">
                  {/* Image 1 */}
                  <div className="max-w-[320px]">
                    <img 
                      src="/webdesign/AW25_LB_4_5_03_2.png"
                      alt="AUTUMN/WINTER 2025 Collection"
                      className="w-full aspect-[4/5] object-cover mb-3"
                      loading="lazy"
                    />
                    <p className="text-xs text-black uppercase">
                      AUTUMN/WINTER 2025
                    </p>
                  </div>

                  {/* Image 2 */}
                  <div className="max-w-[320px]">
                    <img 
                      src="/webdesign/publicity2.png"
                      alt="ARSENAL* COLLECTION"
                      className="w-full aspect-[4/5] object-cover mb-3"
                      loading="lazy"
                    />
                    <p className="text-xs text-black uppercase">
                      ARSENAL* X REBOULSTORE
                    </p>
                  </div> 
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
              className="absolute top-full left-0 right-0 w-full h-auto bg-[#FFFFFF] z-[80]"
              onMouseLeave={() => {
                setIsBrandsMenuOpen(false);
                setHoveredBrand(null);
              }}
            >
              <div className="flex">
                {/* Colonne gauche : Marques - Large espace avec slider vertical */}
                <div 
                  className="w-[500px] px-[4px] py-[1px] flex-shrink-0 relative"
                >
                  {/* Container slider VERTICAL avec overflow hidden */}
                  <div 
                    ref={brandsSliderContainerRef}
                    className="relative overflow-hidden"
                    style={{ 
                      minHeight: `${BRANDS_PER_PAGE * 32}px`, 
                      height: `${BRANDS_PER_PAGE * 32}px`,
                    }}
                  >
                    {brandsLoading ? (
                      <div className="text-base text-gray-500">Chargement...</div>
                    ) : brandsError ? (
                      <div className="text-base text-red-500">Erreur de chargement</div>
                    ) : brands.length === 0 ? (
                      <div className="text-base text-gray-500">Aucune marque</div>
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
                        {/* Créer une page pour chaque groupe de 10 brands */}
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
                        <li 
                          key={brand.id}
                                      className="mb-1"
                        >
                          <Link
                            to={`/catalog?brand=${brand.slug}`}
                            className="block text-[18px] uppercase text-black hover:opacity-70 transition-opacity"
                            onClick={() => setIsBrandsMenuOpen(false)}
                                        onMouseEnter={() => setHoveredBrand(brand)}
                                        onMouseLeave={() => setHoveredBrand(null)}
                          >
                            {brand.name}
                          </Link>
                        </li>
                                  ))}
                                {/* Lien "Shop All Brands" sur la dernière page seulement */}
                                {pageIndex === totalPages - 1 && (
                                  <li className="mt-4">
                      <Link
                        to="/catalog"
                        className="block uppercase text-[18px] text-black hover:opacity-70 transition-opacity"
                        onClick={() => setIsBrandsMenuOpen(false)}
                      >
                        Shop All Brands
                      </Link>
                    </li>
                                )}
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
                <div className="flex-1 flex gap-[2px] px-[4px] mb-[10px] justify-end">
                  {/* Image 1 : Image aléatoire d'un produit de la marque OU megaMenuImage1 */}
                  <div className="max-w-[320px]" key={`image1-${hoveredBrand?.id || 'default'}`}>
                    {hoveredBrand?.megaMenuVideo1 ? (
                      <video 
                        key={`video1-${hoveredBrand.id}`}
                        src={hoveredBrand.megaMenuVideo1}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                      />
                    ) : hoveredBrand?.megaMenuImage1 ? (
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
                        key={`img1-random-${hoveredBrand?.id || 'default'}`}
                        src={randomProductImage}
                        alt={hoveredBrand?.name || 'Brand Collection'}
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
                      {hoveredBrand?.name || 'OUR BRANDS'}
                    </p>
                  </div>

                  {/* Image 2 : Logo de la marque en noir OU megaMenuImage2 */}
                  <div className="max-w-[320px]" key={`image2-${hoveredBrand?.id || 'default'}`}>
                    {hoveredBrand?.megaMenuVideo2 ? (
                      <video 
                        key={`video2-${hoveredBrand?.id || 'default'}`}
                        src={hoveredBrand.megaMenuVideo2}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                      />
                    ) : hoveredBrand?.megaMenuImage2 ? (
                      <img 
                        key={`img2-${hoveredBrand?.id || 'default'}`}
                        src={hoveredBrand.megaMenuImage2}
                        alt={hoveredBrand?.name || 'Brand Collection'}
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback vers placeholder si erreur
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"%3E%3Crect fill="%23F3F3F3" width="320" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : hoveredBrand?.logoUrl ? (
                      <div className="w-full aspect-[4/5] bg-white flex items-center justify-center mb-3 p-8">
                        <img 
                          key={`logo-${hoveredBrand?.id || 'default'}`}
                          src={getImageUrl(hoveredBrand?.logoUrl || '') || ''}
                          alt={hoveredBrand?.name || 'Brand Logo'}
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
                      {hoveredBrand ? `${hoveredBrand.name} COLLECTION` : 'PREMIUM BRANDS'}
                    </p>
                  </div> 
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </header>
    
    {/* Menu Mobile Hamburger - Rendu en dehors du header pour éviter les problèmes de z-index */}
    {isMobileMenuOpen && (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
          {/* Menu */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-0 left-0 w-[85vw] max-w-[400px] h-full bg-white z-[9999] md:hidden flex flex-col shadow-lg border-r border-gray-200"
            style={{ transform: 'translateX(-100%)' }}
          >
          {/* Header du menu */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-semibold uppercase tracking-tight"
            >
              REBOULSTORE 2.0*
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Fermer le menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-2">
            {/* CATALOGUE avec accordéon */}
            <div>
              <button
                onClick={() => setIsMobileCatalogueOpen(!isMobileCatalogueOpen)}
                className="w-full flex justify-between items-center py-3 px-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>CATALOGUE</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isMobileCatalogueOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul 
                ref={mobileCatalogueRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                {categoriesLoading ? (
                  <li className="py-2 px-4 text-sm text-gray-500">Chargement...</li>
                ) : categoriesError ? (
                  <li className="py-2 px-4 text-sm text-red-500">Erreur</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/catalog?category=${category.slug}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileCatalogueOpen(false);
                        }}
                        className="block py-2 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* BRANDS avec accordéon */}
            <div>
              <button
                onClick={() => setIsMobileBrandsOpen(!isMobileBrandsOpen)}
                className="w-full flex justify-between items-center py-3 px-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>BRANDS</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isMobileBrandsOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
                <ul 
                  ref={mobileBrandsRef}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0, display: 'block' }}
                >
                {brandsLoading ? (
                  <li className="py-2 px-4 text-sm text-gray-500">Chargement...</li>
                ) : brandsError ? (
                  <li className="py-2 px-4 text-sm text-red-500">Erreur</li>
                ) : (
                  brands.map((brand) => (
                    <li key={brand.id}>
                      <Link
                        to={`/catalog?brand=${brand.slug}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileBrandsOpen(false);
                        }}
                        className="block py-2 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))
                )}
                <li>
                  <Link
                    to="/catalog"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileBrandsOpen(false);
                    }}
                    className="block py-2 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Shop All Brands
                  </Link>
                </li>
              </ul>
            </div>

          </nav>

          {/* Footer du menu */}
          <div className="border-t px-4 py-4 space-y-2">
            {/* Compte */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Mon compte
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Connexion
              </Link>
            )}

            {/* Panier */}
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Panier ({cartLoading ? '...' : cartItemsCount})
            </Link>
          </div>
        </div>
      </>
    )}
    </>
  );
};
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useAuth } from '../../hooks/useAuth';
import { Button } from "@/components/ui/button"
import type { Brand } from '../../types';
import { animateSlideDown, animateStaggerFadeIn, animateFadeOut, animateScalePulse } from '../../animations';
import * as anime from 'animejs';
import { toMilliseconds, convertEasing } from '../../animations/utils/constants';

export const Header = () => {
  const { cart, loading: cartLoading } = useCartContext();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const { isAuthenticated, user } = useAuth();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState<Brand | null>(null);
  
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
    <header ref={headerRef} className="bg-white sticky top-0 z-[60] relative">
      <div className="w-full relative">
        <div className="flex items-center justify-between min-h-[46px] px-[4px]">
          {/* Section gauche : Menu hamburger mobile + Logo + Navigation */}
          <div className="flex items-center gap-[50px]">
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

            {/* Logo */}
          <Link to="/" className="flex items-center">
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
                }}
                onMouseEnter={() => {
                  setIsBrandsMenuOpen(true);
                  setIsShopMenuOpen(false);
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

            {/* Liens SALE et THE CORNER | C.P. COMPANY */}
            <Link 
              to="/catalog?sale=true" 
              className="text-black uppercase text-[15px] font-medium hover:opacity-70 transition-opacity"
            >
              SALE
            </Link>
            <div className="flex items-center gap-2">
              <Link 
                to="/the-corner" 
                className="text-black uppercase text-[15px] font-medium hover:opacity-70 transition-opacity"
              >
                THE CORNER
              </Link>
              <span className="text-black text-[15px] font-light">|</span>
              <Link 
                to="/cp-company" 
                className="text-black uppercase text-[15px] font-medium hover:opacity-70 transition-opacity"
              >
                C.P. COMPANY
              </Link>
            </div>
          </nav>
          </div>

          {/* Utilitaires à droite - atteint le bord droit */}
          <div className="hidden md:flex items-center gap-6">
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder='RECHERCHER'
                autoFocus
                className='bg-transparent border-0 border-b border-gray-900 outline-none uppercase text-sm font-medium text-black placeholder:text-gray-500 focus:border-gray-900 px-0 py-1 min-w-[200px]'
                onBlur={() => setIsSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchOpen(false)
                  }
                }}
              />
              </div>
          ) : (
            // Bouton RECHERCHER
            <button
              onClick={() => setIsSearchOpen(true)}
              className='text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity'
              >
              RECHERCHER
              </button>
          )  
          }
          
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

          {/* Menu mobile hamburger */}
          <button 
            ref={hamburgerButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 ml-auto relative z-[100]"
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
              {/* Ligne 1 */}
              <path 
                id="hamburger-line-1"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3.75 6.75h16.5"
              />
              {/* Ligne 2 */}
              <path 
                id="hamburger-line-2"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3.75 12h16.5"
              />
              {/* Ligne 3 */}
              <path 
                id="hamburger-line-3"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
        
        {/* Mega Menu CATALOGUE - Style A-COLD-WALL* - Enfant du header pour être sticky */}
        {isShopMenuOpen && (
          <>
            {/* Overlay avec blur/shadow sur le contenu - Commence après PromoBanner + Navbar */}
            <div 
              className="fixed top-[92px] left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm z-[45]"
              onClick={() => setIsShopMenuOpen(false)}
            />
            
            {/* Menu */}
            <div 
              ref={shopMenuRef}
              className="absolute top-full left-0 right-0 w-full h-auto bg-[#FFFFFF] z-[55]"
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
              className="fixed top-[92px] left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm z-[45]"
              onClick={() => setIsBrandsMenuOpen(false)}
            />
            
            {/* Menu */}
            <div 
              ref={brandsMenuRef}
              className="absolute top-full left-0 right-0 w-full h-auto bg-[#FFFFFF] z-[55]"
              onMouseLeave={() => {
                setIsBrandsMenuOpen(false);
                setHoveredBrand(null);
              }}
            >
              <div className="flex">
                {/* Colonne gauche : Marques - Large espace */}
                <div className="w-[500px] px-[4px] py-[1px] flex-shrink-0">
                  <ul>
                    {brandsLoading ? (
                      <li className="text-base text-gray-500">Chargement...</li>
                    ) : brandsError ? (
                      <li className="text-base text-red-500">Erreur de chargement</li>
                    ) : brands.length === 0 ? (
                      <li className="text-base text-gray-500">Aucune marque</li>
                    ) : (
                      brands.map((brand) => (
                        <li 
                          key={brand.id}
                          onMouseEnter={() => setHoveredBrand(brand)}
                          onMouseLeave={() => setHoveredBrand(null)}
                        >
                          <Link
                            to={`/catalog?brand=${brand.slug}`}
                            className="block text-[18px] uppercase text-black hover:opacity-70 transition-opacity"
                            onClick={() => setIsBrandsMenuOpen(false)}
                          >
                            {brand.name}
                          </Link>
                        </li>
                      ))
                    )}
                    <li>
                      <Link
                        to="/catalog"
                        className="block uppercase text-[18px] text-black hover:opacity-70 transition-opacity"
                        onClick={() => setIsBrandsMenuOpen(false)}
                      >
                        Shop All Brands
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Section droite : Images/Vidéos qui changent au hover */}
                <div className="flex-1 flex gap-[2px] px-[4px] mb-[10px] justify-end">
                  {/* Image/Vidéo 1 */}
                  <div className="max-w-[320px]">
                    {hoveredBrand?.megaMenuVideo1 ? (
                      <video 
                        src={hoveredBrand.megaMenuVideo1}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                      />
                    ) : (
                      <img 
                        src={hoveredBrand?.megaMenuImage1 || '/webdesign/AW25_LB_4_5_03_2.png'}
                        alt={hoveredBrand?.name || 'Brand Collection'}
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                        loading="lazy"
                      />
                    )}
                    <p className="text-xs text-black uppercase">
                      {hoveredBrand?.name || 'OUR BRANDS'}
                    </p>
                  </div>

                  {/* Image/Vidéo 2 */}
                  <div className="max-w-[320px]">
                    {hoveredBrand?.megaMenuVideo2 ? (
                      <video 
                        src={hoveredBrand.megaMenuVideo2}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                      />
                    ) : (
                      <img 
                        src={hoveredBrand?.megaMenuImage2 || '/webdesign/publicity2.png'}
                        alt={hoveredBrand?.name || 'Brand Collection'}
                        className="w-full aspect-[4/5] object-cover mb-3 transition-opacity duration-300"
                        loading="lazy"
                      />
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
            className="fixed top-0 left-0 w-[85vw] max-w-[400px] h-full bg-white z-[9999] md:hidden flex flex-col shadow-2xl"
            style={{ transform: 'translateX(-100%)' }}
          >
          {/* Header du menu */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-bold uppercase tracking-wider"
            >
              REBOULSTORE 2.0*
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
              aria-label="Fermer le menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-1">
            {/* CATALOGUE avec accordéon */}
            <div>
              <button
                onClick={() => setIsMobileCatalogueOpen(!isMobileCatalogueOpen)}
                className="w-full flex justify-between items-center py-4 text-left uppercase text-lg tracking-wider text-black hover:opacity-70 transition-opacity"
              >
                <span>CATALOGUE</span>
                <span className="text-sm">{isMobileCatalogueOpen ? '▲' : '▼'}</span>
              </button>
              <ul 
                ref={mobileCatalogueRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                {categoriesLoading ? (
                  <li className="py-2 text-sm text-gray-500">Chargement...</li>
                ) : categoriesError ? (
                  <li className="py-2 text-sm text-red-500">Erreur</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id} className="py-2">
                      <Link
                        to={`/catalog?category=${category.slug}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileCatalogueOpen(false);
                        }}
                        className="block text-base uppercase tracking-wide text-black/80 hover:text-black hover:opacity-70 transition-opacity pl-4"
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
                className="w-full flex justify-between items-center py-4 text-left uppercase text-lg tracking-wider text-black hover:opacity-70 transition-opacity"
              >
                <span>BRANDS</span>
                <span className="text-sm">{isMobileBrandsOpen ? '▲' : '▼'}</span>
              </button>
                <ul 
                  ref={mobileBrandsRef}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0, display: 'block' }}
                >
                {brandsLoading ? (
                  <li className="py-2 text-sm text-gray-500">Chargement...</li>
                ) : brandsError ? (
                  <li className="py-2 text-sm text-red-500">Erreur</li>
                ) : (
                  brands.map((brand) => (
                    <li key={brand.id} className="py-2">
                      <Link
                        to={`/catalog?brand=${brand.slug}`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileBrandsOpen(false);
                        }}
                        className="block text-base uppercase tracking-wide text-black/80 hover:text-black hover:opacity-70 transition-opacity pl-4"
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))
                )}
                <li className="py-2">
                  <Link
                    to="/catalog"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileBrandsOpen(false);
                    }}
                    className="block text-base uppercase tracking-wide text-black/80 hover:text-black hover:opacity-70 transition-opacity pl-4"
                  >
                    Shop All Brands
                  </Link>
                </li>
              </ul>
            </div>

            {/* Séparateur */}
            <div className="border-t border-gray-200 my-4" />

            {/* Liens secondaires */}
            <Link
              to="/catalog?sale=true"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 uppercase text-lg tracking-wider text-black hover:opacity-70 transition-opacity"
            >
              SALE
            </Link>
            <Link
              to="/the-corner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 uppercase text-lg tracking-wider text-black hover:opacity-70 transition-opacity"
            >
              THE CORNER
            </Link>
            <Link
              to="/cp-company"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-4 uppercase text-lg tracking-wider text-black hover:opacity-70 transition-opacity"
            >
              C.P. COMPANY
            </Link>
          </nav>

          {/* Footer du menu */}
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Compte */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block uppercase text-base tracking-wide text-black hover:opacity-70 transition-opacity"
              >
                MON COMPTE
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block uppercase text-base tracking-wide text-black hover:opacity-70 transition-opacity"
              >
                LOGIN
              </Link>
            )}

            {/* Panier */}
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block uppercase text-base tracking-wide text-black hover:opacity-70 transition-opacity"
            >
              PANIER ({cartLoading ? '...' : cartItemsCount})
            </Link>
          </div>
        </div>
      </>
    )}
    </>
  );
};
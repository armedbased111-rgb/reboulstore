import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCategories } from '../../hooks/useCategories';
import { Button } from "@/components/ui/button"

export const Header = () => {
  const { cart, loading: cartLoading } = useCart();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const cartItemsCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white sticky top-0 z-[60] relative">
      <div className="w-full relative">
        <div className="flex items-center justify-between min-h-[46px] px-[4px]">
          {/* Section gauche : Logo + Navigation */}
          <div className="flex items-center gap-[16px]">
            {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-black uppercase tracking-tight">
              REBOULSTORE 2.0*
            </span>
          </Link>

          {/* Navigation à gauche après le logo */}
            <nav className="hidden md:flex items-center gap-4">
            {/* Menu SHOP avec mega menu */}
            <div className="relative">
              <button
                onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                onMouseEnter={() => setIsShopMenuOpen(true)}
                className="flex items-center gap-1 text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
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

            {/* Liens SALE et THE CORNER | C.P. COMPANY */}
            <Link 
              to="/catalog?sale=true" 
              className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
            >
              SALE
            </Link>
            <div className="flex items-center gap-2">
              <Link 
                to="/the-corner" 
                className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
              >
                THE CORNER
              </Link>
              <span className="text-black">|</span>
              <Link 
                to="/cp-company" 
                className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
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
          
            
            <Link 
              to="/account" 
              className="text-black uppercase text-sm font-medium hover:opacity-70 transition-opacity"
            >
              MON COMPTE
            </Link>
            <Button asChild className="relative flex items-center gap-2 bg-black text-white rounded-md uppercase text-sm font-light hover:opacity-90 transition-opacity">
            <Link to="/cart">
              CART ({cartLoading ? '...' : cartItemsCount})
            </Link>
            </Button>
          </div>

          {/* Menu mobile hamburger */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 ml-auto"
            aria-label="Menu mobile"
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
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
              />
            </svg>
          </button>
        </div>
        
        {/* Mega Menu - Style A-COLD-WALL* - Enfant du header pour être sticky */}
        {isShopMenuOpen && (
          <>
            {/* Overlay avec blur/shadow sur le contenu - Commence après PromoBanner + Navbar */}
            <div 
              className="fixed top-[92px] left-0 right-0 bottom-0 bg-black/10 backdrop-blur-sm z-[45]"
              onClick={() => setIsShopMenuOpen(false)}
            />
            
            {/* Menu */}
            <div 
              className="absolute top-full left-0 right-0 w-full h-auto bg-[#FFFFFF] z-[55]"
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <div className="flex">
                {/* Colonne gauche : Catégories - Large espace */}
                <div className="w-[500px] px-[4px] py-[1px] flex-shrink-0">
                  <ul>
                    {categoriesLoading ? (
                      <li className="text-base text-gray-500">Chargement...</li>
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
      </div>
    </header>
  );
};
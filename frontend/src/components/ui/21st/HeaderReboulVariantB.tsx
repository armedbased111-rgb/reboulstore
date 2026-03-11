// Variante B — Double Bande
// Top bar marques (bg-stone-50) + nav principale sticky
// Le top bar disparaît au scroll avec transition max-height
// Self-contained : données mockées pour le playground

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'

const BRANDS = ['Stone Island', 'CP Company', 'Outlet', 'Reboul Marseille']
const NAV_ITEMS = [
  { label: 'Collections', hasMenu: true },
  { label: 'Marques', hasMenu: true },
  { label: 'Nouveautés', hasMenu: false },
  { label: 'Soldes', hasMenu: false },
]
const DROPDOWN_LINKS = {
  Collections: ['Printemps 2026', 'Hiver 2025', 'Archive'],
  Marques: ['Stone Island', 'CP Company', 'Outlet'],
}
const CART_COUNT = 3

export function HeaderReboulVariantB() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40">
      {/* Top bar — disparaît au scroll */}
      <div
        className={`bg-stone-50 border-b border-stone-100 overflow-hidden transition-all duration-300 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="flex items-center justify-center gap-2 py-2.5 px-4">
          {BRANDS.map((brand, i) => (
            <span key={brand} className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-stone-400 whitespace-nowrap">
                {brand}
              </span>
              {i < BRANDS.length - 1 && (
                <span className="text-stone-200 text-xs select-none">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Nav principale */}
      <nav className="bg-white border-b border-stone-100">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: "'Cormorant', serif" }}
            className="text-2xl font-semibold tracking-[0.2em] uppercase text-stone-900 cursor-pointer shrink-0"
          >
            Reboul
          </Link>

          {/* Nav centrale */}
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <li key={item.label} className="relative">
                <button
                  className="flex items-center gap-1 text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer py-1 group"
                  onMouseEnter={() => item.hasMenu && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-stone-900 transition-all duration-300 group-hover:w-full" />
                  </span>
                  {item.hasMenu && (
                    <ChevronDown
                      size={11}
                      strokeWidth={1.5}
                      className={`transition-transform duration-200 ${
                        activeMenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown */}
                {item.hasMenu && activeMenu === item.label && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white border border-stone-100 shadow-lg"
                    onMouseEnter={() => setActiveMenu(item.label)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    {(DROPDOWN_LINKS[item.label as keyof typeof DROPDOWN_LINKS] ?? []).map(sub => (
                      <Link
                        key={sub}
                        to="#"
                        className="block px-4 py-3 text-xs tracking-wider uppercase text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-150 cursor-pointer border-b border-stone-50 last:border-0"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Icônes droite */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Rechercher"
              className="text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Mon compte"
              className="text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
            >
              <User size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label={`Panier (${CART_COUNT})`}
              className="relative text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {CART_COUNT > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center font-medium leading-none">
                  {CART_COUNT}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between px-5 py-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            className="text-stone-700 cursor-pointer"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <Link to="/" style={{ fontFamily: "'Cormorant', serif" }}>
            <span className="text-xl font-semibold tracking-[0.2em] uppercase text-stone-900">
              Reboul
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button aria-label="Rechercher" className="text-stone-600 cursor-pointer">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              aria-label={`Panier (${CART_COUNT})`}
              className="relative text-stone-600 cursor-pointer"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {CART_COUNT > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center leading-none">
                  {CART_COUNT}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                to="#"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 border-b border-stone-50 transition-colors duration-200 cursor-pointer"
              >
                {item.label}
                {item.hasMenu && (
                  <ChevronDown size={14} strokeWidth={1.5} className="text-stone-300" />
                )}
              </Link>
            ))}
            <div className="px-5 py-4 border-t border-stone-100">
              <button className="flex items-center gap-2 text-xs tracking-widest uppercase text-stone-500 cursor-pointer hover:text-stone-900 transition-colors duration-200">
                <User size={16} strokeWidth={1.5} />
                Mon compte
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

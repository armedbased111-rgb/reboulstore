// Variante A — Éditoriale Symétrique
// Logo centré, nav split gauche/droite, icônes à droite
// Self-contained : données mockées pour le playground (pas de hooks contexte)

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'

const NAV_LEFT = ['Collections', 'Marques']
const NAV_RIGHT = ['Éditions', 'À propos']
const CART_COUNT = 2

export function HeaderReboulVariantA() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b border-stone-100 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-3 items-center px-8 max-w-screen-xl mx-auto">
        {/* Nav gauche */}
        <nav className="flex items-center gap-8">
          {NAV_LEFT.map(item => (
            <Link
              key={item}
              to="#"
              className="relative text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer group py-1"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-stone-900 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Logo centré */}
        <div className="text-center">
          <Link to="/" style={{ fontFamily: "'Cormorant', serif" }}>
            <span
              className={`font-semibold text-stone-900 tracking-[0.25em] uppercase transition-all duration-300 ${
                scrolled ? 'text-xl' : 'text-2xl'
              }`}
            >
              Reboul
            </span>
          </Link>
        </div>

        {/* Nav droite + icônes */}
        <div className="flex items-center justify-end gap-8">
          {NAV_RIGHT.map(item => (
            <Link
              key={item}
              to="#"
              className="relative text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer group py-1"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-stone-900 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-2 pl-6 border-l border-stone-100">
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
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center font-medium leading-none">
                  {CART_COUNT}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="flex md:hidden items-center justify-between px-5">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          className="text-stone-700 cursor-pointer"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        <Link to="/" style={{ fontFamily: "'Cormorant', serif" }}>
          <span className="text-xl font-semibold tracking-[0.25em] uppercase text-stone-900">
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

      {/* Mobile menu déroulant */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          {[...NAV_LEFT, ...NAV_RIGHT].map(item => (
            <Link
              key={item}
              to="#"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-5 py-4 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 border-b border-stone-50 transition-colors duration-200 cursor-pointer"
            >
              {item}
            </Link>
          ))}
          <div className="px-5 py-4">
            <button className="flex items-center gap-2 text-xs tracking-widest uppercase text-stone-500 cursor-pointer hover:text-stone-900 transition-colors duration-200">
              <User size={16} strokeWidth={1.5} />
              Mon compte
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

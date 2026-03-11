// Variante C — Asymétrique Contemporaine
// Grand logo Cormorant italic gauche + séparateur vertical + nav compacte droite
// Scroll : logo rétrécit (text-4xl → text-2xl, opacity 100 → 60), sous-titre disparaît
// Mobile : drawer slide-in depuis la gauche avec overlay
// Self-contained : données mockées pour le playground

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'

const NAV_ITEMS = ['Collections', 'Marques', 'Éditions', 'Soldes']
const CART_COUNT = 1

export function HeaderReboulVariantC() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll pendant l'ouverture du drawer
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-100">
        {/* Desktop */}
        <div className="hidden md:flex items-center px-8 py-5 max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: "'Cormorant', serif" }}
            className="shrink-0 cursor-pointer"
          >
            <span
              className={`block font-light italic text-stone-900 tracking-[0.2em] uppercase transition-all duration-500 ${
                scrolled ? 'text-2xl opacity-60' : 'text-4xl opacity-100'
              }`}
            >
              Reboul
            </span>
            <span
              className={`block text-[9px] tracking-[0.45em] uppercase text-stone-400 mt-0.5 transition-all duration-300 ${
                scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'
              }`}
            >
              Marseille
            </span>
          </Link>

          {/* Séparateur vertical */}
          <div
            className={`mx-8 w-px bg-stone-100 self-stretch transition-opacity duration-500 ${
              scrolled ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Nav + icônes */}
          <div
            className={`flex items-center justify-between flex-1 transition-all duration-500 ${
              scrolled ? 'ml-6' : ''
            }`}
          >
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item}
                  to="#"
                  className="relative text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer group py-1"
                >
                  {item}
                  <span className="absolute -bottom-0 left-0 h-px w-0 bg-stone-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

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
        </div>

        {/* Mobile top bar */}
        <div className="flex md:hidden items-center justify-between px-5 py-4">
          <Link to="/" style={{ fontFamily: "'Cormorant', serif" }}>
            <span className="text-xl font-light italic tracking-[0.2em] uppercase text-stone-900">
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
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Ouvrir le menu"
              className="text-stone-700 cursor-pointer"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-stone-900/30 transition-opacity duration-300" />

          {/* Panel */}
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <Link
                to="/"
                style={{ fontFamily: "'Cormorant', serif" }}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="text-xl font-light italic tracking-[0.2em] uppercase text-stone-900">
                  Reboul
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer le menu"
                className="text-stone-400 hover:text-stone-700 transition-colors duration-200 cursor-pointer"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Liens nav */}
            <nav className="flex-1 py-2">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item}
                  to="#"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center px-6 py-4 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-b border-stone-50 last:border-0 transition-colors duration-150 cursor-pointer"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Footer du drawer */}
            <div className="px-6 py-5 border-t border-stone-100 space-y-4">
              <button className="flex items-center gap-3 text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 cursor-pointer">
                <User size={16} strokeWidth={1.5} />
                Mon compte
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

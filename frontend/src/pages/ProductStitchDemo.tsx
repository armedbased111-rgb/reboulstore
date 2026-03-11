import { useState } from 'react'

interface Size {
  label: string
  available: boolean
}

interface Product {
  id: number
  name: string
  price: number
  brand: string
  ref: string
  images: string[]
  sizes: Size[]
  stock: number
  description: string
  composition: string
  care: string[]
}

const mockProduct: Product = {
  id: 1,
  name: 'Ghost Piece Overshirt',
  brand: 'Stone Island',
  ref: '741510421',
  price: 695,
  images: ['/img/face.jpg', '/img/back.jpg', '/img/detail.jpg'],
  sizes: [
    { label: 'XS', available: false },
    { label: 'S', available: true },
    { label: 'M', available: true },
    { label: 'L', available: true },
    { label: 'XL', available: false },
  ],
  stock: 3,
  description:
    'Overshirt en tissu Ghost Piece, teint après assemblage pour un rendu uniforme. Col chemise, fermeture boutonnée, deux poches poitrine.',
  composition: '100% Coton. Doublure : 100% Polyester.',
  care: [
    'Lavage en machine 30°C',
    'Ne pas utiliser de sèche-linge',
    'Repassage température basse',
    'Nettoyage à sec possible',
  ],
}

export default function ProductStitchDemo() {
  return <ProductPage product={mockProduct} />
}

function ProductPage({ product }: { product: Product }) {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans">
      <Navbar />
      <Hero product={product} />
      <ProductDetails product={product} />
      <SimilarProducts />
    </main>
  )
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">
          Reboul
        </a>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-neutral-500">
          <a href="/catalog" className="hover:text-neutral-900 transition-colors">
            Collections
          </a>
          <a href="/brands" className="hover:text-neutral-900 transition-colors">
            Marques
          </a>
          <a href="/outlet" className="hover:text-neutral-900 transition-colors">
            Outlet
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs tracking-widest uppercase text-neutral-500 hover:text-neutral-900">
            Panier (0)
          </button>
        </div>
      </div>
    </nav>
  )
}

function Hero({ product }: { product: Product }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [activeImg, setActiveImg] = useState(0)

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-3">
          <div className="flex flex-row md:flex-col gap-2">
            {product.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`w-14 h-18 border shrink-0 overflow-hidden transition-all ${
                  activeImg === i ? 'border-neutral-900' : 'border-neutral-200'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] bg-neutral-50 overflow-hidden">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 md:max-w-sm md:pt-2">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-1">
              {product.brand}
            </p>
            <h1 className="text-xl md:text-2xl font-medium tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Réf. {product.ref}</p>
          </div>

          <p className="text-2xl font-semibold tracking-tight">
            {product.price.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>

          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">Taille</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelected(s.label)}
                  className={`w-12 h-12 border text-sm font-medium transition-all ${
                    !s.available
                      ? 'border-neutral-200 text-neutral-300 line-through cursor-not-allowed'
                      : selected === s.label
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 text-neutral-900 hover:border-neutral-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-700"
            >
              Guide des tailles
            </button>
          </div>

          <p className="text-xs text-neutral-400">
            {product.stock <= 3 && product.stock > 0
              ? `⚠ Plus que ${product.stock} en stock`
              : product.stock === 0
              ? 'Rupture de stock'
              : 'En stock'}
          </p>

          <div className="flex flex-col gap-3 mt-auto">
            <button
              type="button"
              disabled={!selected}
              className={`w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all ${
                selected
                  ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {selected ? 'Ajouter au panier' : 'Sélectionner une taille'}
            </button>
            <button
              type="button"
              className="w-full py-4 text-sm font-semibold tracking-widest uppercase border border-neutral-900 hover:bg-neutral-50 transition-all"
            >
              ♡ Favoris
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-6 py-4 md:hidden z-40">
        <button
          type="button"
          disabled={!selected}
          className={`w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all ${
            selected
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {selected ? 'Ajouter au panier' : 'Sélectionner une taille'}
        </button>
      </div>
    </section>
  )
}

function ProductDetails({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>('description')

  const sections = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'composition', label: 'Composition & Matières', content: product.composition },
    {
      id: 'care',
      label: 'Entretien',
      content: (
        <ul className="space-y-1">
          {product.care.map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="text-neutral-400">—</span> {c}
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-12 border-t border-neutral-100">
      <div className="max-w-xl">
        {sections.map((s) => (
          <div key={s.id} className="border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setOpen(open === s.id ? null : s.id)}
              className="w-full flex justify-between items-center py-5 text-sm font-medium tracking-widest uppercase"
            >
              <span>{s.label}</span>
              <span className="text-lg font-light">{open === s.id ? '−' : '+'}</span>
            </button>
            {open === s.id && (
              <div className="pb-5 text-sm text-neutral-600 leading-relaxed">
                {typeof s.content === 'string' ? <p>{s.content}</p> : s.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function SimilarProducts() {
  const items = [
    { id: 1, name: 'Ghost Piece Jacket', brand: 'Stone Island', price: 890, img: '/img/p1.jpg' },
    { id: 2, name: 'Garment Dye Hoodie', brand: 'CP Company', price: 420, img: '/img/p2.jpg' },
    { id: 3, name: 'Nylon B-1 Jacket', brand: 'Stone Island', price: 1250, img: '/img/p3.jpg' },
    { id: 4, name: 'Goggle Overshirt', brand: 'CP Company', price: 680, img: '/img/p4.jpg' },
  ]

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 border-t border-neutral-100">
      <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-8">
        Produits similaires
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => (
          <a key={p.id} href={`/product/${p.id}`} className="group block">
            <div className="aspect-[3/4] bg-neutral-50 overflow-hidden mb-3">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="text-xs text-neutral-400 tracking-widest uppercase mb-0.5">{p.brand}</p>
            <p className="text-sm font-medium truncate">{p.name}</p>
            <p className="text-sm text-neutral-600 mt-0.5">
              {p.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}


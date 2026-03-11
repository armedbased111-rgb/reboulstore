import { Link } from 'react-router-dom'
import { useBrands } from '../hooks/useBrands'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BrandStats } from '../types'
import { Upload } from 'lucide-react'

function BrandCard({ brand }: { brand: BrandStats }) {
  const withImages = brand.needs_upload_count + brand.done_count
  return (
    <Link
      to={`/brand/${encodeURIComponent(brand.name)}`}
      className="bg-white border border-stone-200 p-5 hover:border-stone-400 transition-colors duration-200 block"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-stone-900">{brand.name}</h2>
          <p className="text-xs text-stone-400 mt-0.5">{brand.config.product_type}</p>
        </div>
        <span className="text-xs text-stone-400">{withImages}/{brand.total_refs}</span>
      </div>
      <ProgressBar value={withImages} total={brand.total_refs} className="mb-3" />
      <div className="flex gap-3 text-[10px] tracking-wider uppercase">
        {brand.empty_count > 0 && <span className="text-stone-400">{brand.empty_count} a shooter</span>}
        {brand.needs_generation_count > 0 && <span className="text-yellow-600">{brand.needs_generation_count} a generer</span>}
        {brand.needs_upload_count > 0 && <span className="text-orange-600">{brand.needs_upload_count} a uploader</span>}
        {brand.done_count > 0 && <span className="text-green-600">{brand.done_count} ok</span>}
      </div>
    </Link>
  )
}

export function Dashboard() {
  const { brands, loading } = useBrands()

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-stone-400 mb-0.5">Reboul Store</p>
            <h1 className="text-xl tracking-[0.15em] uppercase text-stone-900">
              Image Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/upload"
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-900 border border-stone-200 px-3 py-2 hover:border-stone-400 transition-colors"
            >
              <Upload size={14} />
              Upload manager
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {loading ? (
          <p className="text-xs tracking-widest uppercase text-stone-400">Chargement...</p>
        ) : brands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">Aucune marque configuree</p>
            <p className="text-xs text-stone-400">Ajoute une marque dans <code className="bg-stone-100 px-1">brand_configs.json</code></p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] tracking-widest uppercase text-stone-400">{brands.length} marque{brands.length > 1 ? 's' : ''}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map(b => <BrandCard key={b.name} brand={b} />)}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

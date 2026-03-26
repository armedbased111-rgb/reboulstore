import { Link } from 'react-router-dom'
import { useBrands } from '../hooks/useBrands'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BrandStats } from '../types'
import { Upload, ArrowUpRight } from 'lucide-react'

function BrandCard({ brand }: { brand: BrandStats }) {
  const withImages = brand.needs_upload_count + brand.done_count
  const pct = brand.total_refs > 0 ? Math.round((withImages / brand.total_refs) * 100) : 0

  return (
    <Link
      to={`/brand/${encodeURIComponent(brand.name)}`}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer block overflow-hidden"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-medium text-zinc-100 tracking-tight mb-1">{brand.name}</h2>
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">{brand.config.product_type}</span>
        </div>
        <ArrowUpRight size={15} className="text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { val: brand.empty_count,            label: 'shoot',    color: 'text-zinc-500' },
          { val: brand.needs_generation_count, label: 'générer',  color: 'text-amber-400' },
          { val: brand.needs_upload_count,     label: 'upload',   color: 'text-orange-400' },
          { val: brand.done_count,             label: 'ok',       color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className={`text-lg font-semibold ${s.color} leading-none mb-1`}>{s.val}</div>
            <div className="text-[9px] uppercase tracking-widest text-zinc-700">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-600">Progression</span>
          <span className="text-zinc-400 font-medium">{withImages}/{brand.total_refs} <span className="text-zinc-600">({pct}%)</span></span>
        </div>
        <ProgressBar value={withImages} total={brand.total_refs} />
      </div>
    </Link>
  )
}

export function Dashboard() {
  const { brands, loading } = useBrands()

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-black text-[9px] font-bold tracking-tight">R</span>
            </div>
            <div>
              <span className="text-xs font-medium text-zinc-200 tracking-tight">Reboul</span>
              <span className="text-xs text-zinc-600 ml-1.5">Image Manager</span>
            </div>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
          >
            <Upload size={12} />
            Upload manager
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <div className="w-3 h-3 border border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Chargement...
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-600 text-sm mb-2">Aucune marque configurée</p>
            <p className="text-zinc-700 text-xs">Ajoute une entrée dans <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">brand_configs.json</code></p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Marques</h1>
                <p className="text-xs text-zinc-600 mt-0.5">{brands.length} marque{brands.length > 1 ? 's' : ''} configurée{brands.length > 1 ? 's' : ''}</p>
              </div>
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

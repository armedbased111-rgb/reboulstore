import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { ChevronLeft, Check } from 'lucide-react'

interface PendingRef {
  brand: string
  ref: string
  images: string[]
}

export function UploadManager() {
  const [pending, setPending] = useState<PendingRef[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await api.get('/upload/pending')
    setPending(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markDone = async (brand: string, ref: string) => {
    await api.post(`/upload/${encodeURIComponent(brand)}/${encodeURIComponent(ref)}/mark-done`)
    await load()
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-700 mb-3 w-fit">
            <ChevronLeft size={12} />
            Dashboard
          </Link>
          <h1 className="text-sm tracking-widest uppercase text-stone-900 font-medium">Upload Manager</h1>
          <p className="text-xs text-stone-400 mt-0.5">{pending.length} ref{pending.length !== 1 ? 's' : ''} a uploader</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
        {loading ? (
          <p className="text-xs tracking-widest uppercase text-stone-400">Chargement...</p>
        ) : pending.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-widest uppercase text-stone-400">Tout est a jour</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.map(item => (
              <div key={`${item.brand}-${item.ref}`} className="bg-white border border-stone-200 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-700 font-medium">{item.ref}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{item.brand} · {item.images.length} image{item.images.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => markDone(item.brand, item.ref)}
                  className="flex items-center gap-2 text-[10px] tracking-widest uppercase border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                >
                  <Check size={12} />
                  Marquer fait
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

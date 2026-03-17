import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { RefStatus } from '../types'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ChevronLeft, Upload } from 'lucide-react'

export function RefView() {
  const { name, ref } = useParams<{ name: string; ref: string }>()
  const brandName = decodeURIComponent(name!)
  const refName = decodeURIComponent(ref!)
  const [data, setData] = useState<RefStatus | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const d = await api.get(`/brands/${encodeURIComponent(brandName)}/refs/${encodeURIComponent(refName)}`)
    setData(d)
  }

  useEffect(() => { load() }, [brandName, refName])

  const markDone = async () => {
    setUploading(true)
    await api.post(`/upload/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/mark-done`)
    await load()
    setUploading(false)
  }

  if (!data) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-xs tracking-widest uppercase text-stone-400">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to={`/brand/${encodeURIComponent(brandName)}`}
            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-700 mb-3 w-fit"
          >
            <ChevronLeft size={12} />
            {brandName}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm tracking-widest uppercase text-stone-900 font-medium">{refName}</h1>
              <div className="mt-1.5"><StatusBadge status={data.status} /></div>
            </div>
            {data.status === 'needs_upload' && (
              <button
                onClick={markDone}
                disabled={uploading}
                className="flex items-center gap-2 text-xs tracking-widest uppercase bg-stone-900 text-white px-4 py-2 hover:bg-stone-700 transition-colors disabled:opacity-50"
              >
                <Upload size={13} />
                {uploading ? 'En cours...' : 'Marquer uploade'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8">
        {data.images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-widest uppercase text-stone-400">
              {data.input_photo_count > 0
                ? 'Photos presentes - images a generer via le batch'
                : 'Aucune photo dans ce dossier'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.images.map(img => (
              <div key={img} className="bg-white border border-stone-200 overflow-hidden">
                <div className="aspect-[3/4] bg-stone-50">
                  <img
                    src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(refName)}/${img}`}
                    alt={img}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="px-3 py-2 border-t border-stone-100">
                  <p className="text-[10px] text-stone-500 font-mono">{img}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

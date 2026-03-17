import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { BatchEvent } from '../types'
import { LogConsole } from '../components/ui/LogConsole'
import { ChevronLeft, Upload, X, ArrowUpRight } from 'lucide-react'

interface PendingRef {
  brand: string
  ref: string
  images: string[]
}

interface UploadState {
  running: boolean
  logs: BatchEvent[]
}

export function UploadManager() {
  const [pending, setPending] = useState<PendingRef[]>([])
  const [loading, setLoading] = useState(true)
  const [uploads, setUploads] = useState<Record<string, UploadState>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const data = await api.get('/upload/pending')
    setPending(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const key = (brand: string, ref: string) => `${brand}::${ref}`

  const runUpload = (brand: string, ref: string) => {
    const k = key(brand, ref)
    setUploads(prev => ({ ...prev, [k]: { running: true, logs: [] } }))
    fetch(`/api/upload/${encodeURIComponent(brand)}/${encodeURIComponent(ref)}/run`, { method: 'POST' })
      .then(async res => {
        const reader = res.body!.getReader()
        const dec = new TextDecoder()
        let buf = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          const lines = buf.split('\n'); buf = lines.pop()!
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const evt: BatchEvent = JSON.parse(line.slice(6))
              setUploads(prev => ({ ...prev, [k]: { running: prev[k]?.running ?? false, logs: [...(prev[k]?.logs ?? []), evt] } }))
              if (evt.type === 'done' || evt.type === 'error') {
                setUploads(prev => ({ ...prev, [k]: { ...prev[k], running: false } }))
                if (evt.type === 'done' && evt.success) setPending(prev => prev.filter(p => !(p.brand === brand && p.ref === ref)))
              }
            } catch {}
          }
        }
        setUploads(prev => ({ ...prev, [k]: { ...prev[k], running: false } }))
      })
      .catch(e => setUploads(prev => ({ ...prev, [k]: { running: false, logs: [{ type: 'error', message: String(e) }] } })))
  }

  const clearUpload = (brand: string, ref: string) => {
    const k = key(brand, ref)
    setUploads(prev => { const n = { ...prev }; delete n[k]; return n })
  }

  // Group by brand
  const byBrand = pending.reduce((acc, item) => {
    if (!acc[item.brand]) acc[item.brand] = []
    acc[item.brand].push(item)
    return acc
  }, {} as Record<string, PendingRef[]>)

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/60 px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-300 mb-3 transition-colors cursor-pointer">
            <ChevronLeft size={11} />Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Upload Manager</h1>
              <p className="text-xs text-zinc-600 mt-0.5">
                {pending.length} ref{pending.length !== 1 ? 's' : ''} à uploader
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <div className="w-3 h-3 border border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Chargement...
          </div>
        ) : pending.length === 0 && Object.keys(uploads).length === 0 ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload size={16} className="text-emerald-400" />
            </div>
            <p className="text-zinc-400 text-sm font-medium">Tout est à jour</p>
            <p className="text-zinc-700 text-xs mt-1">Aucune image en attente d'upload</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byBrand).map(([brand, items]) => (
              <div key={brand}>
                <div className="flex items-center gap-2 mb-3">
                  <Link to={`/brand/${encodeURIComponent(brand)}`}
                    className="text-xs font-semibold text-zinc-300 hover:text-white tracking-tight flex items-center gap-1 cursor-pointer">
                    {brand} <ArrowUpRight size={11} className="text-zinc-600" />
                  </Link>
                  <span className="text-[10px] text-zinc-700">{items.length} ref{items.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {items.map(item => {
                    const k = key(item.brand, item.ref)
                    const state = uploads[k]
                    return (
                      <div key={k} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-zinc-200 tracking-wide">{item.ref}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">{item.images.length} image{item.images.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {state && !state.running && (
                              <button onClick={() => clearUpload(item.brand, item.ref)} className="text-zinc-700 hover:text-zinc-400 cursor-pointer">
                                <X size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => runUpload(item.brand, item.ref)}
                              disabled={state?.running}
                              className="flex items-center gap-1.5 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                            >
                              <Upload size={11} />
                              {state?.running ? 'Upload…' : 'Uploader'}
                            </button>
                          </div>
                        </div>
                        {state && state.logs.length > 0 && (
                          <div className="border-t border-zinc-800 px-4 py-3">
                            <LogConsole events={state.logs} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

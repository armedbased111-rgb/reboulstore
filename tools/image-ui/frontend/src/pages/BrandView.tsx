import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRefs } from '../hooks/useRefs'
import { useBatchSSE } from '../hooks/useBatchSSE'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { LogConsole } from '../components/ui/LogConsole'
import { api } from '../api/client'
import { RefStatus, BatchEvent, StatusType } from '../types'
import { Play, Square, ChevronLeft, RefreshCw, Trash2, X } from 'lucide-react'

type Filter = 'all' | StatusType

export function BrandView() {
  const { name } = useParams<{ name: string }>()
  const brandName = decodeURIComponent(name!)
  const { refs, loading, refresh } = useRefs(brandName)
  const [filter, setFilter] = useState<Filter>('all')
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchLogs, setBatchLogs] = useState<BatchEvent[]>([])
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 })
  const [showBatch, setShowBatch] = useState(false)
  const [wipeRunning, setWipeRunning] = useState(false)
  const [wipeLogs, setWipeLogs] = useState<BatchEvent[]>([])
  const [showWipe, setShowWipe] = useState(false)
  const [batch2Running, setBatch2Running] = useState(false)
  const [batch2Logs, setBatch2Logs] = useState<BatchEvent[]>([])
  const [showBatch2, setShowBatch2] = useState(false)
  const [batch3Running, setBatch3Running] = useState(false)
  const [batch3Logs, setBatch3Logs] = useState<BatchEvent[]>([])
  const [showBatch3, setShowBatch3] = useState(false)

  const handleBatchEvent = useCallback((e: BatchEvent) => {
    setBatchLogs(prev => [...prev, e])
    if (e.type === 'ref_done') setBatchProgress({ done: e.done || 0, total: e.total || 0 })
    if (e.type === 'batch_done' || e.type === 'stopped') { setBatchRunning(false); refresh() }
  }, [refresh])

  useBatchSSE(handleBatchEvent, batchRunning)

  const startBatch = async () => {
    setBatchLogs([])
    setBatchRunning(true)
    setShowBatch(true)
    await api.post('/batch/start', { brand: brandName, skip_existing: true })
  }

  const stopBatch = async () => { await api.post('/batch/stop') }

  const startBatch2 = () => {
    if (!window.confirm(`Lancer le Batch 2 sur toutes les images de ${brandName} ?`)) return
    setBatch2Logs([])
    setBatch2Running(true)
    setShowBatch2(true)
    fetch(`/api/batch2/${encodeURIComponent(brandName)}/start`, { method: 'POST' })
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
            if (line.startsWith('data: ')) {
              try {
                const evt: BatchEvent = JSON.parse(line.slice(6))
                setBatch2Logs(prev => [...prev, evt])
                if (evt.type === 'done' || evt.type === 'error') { setBatch2Running(false); refresh() }
              } catch {}
            }
          }
        }
        setBatch2Running(false)
      }).catch(() => setBatch2Running(false))
  }

  const startBatch3 = () => {
    if (!window.confirm(`Lancer le Batch 3 (ombres) sur toutes les images de ${brandName} ?`)) return
    setBatch3Logs([])
    setBatch3Running(true)
    setShowBatch3(true)
    fetch(`/api/batch3/${encodeURIComponent(brandName)}/start`, { method: 'POST' })
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
            if (line.startsWith('data: ')) {
              try {
                const evt: BatchEvent = JSON.parse(line.slice(6))
                setBatch3Logs(prev => [...prev, evt])
                if (evt.type === 'done' || evt.type === 'error') { setBatch3Running(false); refresh() }
              } catch {}
            }
          }
        }
        setBatch3Running(false)
      }).catch(() => setBatch3Running(false))
  }

  const startWipeReupload = () => {
    if (!window.confirm(`Wipe toutes les images Cloudinary de ${brandName} et re-upload ?`)) return
    setWipeLogs([])
    setWipeRunning(true)
    setShowWipe(true)
    fetch(`/api/upload/${encodeURIComponent(brandName)}/wipe-reupload`, { method: 'POST' })
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
            if (line.startsWith('data: ')) {
              try {
                const evt: BatchEvent = JSON.parse(line.slice(6))
                setWipeLogs(prev => [...prev, evt])
                if (evt.type === 'done' || evt.type === 'error') { setWipeRunning(false); refresh() }
              } catch {}
            }
          }
        }
        setWipeRunning(false)
      }).catch(() => setWipeRunning(false))
  }

  const filtered = filter === 'all' ? refs : refs.filter(r => r.status === filter)
  const counts = {
    empty: refs.filter(r => r.status === 'empty').length,
    needs_generation: refs.filter(r => r.status === 'needs_generation').length,
    needs_upload: refs.filter(r => r.status === 'needs_upload').length,
    done: refs.filter(r => r.status === 'done').length,
  }

  const FILTERS: { key: Filter; label: string; count: number; color?: string }[] = [
    { key: 'all',              label: 'Tout',       count: refs.length },
    { key: 'empty',            label: 'À shooter',  count: counts.empty,            color: 'text-zinc-500' },
    { key: 'needs_generation', label: 'À générer',  count: counts.needs_generation, color: 'text-amber-400' },
    { key: 'needs_upload',     label: 'À uploader', count: counts.needs_upload,     color: 'text-orange-400' },
    { key: 'done',             label: 'OK',         count: counts.done,             color: 'text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-8 py-4 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-300 mb-3 transition-colors cursor-pointer">
            <ChevronLeft size={11} />
            Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-zinc-100 tracking-tight">{brandName}</h1>
              <p className="text-xs text-zinc-600 mt-0.5">{refs.length} références</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refresh} className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800">
                <RefreshCw size={14} />
              </button>
              <button
                onClick={startWipeReupload}
                disabled={wipeRunning || batchRunning}
                className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900 px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-30 cursor-pointer"
              >
                <Trash2 size={12} />
                Wipe + Upload
              </button>
              {batchRunning ? (
                <button onClick={stopBatch} className="flex items-center gap-2 text-[11px] font-medium bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg transition-all duration-150 cursor-pointer">
                  <Square size={12} />
                  Stop
                </button>
              ) : (
                <button onClick={startBatch} className="flex items-center gap-2 text-[11px] font-medium bg-white hover:bg-zinc-100 text-black px-4 py-1.5 rounded-lg transition-all duration-150 cursor-pointer">
                  <Play size={12} />
                  Lancer batch
                </button>
              )}
              <button
                onClick={startBatch2}
                disabled={batch2Running || batchRunning || batch3Running}
                className="flex items-center gap-2 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-30 cursor-pointer"
              >
                <Play size={12} />
                Batch 2
              </button>
              <button
                onClick={startBatch3}
                disabled={batch3Running || batchRunning || batch2Running}
                className="flex items-center gap-2 text-[11px] font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-30 cursor-pointer"
              >
                <Play size={12} />
                Batch 3
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6">
        {/* Wipe panel */}
        {showWipe && (
          <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest uppercase text-red-500 font-medium">
                {wipeRunning ? 'Wipe + Re-upload…' : 'Terminé'}
              </span>
              {!wipeRunning && <button onClick={() => setShowWipe(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={14} /></button>}
            </div>
            <LogConsole events={wipeLogs} />
          </div>
        )}

        {/* Batch 3 panel */}
        {showBatch3 && (
          <div className="bg-zinc-900 border border-violet-900/40 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest uppercase text-violet-400 font-medium">
                {batch3Running ? 'Batch 3 — Ombres flat lay…' : 'Batch 3 terminé'}
              </span>
              {!batch3Running && <button onClick={() => setShowBatch3(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={14} /></button>}
            </div>
            <LogConsole events={batch3Logs} />
          </div>
        )}

        {/* Batch 2 panel */}
        {showBatch2 && (
          <div className="bg-zinc-900 border border-indigo-900/40 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest uppercase text-indigo-400 font-medium">
                {batch2Running ? 'Batch 2 — Fond blanc + ombre…' : 'Batch 2 terminé'}
              </span>
              {!batch2Running && <button onClick={() => setShowBatch2(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={14} /></button>}
            </div>
            <LogConsole events={batch2Logs} />
          </div>
        )}

        {/* Batch panel */}
        {showBatch && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">
                {batchRunning ? 'Génération en cours…' : 'Batch terminé'}
              </span>
              {!batchRunning && <button onClick={() => setShowBatch(false)} className="text-zinc-600 hover:text-zinc-300 cursor-pointer"><X size={14} /></button>}
            </div>
            {batchProgress.total > 0 && (
              <div className="mb-3">
                <ProgressBar value={batchProgress.done} total={batchProgress.total} />
                <p className="text-[10px] text-zinc-600 mt-1.5">{batchProgress.done}/{batchProgress.total} refs</p>
              </div>
            )}
            <LogConsole events={batchLogs} />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                filter === f.key
                  ? 'bg-zinc-100 text-black border-zinc-100'
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? 'text-zinc-500' : (f.color || 'text-zinc-600')}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <div className="w-3 h-3 border border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Chargement...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(ref => (
              <RefCard key={ref.name} brandName={brandName} ref_={ref} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function RefCard({ brandName, ref_ }: { brandName: string; ref_: RefStatus }) {
  const firstImage = ref_.images[0]
  const statusDot: Record<string, string> = {
    empty:            'bg-zinc-700',
    needs_generation: 'bg-amber-400',
    needs_upload:     'bg-orange-400',
    done:             'bg-emerald-400',
  }
  return (
    <Link
      to={`/brand/${encodeURIComponent(brandName)}/ref/${encodeURIComponent(ref_.name)}`}
      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200 cursor-pointer block"
    >
      <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
        {firstImage ? (
          <img
            src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(ref_.name)}/${firstImage}`}
            alt={ref_.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-700 text-xs">{ref_.input_photo_count > 0 ? '📷' : '—'}</span>
          </div>
        )}
        {/* Status dot */}
        <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusDot[ref_.status]} ring-2 ring-zinc-900`} />
      </div>
      <div className="px-2.5 py-2.5 space-y-0.5">
        <p className="text-[10px] font-medium text-zinc-200 truncate tracking-wide">{ref_.name}</p>
        {ref_.product_name && (
          <p className="text-[10px] text-zinc-500 truncate leading-tight">{ref_.product_name}</p>
        )}
        {ref_.category && (
          <p className="text-[9px] uppercase tracking-widest text-zinc-700 truncate">{ref_.category}</p>
        )}
      </div>
    </Link>
  )
}

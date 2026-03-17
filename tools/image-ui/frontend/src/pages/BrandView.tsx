import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRefs } from '../hooks/useRefs'
import { useBatchSSE } from '../hooks/useBatchSSE'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { LogConsole } from '../components/ui/LogConsole'
import { api } from '../api/client'
import { RefStatus, BatchEvent, StatusType } from '../types'
<<<<<<< HEAD
import { Play, Square, ChevronLeft, RefreshCw, Trash2, X } from 'lucide-react'
=======
import { Play, Square, ChevronLeft, RefreshCw } from 'lucide-react'
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16

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
<<<<<<< HEAD
  const [wipeRunning, setWipeRunning] = useState(false)
  const [wipeLogs, setWipeLogs] = useState<BatchEvent[]>([])
  const [showWipe, setShowWipe] = useState(false)

  const handleBatchEvent = useCallback((e: BatchEvent) => {
    setBatchLogs(prev => [...prev, e])
    if (e.type === 'ref_done') setBatchProgress({ done: e.done || 0, total: e.total || 0 })
    if (e.type === 'batch_done' || e.type === 'stopped') { setBatchRunning(false); refresh() }
=======

  const handleBatchEvent = useCallback((e: BatchEvent) => {
    setBatchLogs(prev => [...prev, e])
    if (e.type === 'ref_start') {
      setBatchProgress({ done: e.done || 0, total: e.total || 0 })
    }
    if (e.type === 'batch_done' || e.type === 'stopped') {
      setBatchRunning(false)
      refresh()
    }
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
  }, [refresh])

  useBatchSSE(handleBatchEvent, batchRunning)

  const startBatch = async () => {
    setBatchLogs([])
    setBatchRunning(true)
    setShowBatch(true)
<<<<<<< HEAD
    await api.post('/batch/start', { brand: brandName, skip_existing: true })
  }

  const stopBatch = async () => { await api.post('/batch/stop') }

  const startWipeReupload = () => {
    if (!confirm(`Wipe toutes les images Cloudinary de ${brandName} et re-upload ?`)) return
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
=======
    await api.post('/batch/start', {
      brand: brandName,
      skip_existing: true,
    })
  }

  const stopBatch = async () => {
    await api.post('/batch/stop')
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
  }

  const filtered = filter === 'all' ? refs : refs.filter(r => r.status === filter)
  const counts = {
    empty: refs.filter(r => r.status === 'empty').length,
    needs_generation: refs.filter(r => r.status === 'needs_generation').length,
    needs_upload: refs.filter(r => r.status === 'needs_upload').length,
    done: refs.filter(r => r.status === 'done').length,
  }

<<<<<<< HEAD
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
=======
  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'Tout', count: refs.length },
    { key: 'empty', label: 'A shooter', count: counts.empty },
    { key: 'needs_generation', label: 'A generer', count: counts.needs_generation },
    { key: 'needs_upload', label: 'A uploader', count: counts.needs_upload },
    { key: 'done', label: 'Termine', count: counts.done },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-8 py-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-700 mb-3 w-fit">
            <ChevronLeft size={12} />
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
            Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
<<<<<<< HEAD
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
=======
              <h1 className="text-sm tracking-widest uppercase text-stone-900 font-medium">{brandName}</h1>
              <p className="text-xs text-stone-400 mt-0.5">{refs.length} refs</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                className="p-2 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <RefreshCw size={15} />
              </button>
              {batchRunning ? (
                <button
                  onClick={stopBatch}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
                >
                  <Square size={13} />
                  Stop
                </button>
              ) : (
                <button
                  onClick={startBatch}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase bg-stone-900 text-white px-4 py-2 hover:bg-stone-700 transition-colors"
                >
                  <Play size={13} />
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
                  Lancer batch
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
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
=======
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Batch panel */}
        {showBatch && (
          <div className="bg-white border border-stone-200 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-widest uppercase text-stone-500">
                {batchRunning ? 'Generation en cours...' : 'Batch termine'}
              </span>
              {!batchRunning && (
                <button onClick={() => setShowBatch(false)} className="text-xs text-stone-400 hover:text-stone-700">
                  Fermer
                </button>
              )}
            </div>
            {batchProgress.total > 0 && (
              <ProgressBar value={batchProgress.done} total={batchProgress.total} className="mb-3" />
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
            )}
            <LogConsole events={batchLogs} />
          </div>
        )}

        {/* Filters */}
<<<<<<< HEAD
        <div className="flex gap-1.5 mb-6 flex-wrap">
=======
        <div className="flex gap-2 mb-6 flex-wrap">
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
<<<<<<< HEAD
              className={`text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                filter === f.key
                  ? 'bg-zinc-100 text-black border-zinc-100'
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? 'text-zinc-500' : (f.color || 'text-zinc-600')}`}>{f.count}</span>
=======
              className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                filter === f.key
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {f.label} ({f.count})
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
            </button>
          ))}
        </div>

        {loading ? (
<<<<<<< HEAD
          <div className="flex items-center gap-2 text-zinc-600 text-xs">
            <div className="w-3 h-3 border border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            Chargement...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
=======
          <p className="text-xs tracking-widest uppercase text-stone-400">Chargement...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
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
<<<<<<< HEAD
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
=======
  return (
    <Link
      to={`/brand/${encodeURIComponent(brandName)}/ref/${encodeURIComponent(ref_.name)}`}
      className="bg-white border border-stone-200 hover:border-stone-400 transition-colors overflow-hidden block group"
    >
      <div className="aspect-[3/4] bg-stone-50 overflow-hidden">
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
        {firstImage ? (
          <img
            src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(ref_.name)}/${firstImage}`}
            alt={ref_.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
<<<<<<< HEAD
            <span className="text-zinc-700 text-xs">{ref_.input_photo_count > 0 ? '📷' : '—'}</span>
          </div>
        )}
        {/* Status dot */}
        <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusDot[ref_.status]} ring-2 ring-zinc-900`} />
      </div>
      <div className="px-2.5 py-2.5 space-y-0.5">
        <p className="text-[10px] font-medium text-zinc-200 truncate tracking-wide">{ref_.name}</p>
        {ref_.product_name && (
          <p className="text-[10px] text-zinc-500 truncate leading-tight">{ref_.product_name.replace(/^.+?\s/, '')}</p>
        )}
        {ref_.category && (
          <p className="text-[9px] uppercase tracking-widest text-zinc-700 truncate">{ref_.category}</p>
        )}
=======
            <span className="text-stone-300 text-xs">{ref_.input_photo_count > 0 ? 'photo' : '-'}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[10px] tracking-wider uppercase text-stone-700 font-medium truncate mb-1.5">{ref_.name}</p>
        <StatusBadge status={ref_.status} />
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
      </div>
    </Link>
  )
}

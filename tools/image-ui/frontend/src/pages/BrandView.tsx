import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRefs } from '../hooks/useRefs'
import { useBatchSSE } from '../hooks/useBatchSSE'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { LogConsole } from '../components/ui/LogConsole'
import { api } from '../api/client'
import { RefStatus, BatchEvent, StatusType } from '../types'
import { Play, Square, ChevronLeft, RefreshCw } from 'lucide-react'

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

  const handleBatchEvent = useCallback((e: BatchEvent) => {
    setBatchLogs(prev => [...prev, e])
    if (e.type === 'ref_start') {
      setBatchProgress({ done: e.done || 0, total: e.total || 0 })
    }
    if (e.type === 'batch_done' || e.type === 'stopped') {
      setBatchRunning(false)
      refresh()
    }
  }, [refresh])

  useBatchSSE(handleBatchEvent, batchRunning)

  const startBatch = async () => {
    setBatchLogs([])
    setBatchRunning(true)
    setShowBatch(true)
    await api.post('/batch/start', {
      brand: brandName,
      skip_existing: true,
    })
  }

  const stopBatch = async () => {
    await api.post('/batch/stop')
  }

  const filtered = filter === 'all' ? refs : refs.filter(r => r.status === filter)
  const counts = {
    empty: refs.filter(r => r.status === 'empty').length,
    needs_generation: refs.filter(r => r.status === 'needs_generation').length,
    needs_upload: refs.filter(r => r.status === 'needs_upload').length,
    done: refs.filter(r => r.status === 'done').length,
  }

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
            Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
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
                  Lancer batch
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

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
            )}
            <LogConsole events={batchLogs} />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                filter === f.key
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-xs tracking-widest uppercase text-stone-400">Chargement...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
  return (
    <Link
      to={`/brand/${encodeURIComponent(brandName)}/ref/${encodeURIComponent(ref_.name)}`}
      className="bg-white border border-stone-200 hover:border-stone-400 transition-colors overflow-hidden block group"
    >
      <div className="aspect-[3/4] bg-stone-50 overflow-hidden">
        {firstImage ? (
          <img
            src={`/api/images/${encodeURIComponent(brandName)}/${encodeURIComponent(ref_.name)}/${firstImage}`}
            alt={ref_.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-stone-300 text-xs">{ref_.input_photo_count > 0 ? 'photo' : '-'}</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[10px] tracking-wider uppercase text-stone-700 font-medium truncate mb-1.5">{ref_.name}</p>
        <StatusBadge status={ref_.status} />
      </div>
    </Link>
  )
}

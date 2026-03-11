import { useEffect, useRef } from 'react'
import { BatchEvent } from '../../types'

const EVENT_STYLES: Record<string, string> = {
  ref_start:   'text-blue-400',
  ref_done:    'text-green-400',
  ref_skipped: 'text-stone-500',
  ref_error:   'text-red-400',
  log:         'text-stone-300',
  batch_done:  'text-green-300 font-medium',
  stopped:     'text-orange-400',
  error:       'text-red-400 font-medium',
}

function formatEvent(e: BatchEvent): string {
  if (e.type === 'ref_start') return `[${e.index}/${e.total}] > ${e.ref}`
  if (e.type === 'ref_done') return `[${e.index}/${e.total}] OK ${e.ref} ${e.success ? '' : '(echec)'}`
  if (e.type === 'ref_skipped') return `[${e.index}/${e.total}] - ${e.ref} (existant, skippe)`
  if (e.type === 'ref_error') return `X ${e.ref}: ${e.error}`
  if (e.type === 'log') return `  ${e.ref}: ${e.message}`
  if (e.type === 'batch_done') return `\nBatch termine`
  if (e.type === 'stopped') return `! ${e.message}`
  return e.message || e.type
}

export function LogConsole({ events }: { events: BatchEvent[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [events])

  return (
    <div ref={ref} className="bg-stone-950 rounded p-3 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
      {events.length === 0 && (
        <span className="text-stone-600">En attente du batch...</span>
      )}
      {events.map((e, i) => (
        <div key={i} className={EVENT_STYLES[e.type] || 'text-stone-400'}>
          {formatEvent(e)}
        </div>
      ))}
    </div>
  )
}

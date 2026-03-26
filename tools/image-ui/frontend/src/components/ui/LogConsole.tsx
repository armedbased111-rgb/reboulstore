import { useEffect, useRef } from 'react'
import { BatchEvent } from '../../types'

const EVENT_COLOR: Record<string, string> = {
  ref_start:    'text-zinc-300',
  ref_done:     'text-emerald-400',
  ref_skipped:  'text-zinc-600',
  ref_error:    'text-red-400',
  log:          'text-zinc-500',
  batch_done:   'text-emerald-300',
  stopped:      'text-amber-400',
  error:        'text-red-400',
  done:         'text-emerald-400',
  upload_start: 'text-zinc-300',
  upload_done:  'text-emerald-400',
}

function formatEvent(e: BatchEvent): string {
  if (e.type === 'ref_start')    return `❯ [${e.index}/${e.total}] ${e.ref}`
  if (e.type === 'ref_done')     return `✓ [${e.index}/${e.total}] ${e.ref}${e.success ? '' : ' (échec)'}`
  if (e.type === 'ref_skipped')  return `— [${e.index}/${e.total}] ${e.ref} skipped`
  if (e.type === 'ref_error')    return `✗ ${e.ref}: ${e.error}`
  if (e.type === 'log')          return `  ${e.ref ? e.ref + ': ' : ''}${e.message}`
  if (e.type === 'batch_done')   return `\n✓ Batch terminé`
  if (e.type === 'stopped')      return `⏹ ${e.message}`
  if (e.type === 'done')         return e.success ? `✓ ${e.output || 'Succès'}` : `✗ Échec`
  if (e.type === 'upload_start') return `↑ [${e.index}/${e.total}] ${e.ref}`
  if (e.type === 'upload_done')  return `${e.success ? '✓' : '✗'} ${e.ref}`
  return e.message || e.type
}

export function LogConsole({ events }: { events: BatchEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [events])

  return (
    <div
      ref={containerRef}
      className="bg-black border border-zinc-800/60 rounded-lg p-3 h-44 overflow-y-auto"
      style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: '1.6' }}
    >
      {events.length === 0 ? (
        <span className="text-zinc-700">En attente...</span>
      ) : (
        events.map((e, i) => (
          <div key={i} className={EVENT_COLOR[e.type] || 'text-zinc-500'}>
            {formatEvent(e)}
          </div>
        ))
      )}
    </div>
  )
}

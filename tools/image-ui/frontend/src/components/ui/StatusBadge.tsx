import { StatusType } from '../../types'

const CONFIG: Record<StatusType, { dot: string; text: string; bg: string; label: string }> = {
  empty:            { dot: 'bg-zinc-600',    text: 'text-zinc-500',   bg: 'bg-zinc-800/50',       label: 'À shooter' },
  needs_generation: { dot: 'bg-amber-400',   text: 'text-amber-400',  bg: 'bg-amber-950/40',      label: 'À générer' },
  needs_upload:     { dot: 'bg-orange-400',  text: 'text-orange-400', bg: 'bg-orange-950/40',     label: 'À uploader' },
  done:             { dot: 'bg-emerald-400', text: 'text-emerald-400',bg: 'bg-emerald-950/40',    label: 'Terminé' },
}

export function StatusBadge({ status }: { status: StatusType }) {
  const c = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'needs_generation' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

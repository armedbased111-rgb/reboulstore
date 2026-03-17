import { StatusType } from '../../types'

<<<<<<< HEAD
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
=======
const STYLES: Record<StatusType, string> = {
  empty:            'bg-stone-100 text-stone-400 border border-stone-200',
  needs_generation: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  needs_upload:     'bg-orange-50 text-orange-700 border border-orange-200',
  done:             'bg-green-50 text-green-700 border border-green-200',
}

const LABELS: Record<StatusType, string> = {
  empty:            'Photos manquantes',
  needs_generation: 'A generer',
  needs_upload:     'A uploader',
  done:             'Termine',
}

const DOTS: Record<StatusType, string> = {
  empty:            'bg-stone-300',
  needs_generation: 'bg-yellow-400',
  needs_upload:     'bg-orange-400',
  done:             'bg-green-500',
}

export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase font-medium ${STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOTS[status]}`} />
      {LABELS[status]}
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
    </span>
  )
}

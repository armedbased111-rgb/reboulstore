import { StatusType } from '../../types'

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
    </span>
  )
}

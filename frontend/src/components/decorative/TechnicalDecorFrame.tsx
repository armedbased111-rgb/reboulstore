import { cn } from '../../lib/utils'

export type TechnicalCorner = 'tl' | 'tr' | 'bl' | 'br'

type TechnicalDecorFrameProps = {
  className?: string
  /** Ligne type datasheet — très discrète */
  datum?: string
  /** Classes Tailwind pour positionner le datum (ex. mobile vs desktop) */
  datumClassName?: string
  /** Coins sans repère (ex. `['tr']` pour ne pas chevaucher un bouton fermer) */
  omitCorners?: TechnicalCorner[]
  /** Marge intérieure des repères (éloigner logo / bords arrondis) — défaut `inset-4 sm:inset-5` */
  insetClassName?: string
  /** Traits milieu gauche / droite (désactiver si seuls 2 coins suffisent) */
  sideTicks?: boolean
}

/**
 * Repères techniques discrets : équerres, micro-crosshairs, ticks latéraux, métadonnée optionnelle.
 * `pointer-events-none` + `aria-hidden` — purement décoratif.
 */
export function TechnicalDecorFrame({
  className,
  datum,
  datumClassName,
  omitCorners = [],
  insetClassName,
  sideTicks = true,
}: TechnicalDecorFrameProps) {
  const edge = 'border-black/25'
  const omit = new Set(omitCorners)
  const inset = insetClassName ?? 'inset-4 sm:inset-5'

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-[2] rounded-[inherit]', className)}
      aria-hidden
    >
      <div className={cn('absolute', inset)}>
        {!omit.has('tl') ? (
          <div className={cn('absolute left-0 top-0 size-3 border-l border-t', edge)} />
        ) : null}
        {!omit.has('tr') ? (
          <div className={cn('absolute right-0 top-0 size-3 border-r border-t', edge)} />
        ) : null}
        {!omit.has('bl') ? (
          <div className={cn('absolute bottom-0 left-0 size-3 border-b border-l', edge)} />
        ) : null}
        {!omit.has('br') ? (
          <div className={cn('absolute bottom-0 right-0 size-3 border-b border-r', edge)} />
        ) : null}

        {!omit.has('tl') ? (
          <div className="absolute left-0 top-0 font-mono text-[9px] leading-none text-black/20 select-none">+</div>
        ) : null}
        {!omit.has('tr') ? (
          <div className="absolute right-0 top-0 translate-x-px font-mono text-[9px] leading-none text-black/20 select-none">
            +
          </div>
        ) : null}
        {!omit.has('bl') ? (
          <div className="absolute bottom-0 left-0 translate-y-px font-mono text-[9px] leading-none text-black/20 select-none">
            +
          </div>
        ) : null}
        {!omit.has('br') ? (
          <div className="absolute bottom-0 right-0 translate-x-px translate-y-px font-mono text-[9px] leading-none text-black/20 select-none">
            +
          </div>
        ) : null}

        {sideTicks ? (
          <>
            <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-black/15" />
            <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-black/15" />
          </>
        ) : null}
      </div>

      {datum ? (
        <p
          className={cn(
            'absolute max-w-[min(70%,16rem)] truncate font-mono text-[8px] uppercase tracking-[0.18em] text-black/30',
            datumClassName ??
              'bottom-3 left-4 sm:bottom-4 sm:left-5 md:max-w-[70%]',
          )}
          title={datum}
        >
          {datum}
        </p>
      ) : null}
    </div>
  )
}

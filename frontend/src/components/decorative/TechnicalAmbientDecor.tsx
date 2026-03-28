import { HOME_HERO_DECOR } from '../../copy/homeHeroDecor'

/**
 * Repères techniques discrets : header, mégamenus, hero home.
 * Tout est pointer-events-none + aria-hidden.
 */

export function HeaderBarDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/[0.08]" />
      <div className="absolute left-12 top-1/2 flex -translate-y-1/2 items-center gap-0.5 md:left-2.5">
        <span className="font-mono text-[8px] leading-none text-black/25">+</span>
        <span className="h-2 w-px bg-black/20" />
      </div>
    </div>
  )
}

type MegaMenuDecorProps = {
  channel: 'CAT' | 'BRD'
}

export function MegaMenuDecor({ channel }: MegaMenuDecorProps) {
  const tag = channel === 'CAT' ? 'MENU // CAT' : 'MENU // BRD'
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      <div className="absolute inset-2 sm:inset-3">
        <div className="absolute left-0 top-0 size-2.5 border-l border-t border-black/18" />
        <span className="absolute left-[3px] top-[3px] font-mono text-[6px] leading-none text-black/18">+</span>
        <div className="absolute bottom-0 right-0 size-2.5 border-b border-r border-black/18" />
        <span className="absolute bottom-[3px] right-[3px] font-mono text-[6px] leading-none text-black/18">+</span>
        <span className="absolute right-3 top-2 font-mono text-[7px] uppercase tracking-[0.2em] text-black/22">{tag}</span>
      </div>
    </div>
  )
}

const heroEdgeDatum =
  'font-mono text-[5px] uppercase tracking-[0.2em] text-white/26 sm:text-[6px] sm:tracking-[0.22em]'

/** Hero accueil : coins + même fil `HOME_HERO_DECOR.edge` sur les 4 bords. */
export function HeroSectionDecor() {
  const fill = HOME_HERO_DECOR.edge
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <div className="absolute inset-3 sm:inset-4 md:inset-5">
        <div className="absolute left-0 top-0 size-2.5 border-l border-t border-white/22" />
        <span className="absolute left-[2px] top-[2px] font-mono text-[6px] leading-none text-white/35">+</span>
        <div className="absolute right-0 top-0 size-2.5 border-r border-t border-white/22" />
        <span className="absolute right-[2px] top-[2px] font-mono text-[6px] leading-none text-white/35">+</span>
        <div className="absolute bottom-0 left-0 size-2.5 border-b border-l border-white/22" />
        <span className="absolute bottom-[2px] left-[2px] font-mono text-[6px] leading-none text-white/35">+</span>
        <div className="absolute bottom-0 right-0 size-2.5 border-b border-r border-white/22" />
        <span className="absolute bottom-[2px] right-[2px] font-mono text-[6px] leading-none text-white/35">+</span>

        <span
          className={`absolute left-1/2 top-2 ${heroEdgeDatum} block max-w-[min(88%,16rem)] -translate-x-1/2 truncate text-center whitespace-nowrap`}
          title={fill}
        >
          {fill}
        </span>
        <span
          className={`absolute left-1/2 bottom-2 ${heroEdgeDatum} block max-w-[min(88%,16rem)] -translate-x-1/2 truncate text-center whitespace-nowrap`}
          title={fill}
        >
          {fill}
        </span>
        <span
          className={`absolute left-2 top-1/2 ${heroEdgeDatum} inline-block max-w-[min(11rem,48vw)] truncate whitespace-nowrap`}
          style={{ transform: 'translateY(-50%) rotate(-90deg)' }}
          title={fill}
        >
          {fill}
        </span>
        <span
          className={`absolute right-2 top-1/2 ${heroEdgeDatum} inline-block max-w-[min(11rem,48vw)] truncate whitespace-nowrap`}
          style={{ transform: 'translateY(-50%) rotate(90deg)' }}
          title={fill}
        >
          {fill}
        </span>
      </div>
    </div>
  )
}

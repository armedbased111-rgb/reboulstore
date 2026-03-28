/**
 * Repères discrets sur la vignette catalogue (coins + fil type fiche).
 * `pointer-events-none` + `aria-hidden`.
 */
export function ProductCardFigureDecor({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[15]" aria-hidden>
      <div className="absolute left-0 top-0 size-[7px] border-l border-t border-black/14" />
      <span className="absolute left-px top-px font-mono text-[6px] leading-none text-black/22">+</span>
      <div className="absolute bottom-0 right-0 size-[7px] border-b border-r border-black/14" />
      <span className="absolute bottom-px right-px font-mono text-[6px] leading-none text-black/22">+</span>
      <span className="absolute bottom-1 left-1 max-w-[62%] truncate font-mono text-[6px] uppercase tracking-[0.12em] text-black/22 sm:bottom-1.5 sm:left-1.5 sm:text-[7px] sm:tracking-[0.14em]">
        {label}
      </span>
    </div>
  )
}

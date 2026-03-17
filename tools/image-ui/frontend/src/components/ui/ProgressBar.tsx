export function ProgressBar({ value, total, className = '' }: { value: number; total: number; className?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-zinc-800 h-px rounded-full overflow-hidden">
        <div
          className="h-px bg-white transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

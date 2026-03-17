export function ProgressBar({ value, total, className = '' }: { value: number; total: number; className?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={`w-full bg-stone-100 rounded-full h-1.5 ${className}`}>
      <div
        className="bg-stone-900 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

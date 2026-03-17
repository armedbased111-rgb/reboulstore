export function ProgressBar({ value, total, className = '' }: { value: number; total: number; className?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
<<<<<<< HEAD
    <div className={`w-full ${className}`}>
      <div className="w-full bg-zinc-800 h-px rounded-full overflow-hidden">
        <div
          className="h-px bg-white transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
=======
    <div className={`w-full bg-stone-100 rounded-full h-1.5 ${className}`}>
      <div
        className="bg-stone-900 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
    </div>
  )
}

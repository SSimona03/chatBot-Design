interface ScoreCardProps {
  label: string
  score: number
}

export function ScoreCard({ label, score }: ScoreCardProps) {
  return (
    <div className="score-card">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
        <strong className="text-xl text-[var(--ink)]">{score}<span className="text-sm font-medium text-[var(--muted)]">/100</span></strong>
      </div>
      <div aria-label={`${label}: ${score} out of 100`} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="img">
        <span className="block h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
    </div>
  )
}

import { getReviewCounts } from '../../getters/reviewGetters'
import type { Review } from '../../types/review'

export function ReviewProgress({ review }: { review: Review | null }) {
  if (!review) {
    return (
      <aside className="progress-panel" aria-labelledby="progress-heading">
        <h2 className="text-sm font-semibold text-[var(--ink)]" id="progress-heading">Review progress</h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Findings and progress will appear after your first AI review.
        </p>
      </aside>
    )
  }

  const findings = review.findings
  const counts = getReviewCounts(findings)
  const items = [
    ['High severity', counts.high],
    ['Open', counts.open],
    ['Needs verification', counts.verification],
    ['Fixed', counts.fixed],
    ['Accepted risk', counts.acceptedRisk],
  ]

  const jumpToFindings = () => {
    const findings = document.getElementById(`findings-${review.id}`)
    findings?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    findings?.focus({ preventScroll: true })
  }

  return (
    <aside className="progress-panel" aria-labelledby="progress-heading">
      <h2 className="text-sm font-semibold text-[var(--ink)]" id="progress-heading">Review progress</h2>
      <button
        aria-label={`View the latest review with ${findings.length} findings`}
        className="mt-4 w-full rounded-xl bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100"
        onClick={jumpToFindings}
        type="button"
      >
        <p className="text-3xl font-bold text-[var(--primary)]">{counts.resolved}<span className="text-base font-medium text-blue-700">/{findings.length}</span></p>
        <p className="mt-1 text-xs font-medium text-blue-800">findings resolved</p>
        <p className="mt-3 text-xs font-semibold text-[var(--primary)]">View latest review →</p>
      </button>
      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[var(--soft)] p-3">
          <dt className="text-xs text-[var(--muted)]">Accessibility</dt>
          <dd className="mt-1 font-semibold text-[var(--ink)]">{review.accessibilityScore}<span className="text-xs font-normal text-[var(--muted)]">/100</span></dd>
        </div>
        <div className="rounded-lg bg-[var(--soft)] p-3">
          <dt className="text-xs text-[var(--muted)]">Edge cases</dt>
          <dd className="mt-1 font-semibold text-[var(--ink)]">{review.edgeCaseScore}<span className="text-xs font-normal text-[var(--muted)]">/100</span></dd>
        </div>
      </dl>
      <dl className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div className="flex items-center justify-between gap-3 text-sm" key={label}>
            <dt className="text-[var(--muted)]">{label}</dt>
            <dd className="font-semibold text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

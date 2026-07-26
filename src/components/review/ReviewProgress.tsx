import { getReviewCounts } from '../../getters/reviewGetters'
import type { Finding } from '../../types/review'
import { Icon } from '../icons/Icon'

export function ReviewProgress({ findings }: { findings: Finding[] }) {
  const counts = getReviewCounts(findings)
  const items = [
    ['High severity', counts.high],
    ['Open', counts.open],
    ['Needs verification', counts.verification],
    ['Fixed', counts.fixed],
    ['Accepted risk', counts.acceptedRisk],
  ]

  return (
    <aside className="progress-panel" aria-labelledby="progress-heading">
      <h2 className="text-sm font-semibold text-[var(--ink)]" id="progress-heading">Review progress</h2>
      <div className="mt-4 rounded-xl bg-blue-50 p-4">
        <p className="text-3xl font-bold text-[var(--primary)]">{counts.resolved}<span className="text-base font-medium text-blue-700">/{findings.length}</span></p>
        <p className="mt-1 text-xs font-medium text-blue-800">findings resolved</p>
      </div>
      <dl className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div className="flex items-center justify-between gap-3 text-sm" key={label}>
            <dt className="text-[var(--muted)]">{label}</dt>
            <dd className="font-semibold text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
      <button className="secondary-button mt-6 w-full justify-center">
        <Icon name="upload" /> Upload revision
      </button>
    </aside>
  )
}

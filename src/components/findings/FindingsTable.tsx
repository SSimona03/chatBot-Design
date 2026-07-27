import { useState } from 'react'
import { getFilteredFindings } from '../../getters/reviewGetters'
import type {
  Finding,
  FindingFilter,
  FindingStatus,
} from '../../types/review'
import { FindingRow } from './FindingRow'

interface FindingsTableProps {
  findings: Finding[]
  onFindingChange: (findingId: string, updates: Partial<Finding>) => void
}

const filters: { label: string; value: FindingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Accessibility', value: 'accessibility' },
  { label: 'Edge cases', value: 'edge-case' },
]

export function FindingsTable({
  findings,
  onFindingChange,
}: FindingsTableProps) {
  const [filter, setFilter] = useState<FindingFilter>('all')
  const [expandedIds, setExpandedIds] = useState<string[]>([findings[0]?.id])
  const visibleFindings = getFilteredFindings(findings, filter)

  const toggleFinding = (findingId: string) => {
    setExpandedIds((currentIds) =>
      currentIds.includes(findingId)
        ? currentIds.filter((id) => id !== findingId)
        : [...currentIds, findingId],
    )
  }

  return (
    <section aria-labelledby="findings-heading" className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]" id="findings-heading">Findings</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{findings.length} items found</p>
        </div>
        <div aria-label="Filter findings" className="filter-tabs" role="group">
          {filters.map((item) => (
            <button
              aria-pressed={filter === item.value}
              className={filter === item.value ? 'filter-tab-active' : 'filter-tab'}
              key={item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
        <div className="hidden grid-cols-[6rem_minmax(12rem,1fr)_12rem_2rem] gap-3 bg-[var(--soft)] px-4 py-2 text-xs font-semibold text-[var(--muted)] md:grid">
          <span>ID / severity</span>
          <span>Finding</span>
          <span>Status</span>
          <span />
        </div>
        <ul>
          {visibleFindings.map((finding) => (
            <FindingRow
              finding={finding}
              isExpanded={expandedIds.includes(finding.id)}
              key={finding.id}
              onAddNote={(decisionNote) => onFindingChange(finding.id, { decisionNote })}
              onStatusChange={(status: FindingStatus) => onFindingChange(finding.id, { status })}
              onToggle={() => toggleFinding(finding.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

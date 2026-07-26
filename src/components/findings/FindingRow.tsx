import { formatLabel } from '../../helpers/text'
import type { Finding, FindingStatus } from '../../types/review'
import { Icon } from '../icons/Icon'
import { StatusBadge } from './StatusBadge'

interface FindingRowProps {
  finding: Finding
  isExpanded: boolean
  onAddNote: (note: string) => void
  onStatusChange: (status: FindingStatus) => void
  onToggle: () => void
}

const statuses: FindingStatus[] = [
  'open',
  'fixed',
  'accepted-risk',
  'not-applicable',
  'needs-verification',
]

export function FindingRow({
  finding,
  isExpanded,
  onAddNote,
  onStatusChange,
  onToggle,
}: FindingRowProps) {
  return (
    <li className="finding-row">
      <div className="grid gap-3 px-4 py-4 md:grid-cols-[6rem_1fr_7rem_11rem_2rem] md:items-center">
        <div>
          <span className="text-xs font-semibold text-[var(--muted)]">{finding.id}</span>
          <span className={`severity severity-${finding.severity}`}>{formatLabel(finding.severity)}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--ink)]">{finding.title}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{formatLabel(finding.category)}</p>
        </div>
        <div className="md:justify-self-start">
          <span className="md:hidden field-label">Current status</span>
          <StatusBadge status={finding.status} />
        </div>
        <label>
          <span className="sr-only">Change status for {finding.title}</span>
          <select
            className="select-input w-full"
            onChange={(event) => onStatusChange(event.target.value as FindingStatus)}
            value={finding.status}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{formatLabel(status)}</option>
            ))}
          </select>
        </label>
        <button
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${finding.title}`}
          className="icon-button justify-self-end"
          onClick={onToggle}
        >
          <Icon className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} name="chevron" />
        </button>
      </div>
      {isExpanded && (
        <div className="border-t border-[var(--border)] bg-[var(--soft)] px-4 py-5">
          <dl className="grid gap-5 lg:grid-cols-2">
            <div>
              <dt className="detail-label">Visible evidence</dt>
              <dd className="detail-copy">{finding.evidence}</dd>
            </div>
            <div>
              <dt className="detail-label">Recommendation</dt>
              <dd className="detail-copy">{finding.recommendation}</dd>
            </div>
            {finding.reference && (
              <div>
                <dt className="detail-label">Reference</dt>
                <dd className="detail-copy">{finding.reference}</dd>
              </div>
            )}
            <div>
              <label className="detail-label" htmlFor={`note-${finding.id}`}>Decision note</label>
              <textarea
                className="text-input mt-2 min-h-20 resize-y"
                id={`note-${finding.id}`}
                onBlur={(event) => onAddNote(event.target.value)}
                placeholder="Add context for this decision"
                defaultValue={finding.decisionNote}
              />
            </div>
          </dl>
        </div>
      )}
    </li>
  )
}

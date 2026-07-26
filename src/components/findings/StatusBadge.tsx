import { formatLabel } from '../../helpers/text'
import type { FindingStatus } from '../../types/review'
import { Icon, type IconName } from '../icons/Icon'

const statusIcons: Record<FindingStatus, IconName> = {
  open: 'minus',
  fixed: 'check',
  'accepted-risk': 'alert',
  'not-applicable': 'close',
  'needs-verification': 'clock',
}

export function StatusBadge({ status }: { status: FindingStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      <Icon name={statusIcons[status]} size={14} />
      {formatLabel(status)}
    </span>
  )
}

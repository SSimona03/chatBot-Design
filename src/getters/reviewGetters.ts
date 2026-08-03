import type {
  Finding,
  FindingFilter,
  FindingStatus,
} from '../types/review'

const resolvedStatuses: FindingStatus[] = [
  'fixed',
  'accepted-risk',
  'not-applicable',
]

export function getFilteredFindings(
  findings: Finding[],
  filter: FindingFilter,
) {
  if (filter === 'all') {
    return findings
  }

  return findings.filter((finding) => finding.category === filter)
}

export function getReviewCounts(findings: Finding[]) {
  const countStatus = (status: FindingStatus) =>
    findings.filter((finding) => finding.status === status).length

  return {
    resolved: findings.filter((finding) =>
      resolvedStatuses.includes(finding.status),
    ).length,
    high: findings.filter((finding) => finding.severity === 'high').length,
    open: countStatus('open'),
    verification: countStatus('needs-verification'),
    fixed: countStatus('fixed'),
    acceptedRisk: countStatus('accepted-risk'),
  }
}

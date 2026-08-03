export type FindingCategory = 'accessibility' | 'edge-case'
export type FindingSeverity = 'high' | 'medium' | 'low'
export type FindingStatus =
  | 'open'
  | 'fixed'
  | 'accepted-risk'
  | 'not-applicable'
  | 'needs-verification'

export interface Chat {
  id: string
  title: string
  updatedAt: string
  imageCount: number
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  file: File
  previewUrl: string
}

export interface Finding {
  id: string
  category: FindingCategory
  title: string
  severity: FindingSeverity
  evidence: string
  recommendation: string
  reference?: string
  status: FindingStatus
  decisionNote?: string
}

export interface Review {
  id: string
  summary: string
  accessibilityScore: number
  edgeCaseScore: number
  findings: Finding[]
}

export interface ReportAnswer {
  summary: string
  actions: Array<{
    title: string
    details: string
    findingIds: string[]
  }>
  evidenceNeeded: string[]
}

export type FindingFilter = 'all' | FindingCategory
export type ReviewMode = 'full' | 'accessibility' | 'edge-cases'

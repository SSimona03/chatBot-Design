import type { Attachment, ReportAnswer, Review, ReviewMode } from '../types/review'

interface ResponseMeta {
  requestId: string
  model: string
}

interface ReviewResponse {
  kind: 'review'
  review: Review
  meta: ResponseMeta
}

interface AnswerResponse {
  kind: 'answer'
  answer: ReportAnswer
  meta: ResponseMeta
}

export type ReviewApiResponse = ReviewResponse | AnswerResponse

interface SubmitReviewInput {
  message: string
  mode: ReviewMode
  attachments: Attachment[]
  previousReview: Review | null
  signal: AbortSignal
}

interface ErrorResponse {
  error?: {
    message?: string
  }
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false
  const review = value as Partial<Review>
  return typeof review.id === 'string'
    && typeof review.summary === 'string'
    && typeof review.accessibilityScore === 'number'
    && typeof review.edgeCaseScore === 'number'
    && Array.isArray(review.findings)
    && review.findings.every((finding) => (
      finding
      && typeof finding.id === 'string'
      && typeof finding.title === 'string'
      && typeof finding.evidence === 'string'
      && typeof finding.recommendation === 'string'
      && ['accessibility', 'edge-case'].includes(finding.category)
      && ['high', 'medium', 'low'].includes(finding.severity)
      && ['open', 'needs-verification'].includes(finding.status)
    ))
}

function isReportAnswer(value: unknown): value is ReportAnswer {
  if (!value || typeof value !== 'object') return false
  const answer = value as Partial<ReportAnswer>
  return typeof answer.summary === 'string'
    && Array.isArray(answer.actions)
    && answer.actions.every((action) => (
      action
      && typeof action.title === 'string'
      && typeof action.details === 'string'
      && Array.isArray(action.findingIds)
      && action.findingIds.every((id) => typeof id === 'string')
    ))
    && Array.isArray(answer.evidenceNeeded)
    && answer.evidenceNeeded.every((item) => typeof item === 'string')
}

export async function submitReview(input: SubmitReviewInput): Promise<ReviewApiResponse> {
  const form = new FormData()
  form.append('message', input.message)
  form.append('mode', input.mode)
  if (input.previousReview) {
    form.append('previousReview', JSON.stringify(input.previousReview))
  }
  input.attachments.forEach((attachment) => {
    form.append('images', attachment.file, attachment.name)
  })

  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: form,
    signal: input.signal,
  })

  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = (data as ErrorResponse | null)?.error?.message
    throw new Error(message || 'The review could not be completed. Please try again.')
  }

  const result = data as {
    kind?: unknown
    review?: unknown
    answer?: unknown
    meta?: { requestId?: unknown }
  } | null
  const validMeta = result?.meta && typeof result.meta.requestId === 'string'
  const validReview = result?.kind === 'review' && isReview(result.review)
  const validAnswer = result?.kind === 'answer' && isReportAnswer(result.answer)
  if (!result || !validMeta || (!validReview && !validAnswer)) {
    throw new Error('The server returned an invalid review. Please try again.')
  }

  return result as ReviewApiResponse
}

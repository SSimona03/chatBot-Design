import { z } from 'zod'

export const reviewModeSchema = z.enum([
  'full',
  'accessibility',
  'edge-cases',
])

const findingCategorySchema = z.enum(['accessibility', 'edge-case'])
const findingSeveritySchema = z.enum(['high', 'medium', 'low'])
const findingStatusSchema = z.enum([
  'open',
  'fixed',
  'accepted-risk',
  'not-applicable',
  'needs-verification',
])

export const modelReviewSchema = z.strictObject({
  summary: z.string().trim().min(1).max(1_500),
  accessibilityScore: z.number().int().min(0).max(100),
  edgeCaseScore: z.number().int().min(0).max(100),
  findings: z.array(z.strictObject({
    category: findingCategorySchema,
    title: z.string().trim().min(1).max(180),
    severity: findingSeveritySchema,
    evidence: z.string().trim().min(1).max(1_000),
    recommendation: z.string().trim().min(1).max(1_000),
    reference: z.string().trim().max(300).optional(),
    status: z.enum(['open', 'needs-verification']),
  })).max(12),
})

export const reviewSchema = modelReviewSchema.extend({
  id: z.string().uuid(),
  findings: z.array(modelReviewSchema.shape.findings.element.extend({
    id: z.string().min(1).max(20),
    status: findingStatusSchema,
    decisionNote: z.string().max(1_000).optional(),
  })).max(12),
})

export const previousReviewSchema = reviewSchema.pick({
  summary: true,
  accessibilityScore: true,
  edgeCaseScore: true,
  findings: true,
})

export type ModelReview = z.infer<typeof modelReviewSchema>
export type PreviousReview = z.infer<typeof previousReviewSchema>
export type ReviewMode = z.infer<typeof reviewModeSchema>

export const reviewJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    accessibilityScore: { type: 'integer', minimum: 0, maximum: 100 },
    edgeCaseScore: { type: 'integer', minimum: 0, maximum: 100 },
    findings: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          category: { type: 'string', enum: ['accessibility', 'edge-case'] },
          title: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          evidence: { type: 'string' },
          recommendation: { type: 'string' },
          reference: { type: 'string' },
          status: { type: 'string', enum: ['open', 'needs-verification'] },
        },
        required: [
          'category',
          'title',
          'severity',
          'evidence',
          'recommendation',
          'status',
        ],
      },
    },
  },
  required: [
    'summary',
    'accessibilityScore',
    'edgeCaseScore',
    'findings',
  ],
} as const

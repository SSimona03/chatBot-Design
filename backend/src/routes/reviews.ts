import { Router } from 'express'
import { runDesignReviewAgent } from '../agent/designReviewAgent.js'
import { runReportChatAgent } from '../agent/reportChatAgent.js'
import { runScopeGateAgent } from '../agent/scopeGateAgent.js'
import { assertNoRuleOverride } from '../guardrails.js'
import { HttpError } from '../httpError.js'
import { receiveImages, validateImages } from '../middleware/upload.js'
import {
  previousReviewSchema,
  reviewModeSchema,
} from '../schemas/review.js'

export const reviewsRouter = Router()

reviewsRouter.post('/', receiveImages, async (request, response, next) => {
  try {
    const allowedFields = new Set(['message', 'mode', 'previousReview'])
    if (Object.keys(request.body).some((field) => !allowedFields.has(field))) {
      throw new HttpError(400, 'INVALID_REQUEST', 'The review request contains an unsupported field.')
    }

    const message = typeof request.body.message === 'string' ? request.body.message.trim() : ''
    if (message.length > 4_000) {
      throw new HttpError(400, 'INVALID_REQUEST', 'The message must be 4,000 characters or less.')
    }

    const modeResult = reviewModeSchema.safeParse(request.body.mode ?? 'full')
    if (!modeResult.success) {
      throw new HttpError(400, 'INVALID_REQUEST', 'Choose a valid review mode.')
    }

    const images = (request.files ?? []) as Express.Multer.File[]
    if (!message && images.length === 0) {
      throw new HttpError(400, 'INVALID_REQUEST', 'Add a message or at least one design image.')
    }
    await validateImages(images)

    let previousReview
    if (request.body.previousReview) {
      let rawPreviousReview: unknown
      try {
        rawPreviousReview = JSON.parse(request.body.previousReview)
      } catch {
        throw new HttpError(400, 'INVALID_REQUEST', 'The previous review context is invalid.')
      }
      const previousReviewResult = previousReviewSchema.safeParse(rawPreviousReview)
      if (!previousReviewResult.success) {
        throw new HttpError(400, 'INVALID_REQUEST', 'The previous review context is invalid.')
      }
      previousReview = previousReviewResult.data
    }

    assertNoRuleOverride(message)
    const scopeDecision = await runScopeGateAgent({
      message,
      images,
      previousReview,
    })
    if (scopeDecision.decision === 'block') {
      const overrideBlocked = scopeDecision.reason === 'rule_override'
      const unsafeContent = scopeDecision.reason === 'unsafe_content'
      throw new HttpError(
        422,
        overrideBlocked
          ? 'PROMPT_OVERRIDE_BLOCKED'
          : unsafeContent ? 'UNSAFE_CONTENT' : 'OUT_OF_SCOPE',
        overrideBlocked
          ? 'Requests to change or reveal the assistant rules are not allowed.'
          : unsafeContent
            ? 'This image or message cannot be processed safely.'
            : 'This assistant only reviews product and interface design.',
      )
    }

    const startedAt = Date.now()
    if (scopeDecision.requestType === 'follow_up') {
      if (!previousReview || images.length > 0) {
        throw new HttpError(422, 'OUT_OF_SCOPE', 'A report follow-up requires an existing report and no new image.')
      }
      const answer = await runReportChatAgent(message, previousReview)
      console.info(JSON.stringify({
        requestId: request.requestId,
        route: 'POST /api/reviews',
        status: 200,
        durationMs: Date.now() - startedAt,
        responseKind: 'answer',
        scopeReason: scopeDecision.reason,
      }))
      response.set('Cache-Control', 'no-store').json({
        kind: 'answer',
        answer,
        meta: {
          requestId: request.requestId,
          model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
        },
      })
      return
    }

    const review = await runDesignReviewAgent({
      message,
      mode: modeResult.data,
      images,
      previousReview,
    })

    console.info(JSON.stringify({
      requestId: request.requestId,
      route: 'POST /api/reviews',
      status: 200,
      durationMs: Date.now() - startedAt,
      modelImageCount: images.length,
      totalImageBytes: images.reduce((sum, image) => sum + image.size, 0),
      scopeReason: scopeDecision.reason,
    }))

    response.set('Cache-Control', 'no-store').json({
      kind: 'review',
      review,
      meta: {
        requestId: request.requestId,
        model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
      },
    })
  } catch (error) {
    next(error)
  }
})

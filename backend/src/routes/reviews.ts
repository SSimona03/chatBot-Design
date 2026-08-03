import { Router } from 'express'
import { runDesignReviewAgent } from '../agent/designReviewAgent.js'
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

    const startedAt = Date.now()
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
    }))

    response.set('Cache-Control', 'no-store').json({
      review,
      meta: {
        requestId: request.requestId,
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      },
    })
  } catch (error) {
    next(error)
  }
})

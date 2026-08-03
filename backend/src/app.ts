import { randomUUID } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { config } from './config.js'
import { errorHandler } from './middleware/errorHandler.js'
import { reviewsRouter } from './routes/reviews.js'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin: config.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use((request, response, next) => {
  request.requestId = randomUUID()
  response.set('X-Request-Id', request.requestId)
  next()
})
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.set('Cache-Control', 'no-store').json({ status: 'ok' })
})

app.use('/api/reviews', rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: config.RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many review requests. Please wait and try again.',
    },
  },
}), reviewsRouter)

app.use((_request, _response, next) => {
  next(new Error('Route not found'))
})

app.use(errorHandler)

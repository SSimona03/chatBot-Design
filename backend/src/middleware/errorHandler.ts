import type { ErrorRequestHandler } from 'express'
import multer from 'multer'
import { HttpError } from '../httpError.js'

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  let status = 500
  let code = 'INTERNAL_ERROR'
  let message = 'The review could not be completed. Please try again.'

  if (error instanceof HttpError) {
    status = error.status
    code = error.code
    message = error.message
  } else if (error instanceof multer.MulterError) {
    status = error.code === 'LIMIT_FILE_SIZE' || error.code === 'LIMIT_FILE_COUNT' ? 413 : 400
    code = status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INVALID_REQUEST'
    message = status === 413
      ? 'Upload up to 5 images, with each image no larger than 5 MB.'
      : 'The uploaded form data is invalid.'
  }

  console.error(JSON.stringify({
    requestId: request.requestId,
    method: request.method,
    path: request.path,
    status,
    code,
  }))

  response.status(status).set('Cache-Control', 'no-store').json({
    error: { code, message, requestId: request.requestId },
  })
}

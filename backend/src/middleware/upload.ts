import { fileTypeFromBuffer } from 'file-type'
import multer from 'multer'
import sharp, { type Metadata } from 'sharp'
import { HttpError } from '../httpError.js'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageCount = 5
const maxImageBytes = 5 * 1024 * 1024
const maxTotalBytes = 15 * 1024 * 1024
const maxDimension = 4_096
const maxPixels = 16_000_000

export const receiveImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: maxImageCount,
    fileSize: maxImageBytes,
    fields: 3,
    fieldSize: 50 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new HttpError(415, 'UNSUPPORTED_IMAGE', 'Only JPEG, PNG, and WebP images are supported.'))
      return
    }
    callback(null, true)
  },
}).array('images', maxImageCount)

export async function validateImages(files: Express.Multer.File[]) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  if (totalBytes > maxTotalBytes) {
    throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'The combined image size must be 15 MB or less.')
  }

  await Promise.all(files.map(async (file) => {
    const detected = await fileTypeFromBuffer(file.buffer)
    if (!detected || !allowedTypes.has(detected.mime) || detected.mime !== file.mimetype) {
      throw new HttpError(415, 'UNSUPPORTED_IMAGE', 'An uploaded file is not a valid supported image.')
    }

    let metadata: Metadata
    try {
      metadata = await sharp(file.buffer, { animated: false, limitInputPixels: maxPixels }).metadata()
    } catch {
      throw new HttpError(415, 'UNSUPPORTED_IMAGE', 'An uploaded image could not be read safely.')
    }

    const width = metadata.width ?? 0
    const height = metadata.height ?? 0
    if (!width || !height || width > maxDimension || height > maxDimension || width * height > maxPixels) {
      throw new HttpError(413, 'IMAGE_DIMENSIONS_TOO_LARGE', 'Images must be no larger than 4096 × 4096 pixels.')
    }
  }))
}

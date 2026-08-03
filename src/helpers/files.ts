import type { Attachment } from '../types/review'
import { createId } from './text'

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageCount = 5
const maxImageBytes = 5 * 1024 * 1024
const maxTotalBytes = 15 * 1024 * 1024

export function filesToAttachments(
  files: File[],
  existingAttachments: Attachment[] = [],
): Attachment[] {
  if (files.length + existingAttachments.length > maxImageCount) {
    throw new Error('Upload up to 5 images at a time.')
  }
  if (files.some((file) => !allowedImageTypes.has(file.type))) {
    throw new Error('Only JPEG, PNG, and WebP images are supported.')
  }
  if (files.some((file) => file.size > maxImageBytes)) {
    throw new Error('Each image must be 5 MB or smaller.')
  }
  const existingBytes = existingAttachments.reduce((total, attachment) => total + attachment.size, 0)
  if (files.reduce((total, file) => total + file.size, existingBytes) > maxTotalBytes) {
    throw new Error('The combined image size must be 15 MB or less.')
  }

  return files.map((file) => ({
    id: createId('attachment'),
    name: file.name,
    type: file.type,
    size: file.size,
    file,
    previewUrl: URL.createObjectURL(file),
  }))
}

export function releaseAttachment(attachment?: Attachment) {
  if (attachment?.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl)
  }
}

export function cloneAttachment(attachment: Attachment): Attachment {
  return {
    ...attachment,
    id: createId('attachment-copy'),
    previewUrl: URL.createObjectURL(attachment.file),
  }
}

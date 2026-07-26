import type { Attachment } from '../types/review'
import { createId } from './text'

export function filesToAttachments(files: File[]): Attachment[] {
  return files
    .filter((file) => file.type.startsWith('image/'))
    .map((file) => ({
      id: createId('attachment'),
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }))
}

export function releaseAttachment(attachment?: Attachment) {
  if (attachment?.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl)
  }
}

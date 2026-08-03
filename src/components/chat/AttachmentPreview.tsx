import { useRef, useState } from 'react'
import type { Attachment } from '../../types/review'
import { Icon } from '../icons/Icon'
import { ImageLightbox } from './ImageLightbox'

interface AttachmentPreviewProps {
  attachment: Attachment
  compact?: boolean
  onRemove?: () => void
}

export function AttachmentPreview({
  attachment,
  compact = false,
  onRemove,
}: AttachmentPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const previewButtonRef = useRef<HTMLButtonElement>(null)

  const closePreview = () => {
    setIsPreviewOpen(false)
    requestAnimationFrame(() => previewButtonRef.current?.focus())
  }

  return (
    <>
      <figure className={`attachment-card ${compact ? 'attachment-card-compact' : ''}`}>
        <button
          aria-label={`Open ${attachment.name} preview`}
          className="attachment-image group relative overflow-hidden bg-slate-100 text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
          onClick={() => setIsPreviewOpen(true)}
          ref={previewButtonRef}
          type="button"
        >
          <img alt={attachment.name} className="h-full w-full object-cover" src={attachment.previewUrl} />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/70 px-2 py-1 text-center text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            View image
          </span>
        </button>
        <figcaption className="min-w-0 flex-1 truncate text-xs font-medium text-[var(--ink)]">
          {attachment.name}
        </figcaption>
        {onRemove && (
          <button
            aria-label={`Remove ${attachment.name}`}
            className="icon-button shrink-0"
            onClick={onRemove}
            type="button"
          >
            <Icon name="close" size={15} />
          </button>
        )}
      </figure>
      {isPreviewOpen && (
        <ImageLightbox attachment={attachment} onClose={closePreview} />
      )}
    </>
  )
}

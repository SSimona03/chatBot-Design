import type { Attachment } from '../../types/review'
import { Icon } from '../icons/Icon'

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
  return (
    <figure className={`attachment-card ${compact ? 'attachment-card-compact' : ''}`}>
      <div className="attachment-image bg-slate-100 text-slate-500">
        <img alt="" className="h-full w-full object-cover" src={attachment.previewUrl} />
      </div>
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
  )
}

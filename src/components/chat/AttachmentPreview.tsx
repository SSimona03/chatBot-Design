import type { Attachment } from '../../types/review'
import { Icon } from '../icons/Icon'

interface AttachmentPreviewProps {
  attachment: Attachment
  compact?: boolean
  onRemove?: () => void
}

const toneClasses = {
  blue: 'bg-blue-100 text-blue-700',
  sand: 'bg-amber-100 text-amber-800',
  mint: 'bg-emerald-100 text-emerald-700',
}

export function AttachmentPreview({
  attachment,
  compact = false,
  onRemove,
}: AttachmentPreviewProps) {
  return (
    <figure className={`attachment-card ${compact ? 'attachment-card-compact' : ''}`}>
      <div className={`attachment-image ${attachment.tone ? toneClasses[attachment.tone] : 'bg-slate-100 text-slate-500'}`}>
        {attachment.previewUrl ? (
          <img alt="" className="h-full w-full object-cover" src={attachment.previewUrl} />
        ) : (
          <Icon name="image" size={compact ? 20 : 28} />
        )}
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

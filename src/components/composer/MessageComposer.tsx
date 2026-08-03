import { useRef, useState } from 'react'
import type { ClipboardEvent } from 'react'
import type { Attachment, ReviewMode } from '../../types/review'
import { AttachmentPreview } from '../chat/AttachmentPreview'
import { Icon } from '../icons/Icon'

interface MessageComposerProps {
  attachments: Attachment[]
  draft: string
  isReviewing: boolean
  onAddFiles: (files: File[]) => void
  onDraftChange: (value: string) => void
  onRemoveAttachment: (attachmentId: string) => void
  onSend: (message: string, attachments: Attachment[], mode: ReviewMode) => Promise<void>
}

export function MessageComposer({
  attachments,
  draft,
  isReviewing,
  onAddFiles,
  onDraftChange,
  onRemoveAttachment,
  onSend,
}: MessageComposerProps) {
  const [mode, setMode] = useState<ReviewMode>('full')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canSend = Boolean(draft.trim() || attachments.length) && !isReviewing

  const addFiles = (files: FileList | null) => {
    if (!files) return
    onAddFiles(Array.from(files))
  }

  const pasteImages = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const images = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file))

    if (images.length === 0) return

    event.preventDefault()
    const pastedAt = Date.now()
    const files = images.map((image, index) => {
      const extension = image.type.split('/')[1] || 'png'
      return new File(
        [image],
        `pasted-image-${pastedAt}-${index + 1}.${extension}`,
        { type: image.type, lastModified: pastedAt },
      )
    })
    onAddFiles(files)
  }

  const submit = async () => {
    if (!canSend) return
    await onSend(draft.trim(), attachments, mode)
  }

  return (
    <div className="sticky bottom-0 z-10 bg-[var(--surface)] px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border-strong)] bg-white p-3 shadow-[0_12px_35px_rgba(15,35,64,0.12)] focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
        {attachments.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {attachments.map((attachment) => (
              <AttachmentPreview
                attachment={attachment}
                compact
                key={attachment.id}
                onRemove={() => onRemoveAttachment(attachment.id)}
              />
            ))}
          </div>
        )}
        <label className="sr-only" htmlFor="review-message">Message</label>
        <textarea
          className="min-h-20 w-full resize-none border-0 bg-transparent px-2 py-1 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-slate-400"
          id="review-message"
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              void submit()
            }
          }}
          onPaste={pasteImages}
          placeholder="Ask a follow-up, or paste a screenshot with ⌘V…"
          value={draft}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            multiple
            onChange={(event) => {
              addFiles(event.target.files)
              event.target.value = ''
            }}
            ref={fileInputRef}
            type="file"
          />
          <button
            aria-label="Add images"
            className="icon-button"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Icon name="image" />
          </button>
          <label className="sr-only" htmlFor="review-mode">Review mode</label>
          <select
            className="select-input composer-mode"
            id="review-mode"
            onChange={(event) => setMode(event.target.value as ReviewMode)}
            value={mode}
          >
            <option value="full">Full review</option>
            <option value="accessibility">Accessibility only</option>
            <option value="edge-cases">Edge cases only</option>
          </select>
          <span className="ml-auto hidden text-xs text-[var(--muted)] sm:inline">⌘V image · ⌘ Enter to send</span>
          <button className="primary-button" disabled={!canSend} onClick={() => void submit()} type="button">
            {isReviewing ? (
              <><span className="loading-dot" /> Reviewing</>
            ) : (
              <><Icon name="send" /> Send</>
            )}
          </button>
        </div>
        <p className="mt-2 px-2 text-xs text-[var(--muted)]">
          Your message and images are sent to Google Gemini for analysis. Do not upload secrets or personal customer data.
        </p>
      </div>
    </div>
  )
}

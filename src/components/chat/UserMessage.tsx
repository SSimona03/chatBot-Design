import type { Attachment } from '../../types/review'
import { AttachmentPreview } from './AttachmentPreview'

interface UserMessageProps {
  attachments: Attachment[]
  text: string
}

export function UserMessage({ attachments, text }: UserMessageProps) {
  return (
    <article aria-label="Your message" className="ml-auto max-w-3xl">
      <p className="mb-2 text-right text-xs font-semibold text-[var(--muted)]">You</p>
      <div className="rounded-2xl rounded-tr-md bg-[var(--user-message)] p-4 text-sm leading-6 text-[var(--ink)] sm:p-5">
        <p>{text}</p>
        {attachments.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {attachments.map((attachment) => (
              <AttachmentPreview attachment={attachment} key={attachment.id} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

import type { Attachment, Finding, Review } from '../../types/review'
import { MessageComposer } from '../composer/MessageComposer'
import { AssistantReview } from '../review/AssistantReview'
import { UserMessage } from './UserMessage'

export type ConversationEntry =
  | { id: string; type: 'user'; text: string; attachments: Attachment[] }
  | { id: string; type: 'assistant'; review: Review }

interface ChatPanelProps {
  attachments: Attachment[]
  draft: string
  entries: ConversationEntry[]
  isReviewing: boolean
  error: string | null
  onAddFiles: (files: File[]) => void
  onDismissError: () => void
  onDraftChange: (value: string) => void
  onFindingChange: (findingId: string, updates: Partial<Finding>) => void
  onRemoveAttachment: (attachmentId: string) => void
  onSend: MessageComposerProps['onSend']
}

type MessageComposerProps = React.ComponentProps<typeof MessageComposer>

export function ChatPanel({
  attachments,
  draft,
  entries,
  isReviewing,
  error,
  onAddFiles,
  onDismissError,
  onDraftChange,
  onFindingChange,
  onRemoveAttachment,
  onSend,
}: ChatPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div aria-live="polite" className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        {entries.map((entry) =>
          entry.type === 'user' ? (
            <UserMessage
              attachments={entry.attachments}
              key={entry.id}
              text={entry.text}
            />
          ) : (
            <AssistantReview
              key={entry.id}
              onFindingChange={onFindingChange}
              onQuestionSelect={onDraftChange}
              review={entry.review}
            />
          ),
        )}
        {isReviewing && (
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]" role="status">
            <span className="loading-dot" /> Reviewing your update…
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <div className="flex items-start justify-between gap-4">
              <p>{error} Your message and images are still ready to send again.</p>
              <button className="font-semibold" onClick={onDismissError} type="button">Dismiss</button>
            </div>
          </div>
        )}
      </div>
      <MessageComposer
        attachments={attachments}
        draft={draft}
        isReviewing={isReviewing}
        onAddFiles={onAddFiles}
        onDraftChange={onDraftChange}
        onRemoveAttachment={onRemoveAttachment}
        onSend={onSend}
      />
    </div>
  )
}

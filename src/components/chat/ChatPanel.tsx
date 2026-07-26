import type { Attachment, Finding, Review } from '../../types/review'
import { MessageComposer } from '../composer/MessageComposer'
import { AssistantReview } from '../review/AssistantReview'
import { UserMessage } from './UserMessage'

export interface ConversationEntry {
  id: string
  type: 'user' | 'assistant'
  text?: string
  attachments?: Attachment[]
  review?: Review
}

interface ChatPanelProps {
  draft: string
  entries: ConversationEntry[]
  isReviewing: boolean
  onDraftChange: (value: string) => void
  onFindingChange: (findingId: string, updates: Partial<Finding>) => void
  onSend: MessageComposerProps['onSend']
}

type MessageComposerProps = React.ComponentProps<typeof MessageComposer>

export function ChatPanel({
  draft,
  entries,
  isReviewing,
  onDraftChange,
  onFindingChange,
  onSend,
}: ChatPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div aria-live="polite" className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        {entries.map((entry) =>
          entry.type === 'user' ? (
            <UserMessage
              attachments={entry.attachments ?? []}
              key={entry.id}
              text={entry.text ?? ''}
            />
          ) : entry.review ? (
            <AssistantReview
              key={entry.id}
              onFindingChange={onFindingChange}
              onQuestionSelect={onDraftChange}
              review={entry.review}
            />
          ) : null,
        )}
        {isReviewing && (
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]" role="status">
            <span className="loading-dot" /> Reviewing your update…
          </div>
        )}
      </div>
      <MessageComposer
        draft={draft}
        isReviewing={isReviewing}
        onDraftChange={onDraftChange}
        onSend={onSend}
      />
    </div>
  )
}

import { suggestedQuestions, uiContent } from '../../data/uiContent'
import type { Finding, Review } from '../../types/review'
import { FindingsTable } from '../findings/FindingsTable'
import { Icon } from '../icons/Icon'
import { ScoreCard } from './ScoreCard'

interface AssistantReviewProps {
  onFindingChange: (findingId: string, updates: Partial<Finding>) => void
  onQuestionSelect: (question: string) => void
  review: Review
}

export function AssistantReview({
  onFindingChange,
  onQuestionSelect,
  review,
}: AssistantReviewProps) {
  return (
    <article aria-label="Assistant review" className="max-w-4xl">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
        <span className="grid size-6 place-items-center rounded-lg bg-blue-100 text-[var(--primary)]">
          <Icon name="spark" size={14} />
        </span>
        {uiContent.assistantName}
      </div>
      <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Review complete</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{review.summary}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ScoreCard label="Accessibility" score={review.accessibilityScore} />
          <ScoreCard label="Edge cases" score={review.edgeCaseScore} />
        </div>
        <FindingsTable findings={review.findings} onFindingChange={onFindingChange} />
        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="text-sm font-semibold text-[var(--ink)]">Suggested follow-up</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button className="suggestion-button" key={question} onClick={() => onQuestionSelect(question)}>
                {question}
              </button>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Icon name="alert" size={15} /> {uiContent.verificationNote}
          </p>
        </div>
      </div>
    </article>
  )
}

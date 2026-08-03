import { uiContent } from '../../data/uiContent'
import type { ReportAnswer } from '../../types/review'
import { Icon } from '../icons/Icon'

export function AssistantMessage({ answer }: { answer: ReportAnswer }) {
  return (
    <article aria-label="Assistant answer" className="max-w-3xl">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
        <span className="grid size-6 place-items-center rounded-lg bg-blue-100 text-[var(--primary)]">
          <Icon name="spark" size={14} />
        </span>
        {uiContent.assistantName}
      </div>
      <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white p-4 text-sm leading-6 text-[var(--ink)] shadow-sm sm:p-5">
        <p>{answer.summary}</p>
        {answer.actions.length > 0 && (
          <section className="mt-5 border-t border-[var(--border)] pt-4">
            <h3 className="font-semibold text-[var(--ink)]">Recommended actions</h3>
            <ol className="mt-3 space-y-4 pl-5">
              {answer.actions.map((action, index) => (
                <li className="list-decimal pl-1" key={`${action.title}-${index}`}>
                  <p className="font-semibold">{action.title}</p>
                  <p className="mt-1 text-[var(--muted)]">{action.details}</p>
                  {action.findingIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {action.findingIds.map((findingId) => (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700" key={findingId}>
                          {findingId}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
        {answer.evidenceNeeded.length > 0 && (
          <section className="mt-5 rounded-xl bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-950">Additional evidence needed</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900">
              {answer.evidenceNeeded.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

import { useState } from 'react'
import { createFixPrompt } from '../../helpers/fixPrompts'
import type { Finding } from '../../types/review'
import { Icon } from '../icons/Icon'

export function FixPromptList({ findings }: { findings: Finding[] }) {
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const allSelected = findings.length > 0
    && findings.every((finding) => selectedIds.includes(finding.id))
  const selectedFindings = findings.filter((finding) => selectedIds.includes(finding.id))

  const copyText = async (text: string, target: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTarget(target)
      window.setTimeout(() => setCopiedTarget((current) => (
        current === target ? null : current
      )), 2_000)
    } catch {
      setCopiedTarget(null)
    }
  }

  const copyPrompt = async (finding: Finding) => {
    await copyText(createFixPrompt(finding), finding.id)
  }

  const combinePrompts = (items: Finding[]) => items
    .map((finding, index) => `FIX ${index + 1} OF ${items.length}\n\n${createFixPrompt(finding)}`)
    .join('\n\n========================================\n\n')

  const toggleFinding = (findingId: string) => {
    setSelectedIds((current) => current.includes(findingId)
      ? current.filter((id) => id !== findingId)
      : [...current, findingId])
  }

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : findings.map((finding) => finding.id))
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm leading-6 text-[var(--muted)]">
        Copy a focused prompt into your AI design assistant to resolve one validated UI/UX finding at a time.
      </p>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-white p-3">
        <label className="mr-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--ink)]">
          <input
            checked={allSelected}
            onChange={toggleAll}
            type="checkbox"
          />
          Select all
          <span className="font-normal text-[var(--muted)]">({selectedFindings.length}/{findings.length})</span>
        </label>
        <button
          className="secondary-button"
          disabled={selectedFindings.length === 0}
          onClick={() => void copyText(combinePrompts(selectedFindings), 'selected')}
          type="button"
        >
          <Icon name={copiedTarget === 'selected' ? 'check' : 'copy'} />
          {copiedTarget === 'selected' ? 'Selected copied' : `Copy selected (${selectedFindings.length})`}
        </button>
        <button
          className="primary-button"
          disabled={findings.length === 0}
          onClick={() => void copyText(combinePrompts(findings), 'all')}
          type="button"
        >
          <Icon name={copiedTarget === 'all' ? 'check' : 'copy'} />
          {copiedTarget === 'all' ? 'All copied' : 'Copy all fixes'}
        </button>
      </div>
      <ul className="space-y-3">
        {findings.map((finding) => (
          <li className="rounded-xl border border-[var(--border)] bg-[var(--soft)] p-4" key={finding.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <label className="flex min-w-0 cursor-pointer items-start gap-3">
                <input
                  checked={selectedIds.includes(finding.id)}
                  className="mt-1"
                  onChange={() => toggleFinding(finding.id)}
                  type="checkbox"
                />
                <span>
                  <span className="block text-xs font-semibold text-[var(--primary)]">{finding.id}</span>
                  <span className="mt-1 block font-semibold text-[var(--ink)]">{finding.title}</span>
                </span>
              </label>
              <button
                className="secondary-button"
                onClick={() => void copyPrompt(finding)}
                type="button"
              >
                <Icon name={copiedTarget === finding.id ? 'check' : 'copy'} />
                {copiedTarget === finding.id ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-white p-4 font-sans text-xs leading-5 text-[var(--muted)]">
              {createFixPrompt(finding)}
            </pre>
          </li>
        ))}
      </ul>
      <span aria-live="polite" className="sr-only">
        {copiedTarget ? `${copiedTarget} prompts copied` : ''}
      </span>
    </div>
  )
}

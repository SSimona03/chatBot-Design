import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../icons/Icon'

interface RenameChatDialogProps {
  currentTitle: string
  onCancel: () => void
  onSave: (title: string) => void
}

export function RenameChatDialog({
  currentTitle,
  onCancel,
  onSave,
}: RenameChatDialogProps) {
  const [title, setTitle] = useState(currentTitle)
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.select()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextTitle = title.trim()
    if (nextTitle) {
      onSave(nextTitle)
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-[min(28rem,calc(100%-2rem))] rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--ink)]" id={titleId}>
            Rename chat
          </h2>
          <button aria-label="Close rename dialog" className="icon-button" onClick={onCancel}>
            <Icon name="close" />
          </button>
        </div>
        <form className="mt-5" onSubmit={submit}>
          <label className="field-label" htmlFor="chat-title">
            Chat title
          </label>
          <input
            className="text-input mt-2"
            id="chat-title"
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            ref={inputRef}
            value={title}
          />
          <div className="mt-6 flex justify-end gap-3">
            <button className="secondary-button" onClick={onCancel} type="button">
              Cancel
            </button>
            <button className="primary-button" disabled={!title.trim()} type="submit">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

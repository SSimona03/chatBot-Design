import { useEffect, useRef } from 'react'
import { Icon } from '../icons/Icon'

interface ChatMenuProps {
  chatTitle: string
  onClose: () => void
  onDelete: () => void
  onDuplicate: () => void
  onRename: () => void
}

export function ChatMenu({
  chatTitle,
  onClose,
  onDelete,
  onDuplicate,
  onRename,
}: ChatMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [onClose])

  const runAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div
      aria-label={`Actions for ${chatTitle}`}
      className="absolute right-2 top-10 z-30 w-40 rounded-xl border border-[var(--border)] bg-white p-1.5 shadow-lg"
      ref={menuRef}
      role="menu"
    >
      <button className="menu-item" onClick={() => runAction(onRename)} role="menuitem">
        <Icon name="edit" /> Rename
      </button>
      <button className="menu-item" onClick={() => runAction(onDuplicate)} role="menuitem">
        <Icon name="copy" /> Duplicate
      </button>
      <button className="menu-item text-red-700" onClick={() => runAction(onDelete)} role="menuitem">
        <Icon name="trash" /> Delete
      </button>
    </div>
  )
}

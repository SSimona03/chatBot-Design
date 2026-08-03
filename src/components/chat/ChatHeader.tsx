import type { Chat } from '../../types/review'
import { Icon } from '../icons/Icon'

interface ChatHeaderProps {
  chat: Chat
  onOpenSidebar: () => void
  onRename: () => void
}

export function ChatHeader({ chat, onOpenSidebar, onRename }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 sm:px-6">
      <button aria-label="Open navigation" className="icon-button mobile-only" onClick={onOpenSidebar}>
        <Icon name="menu" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-[var(--ink)] sm:text-xl">{chat.title}</h1>
          <button aria-label="Rename chat" className="icon-button" onClick={onRename}>
            <Icon name="edit" size={16} />
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {chat.imageCount} images · Updated {chat.updatedAt.toLocaleLowerCase()}
        </p>
      </div>
    </header>
  )
}

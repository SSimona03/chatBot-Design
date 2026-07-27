import { useState } from 'react'
import { uiContent } from '../../data/uiContent'
import type { Chat } from '../../types/review'
import { Icon } from '../icons/Icon'
import { ChatMenu } from './ChatMenu'

interface ConversationSidebarProps {
  chats: Chat[]
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
  onDelete: (chat: Chat) => void
  onDuplicate: (chat: Chat) => void
  onRename: (chat: Chat) => void
  onSelect: (chatId: string) => void
  selectedChatId: string
}

export function ConversationSidebar({
  chats,
  isOpen,
  onClose,
  onCreate,
  onDelete,
  onDuplicate,
  onRename,
  onSelect,
  selectedChatId,
}: ConversationSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="flex items-center justify-between px-5 pt-5">
          <a className="flex items-center gap-2.5 font-semibold text-[var(--ink)]" href="#">
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--primary)] text-white">
              <Icon name="spark" size={17} />
            </span>
            {uiContent.productName}
          </a>
          <button aria-label="Close navigation" className="icon-button mobile-only" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="px-4 pt-5">
          <button className="primary-button w-full justify-center" onClick={onCreate}>
            <Icon name="plus" /> {uiContent.newReview}
          </button>
        </div>

        <nav aria-label="Recent reviews" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Recent reviews
          </p>
          <ul className="space-y-1">
              {chats.map((chat) => (
                <li className="relative" key={chat.id}>
                  <button
                    aria-current={chat.id === selectedChatId ? 'page' : undefined}
                    className={`chat-list-item ${chat.id === selectedChatId ? 'chat-list-item-selected' : ''}`}
                    onClick={() => {
                      onSelect(chat.id)
                      onClose()
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{chat.title}</span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">{chat.updatedAt}</span>
                    </span>
                  </button>
                  <button
                    aria-expanded={openMenuId === chat.id}
                    aria-label={`Open actions for ${chat.title}`}
                    className="icon-button absolute right-2 top-2"
                    onClick={() => setOpenMenuId(openMenuId === chat.id ? null : chat.id)}
                  >
                    <Icon name="more" />
                  </button>
                  {openMenuId === chat.id && (
                    <ChatMenu
                      chatTitle={chat.title}
                      onClose={() => setOpenMenuId(null)}
                      onDelete={() => onDelete(chat)}
                      onDuplicate={() => onDuplicate(chat)}
                      onRename={() => onRename(chat)}
                    />
                  )}
                </li>
              ))}
          </ul>
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <p className="px-2 text-xs text-[var(--muted)]">{uiContent.rulesVersion}</p>
        </div>
      </aside>
    </>
  )
}

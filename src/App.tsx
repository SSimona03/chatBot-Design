import { useState } from 'react'
import { ChatHeader } from './components/chat/ChatHeader'
import {
  ChatPanel,
  type ConversationEntry,
} from './components/chat/ChatPanel'
import { ReviewProgress } from './components/review/ReviewProgress'
import { ConversationSidebar } from './components/sidebar/ConversationSidebar'
import { RenameChatDialog } from './components/sidebar/RenameChatDialog'
import { initialChats } from './data/mockChats'
import {
  initialReview,
  reviewedAttachments,
  simulatedReview,
} from './data/mockReview'
import { getChatById } from './getters/chatGetters'
import { createId } from './helpers/text'
import type {
  Attachment,
  Chat,
  Finding,
  Review,
  ReviewMode,
} from './types/review'

const initialEntries: ConversationEntry[] = [
  {
    id: 'message-01',
    type: 'user',
    text: 'Please review this checkout flow before our design handoff. Pay particular attention to keyboard use, payment errors, and what happens on narrow screens.',
    attachments: reviewedAttachments,
  },
  { id: 'response-01', type: 'assistant', review: initialReview },
]

function App() {
  // React state updates replace values, so each handler below creates the next array or object.
  const [chats, setChats] = useState(initialChats)
  const [selectedChatId, setSelectedChatId] = useState(initialChats[0].id)
  const [entries, setEntries] = useState(initialEntries)
  const [review, setReview] = useState(initialReview)
  const [draft, setDraft] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatToRename, setChatToRename] = useState<Chat | null>(null)
  const selectedChat = getChatById(chats, selectedChatId)

  const createChat = () => {
    const chat: Chat = {
      id: createId('review'),
      title: 'Untitled review',
      updatedAt: 'Just now',
      imageCount: 0,
    }
    setChats((current) => [chat, ...current])
    setSelectedChatId(chat.id)
    setEntries([])
    setReview({ ...initialReview, findings: [] })
  }

  const renameChat = (chatId: string, title: string) => {
    setChats((current) =>
      current.map((chat) => (chat.id === chatId ? { ...chat, title } : chat)),
    )
    setChatToRename(null)
  }

  const duplicateChat = (chat: Chat) => {
    const duplicate = {
      ...chat,
      id: createId('review-copy'),
      title: `${chat.title} copy`,
      updatedAt: 'Just now',
    }
    setChats((current) => [duplicate, ...current])
    setSelectedChatId(duplicate.id)
  }

  const deleteChat = (chat: Chat) => {
    if (!window.confirm(`Delete "${chat.title}"? This cannot be undone.`)) return

    const remainingChats = chats.filter((item) => item.id !== chat.id)
    setChats(remainingChats)
    if (selectedChatId === chat.id) {
      setSelectedChatId(remainingChats[0]?.id ?? '')
    }
  }

  const updateFinding = (findingId: string, updates: Partial<Finding>) => {
    const updateReview = (currentReview: Review): Review => ({
      ...currentReview,
      findings: currentReview.findings.map((finding) =>
        finding.id === findingId ? { ...finding, ...updates } : finding,
      ),
    })

    setReview(updateReview)
    setEntries((current) =>
      current.map((entry) =>
        entry.review
          ? { ...entry, review: updateReview(entry.review) }
          : entry,
      ),
    )
  }

  const sendMessage = (
    message: string,
    attachments: Attachment[],
    _mode: ReviewMode,
  ) => {
    setEntries((current) => [
      ...current,
      {
        id: createId('message'),
        type: 'user',
        text: message || 'Please review the attached revision.',
        attachments,
      },
    ])
    setDraft('')
    setIsReviewing(true)

    window.setTimeout(() => {
      setReview(simulatedReview)
      setEntries((current) => [
        ...current,
        {
          id: createId('response'),
          type: 'assistant',
          review: simulatedReview,
        },
      ])
      setIsReviewing(false)
    }, 1400)
  }

  if (!selectedChat) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--surface)] p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--ink)]">No reviews yet</h1>
          <button className="primary-button mx-auto mt-4" onClick={createChat}>Create your first review</button>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <ConversationSidebar
        chats={chats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreate={createChat}
        onDelete={deleteChat}
        onDuplicate={duplicateChat}
        onRename={setChatToRename}
        onSelect={setSelectedChatId}
        selectedChatId={selectedChatId}
      />
      <main className="main-workspace">
        <ChatHeader
          chat={selectedChat}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onRename={() => setChatToRename(selectedChat)}
        />
        <div className="flex min-h-0 flex-1">
          <ChatPanel
            draft={draft}
            entries={entries}
            isReviewing={isReviewing}
            onDraftChange={setDraft}
            onFindingChange={updateFinding}
            onSend={sendMessage}
          />
          <ReviewProgress findings={review.findings} />
        </div>
      </main>
      {chatToRename && (
        <RenameChatDialog
          currentTitle={chatToRename.title}
          onCancel={() => setChatToRename(null)}
          onSave={(title) => renameChat(chatToRename.id, title)}
        />
      )}
    </div>
  )
}

export default App

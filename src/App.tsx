import { useRef, useState } from 'react'
import { submitReview } from './api/reviews'
import { ChatHeader } from './components/chat/ChatHeader'
import {
  ChatPanel,
  type ConversationEntry,
} from './components/chat/ChatPanel'
import { ReviewProgress } from './components/review/ReviewProgress'
import { ConversationSidebar } from './components/sidebar/ConversationSidebar'
import { RenameChatDialog } from './components/sidebar/RenameChatDialog'
import {
  cloneAttachment,
  filesToAttachments,
  releaseAttachment,
} from './helpers/files'
import { createId } from './helpers/text'
import type {
  Attachment,
  Chat,
  Finding,
  Review,
  ReviewMode,
} from './types/review'

interface Conversation {
  chat: Chat
  entries: ConversationEntry[]
  latestReview: Review | null
  draft: string
  draftAttachments: Attachment[]
  status: 'idle' | 'reviewing'
  error: string | null
}

function createConversation(): Conversation {
  return {
    chat: {
      id: createId('review'),
      title: 'Untitled review',
      updatedAt: 'Just now',
      imageCount: 0,
    },
    entries: [],
    latestReview: null,
    draft: '',
    draftAttachments: [],
    status: 'idle',
    error: null,
  }
}

function releaseConversationImages(conversation: Conversation) {
  conversation.draftAttachments.forEach(releaseAttachment)
  conversation.entries.forEach((entry) => {
    if (entry.type === 'user') entry.attachments.forEach(releaseAttachment)
  })
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedChatId, setSelectedChatId] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatToRename, setChatToRename] = useState<Chat | null>(null)
  const requests = useRef(new Map<string, AbortController>())
  const selectedConversation = conversations.find(({ chat }) => chat.id === selectedChatId)
  const chats = conversations.map(({ chat }) => chat)

  const updateConversation = (
    chatId: string,
    update: (conversation: Conversation) => Conversation,
  ) => {
    setConversations((current) => current.map((conversation) => (
      conversation.chat.id === chatId ? update(conversation) : conversation
    )))
  }

  const createChat = () => {
    const conversation = createConversation()
    setConversations((current) => [conversation, ...current])
    setSelectedChatId(conversation.chat.id)
  }

  const renameChat = (chatId: string, title: string) => {
    updateConversation(chatId, (conversation) => ({
      ...conversation,
      chat: { ...conversation.chat, title },
    }))
    setChatToRename(null)
  }

  const duplicateChat = (chat: Chat) => {
    const original = conversations.find((conversation) => conversation.chat.id === chat.id)
    if (!original) return

    const duplicate: Conversation = {
      ...structuredClone({
        ...original,
        entries: original.entries.map((entry) => (
          entry.type === 'user' ? { ...entry, attachments: [] } : entry
        )),
        draftAttachments: [],
      }),
      chat: {
        ...original.chat,
        id: createId('review-copy'),
        title: `${original.chat.title} copy`,
        updatedAt: 'Just now',
      },
      entries: original.entries.map((entry) => (
        entry.type === 'user'
          ? { ...entry, attachments: entry.attachments.map(cloneAttachment) }
          : structuredClone(entry)
      )),
      draftAttachments: original.draftAttachments.map(cloneAttachment),
      status: 'idle',
      error: null,
    }
    setConversations((current) => [duplicate, ...current])
    setSelectedChatId(duplicate.chat.id)
  }

  const deleteChat = (chat: Chat) => {
    if (!window.confirm(`Delete "${chat.title}"? This cannot be undone.`)) return
    const deleted = conversations.find((conversation) => conversation.chat.id === chat.id)
    if (deleted) releaseConversationImages(deleted)
    requests.current.get(chat.id)?.abort()
    requests.current.delete(chat.id)

    const remaining = conversations.filter((conversation) => conversation.chat.id !== chat.id)
    setConversations(remaining)
    if (selectedChatId === chat.id) setSelectedChatId(remaining[0]?.chat.id ?? '')
  }

  const updateFinding = (findingId: string, updates: Partial<Finding>) => {
    if (!selectedConversation) return
    updateConversation(selectedConversation.chat.id, (conversation) => {
      const updateReview = (review: Review): Review => ({
        ...review,
        findings: review.findings.map((finding) => (
          finding.id === findingId ? { ...finding, ...updates } : finding
        )),
      })
      return {
        ...conversation,
        latestReview: conversation.latestReview
          ? updateReview(conversation.latestReview)
          : null,
        entries: conversation.entries.map((entry) => (
          entry.type === 'assistant'
            ? { ...entry, review: updateReview(entry.review) }
            : entry
        )),
      }
    })
  }

  const addFiles = (files: File[]) => {
    if (!selectedConversation) return
    try {
      const attachments = filesToAttachments(files, selectedConversation.draftAttachments)
      updateConversation(selectedConversation.chat.id, (conversation) => ({
        ...conversation,
        draftAttachments: [...conversation.draftAttachments, ...attachments],
        error: null,
      }))
    } catch (error) {
      updateConversation(selectedConversation.chat.id, (conversation) => ({
        ...conversation,
        error: error instanceof Error ? error.message : 'The selected images are not supported.',
      }))
    }
  }

  const removeAttachment = (attachmentId: string) => {
    if (!selectedConversation) return
    const attachment = selectedConversation.draftAttachments.find(({ id }) => id === attachmentId)
    releaseAttachment(attachment)
    updateConversation(selectedConversation.chat.id, (conversation) => ({
      ...conversation,
      draftAttachments: conversation.draftAttachments.filter(({ id }) => id !== attachmentId),
    }))
  }

  const sendMessage = async (
    message: string,
    attachments: Attachment[],
    mode: ReviewMode,
  ) => {
    if (!selectedConversation || selectedConversation.status === 'reviewing') return
    const chatId = selectedConversation.chat.id
    const previousReview = selectedConversation.latestReview
    const controller = new AbortController()
    requests.current.get(chatId)?.abort()
    requests.current.set(chatId, controller)

    updateConversation(chatId, (conversation) => ({
      ...conversation,
      status: 'reviewing',
      error: null,
    }))

    try {
      const { review } = await submitReview({
        message,
        mode,
        attachments,
        previousReview,
        signal: controller.signal,
      })
      updateConversation(chatId, (conversation) => ({
        ...conversation,
        chat: {
          ...conversation.chat,
          title: conversation.chat.title === 'Untitled review'
            ? (message || attachments[0]?.name || 'Design review').slice(0, 80)
            : conversation.chat.title,
          updatedAt: 'Just now',
          imageCount: conversation.chat.imageCount + attachments.length,
        },
        entries: [
          ...conversation.entries,
          {
            id: createId('message'),
            type: 'user',
            text: message || 'Please review the attached design.',
            attachments,
          },
          { id: createId('response'), type: 'assistant', review },
        ],
        latestReview: review,
        draft: '',
        draftAttachments: [],
        status: 'idle',
        error: null,
      }))
    } catch (error) {
      if (!controller.signal.aborted) {
        updateConversation(chatId, (conversation) => ({
          ...conversation,
          status: 'idle',
          error: error instanceof Error
            ? error.message
            : 'The review could not be completed. Please try again.',
        }))
      }
    } finally {
      if (requests.current.get(chatId) === controller) requests.current.delete(chatId)
    }
  }

  if (!selectedConversation) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--surface)] p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--ink)]">No reviews yet</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Start a real AI design review with a message or screenshot.</p>
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
          chat={selectedConversation.chat}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onRename={() => setChatToRename(selectedConversation.chat)}
        />
        <div className="flex min-h-0 flex-1">
          <ChatPanel
            attachments={selectedConversation.draftAttachments}
            draft={selectedConversation.draft}
            entries={selectedConversation.entries}
            error={selectedConversation.error}
            isReviewing={selectedConversation.status === 'reviewing'}
            onAddFiles={addFiles}
            onDismissError={() => updateConversation(selectedChatId, (conversation) => ({ ...conversation, error: null }))}
            onDraftChange={(draft) => updateConversation(selectedChatId, (conversation) => ({ ...conversation, draft }))}
            onFindingChange={updateFinding}
            onRemoveAttachment={removeAttachment}
            onSend={sendMessage}
          />
          <ReviewProgress review={selectedConversation.latestReview} />
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

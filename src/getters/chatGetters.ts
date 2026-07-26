import type { Chat } from '../types/review'

export function getFilteredChats(chats: Chat[], query: string) {
  const normalisedQuery = query.trim().toLocaleLowerCase()

  if (!normalisedQuery) {
    return chats
  }

  return chats.filter((chat) =>
    chat.title.toLocaleLowerCase().includes(normalisedQuery),
  )
}

export function getChatById(chats: Chat[], chatId: string) {
  return chats.find((chat) => chat.id === chatId) ?? chats[0]
}

'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, Message, TypingUser, ChatState } from '@/types/chat'

interface ChatStore extends ChatState {
  setCurrentUser: (user: User | null) => void
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setOnlineUsers: (users: User[]) => void
  addTypingUser: (user: TypingUser) => void
  removeTypingUser: (userId: string) => void
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>()(
  devtools(
    (set) => ({
      currentUser: null,
      messages: [],
      onlineUsers: [],
      typingUsers: [],
      isConnected: false,
      error: null,
      setCurrentUser: (user) => set({ currentUser: user }),
///////////////////////
      addMessage: (message) =>
  set((state) => {
    const exists = state.messages.some(
      (m) => m.id === message.id
    )

    if (exists) {
      return state
    }

    return {
      messages: [...state.messages, message],
    }
  }),
      // addMessage: (message) =>
      //   set((state) => ({
      //     messages: [...state.messages, message],
      //   })),


      setMessages: (messages) => set({ messages }),
      setOnlineUsers: (users) => set({ onlineUsers: users }),
      addTypingUser: (user) =>
        set((state) => ({
          typingUsers: [...state.typingUsers, user],
        })),
      removeTypingUser: (userId) =>
        set((state) => ({
          typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
        })),
      setConnected: (connected) => set({ isConnected: connected }),
      setError: (error) => set({ error }),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: 'chat-store' }
  )
)

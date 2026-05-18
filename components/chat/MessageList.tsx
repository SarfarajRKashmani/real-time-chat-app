'use client'

import { useEffect, useRef } from 'react'
import { Message } from './Message'
import { TypingIndicator } from './TypingIndicator'
import type { Message as MessageType, TypingUser } from '@/types/chat'

interface MessageListProps {
  messages: MessageType[]
  typingUsers: TypingUser[]
  currentUserId: string
}

export function MessageList({
  messages,
  typingUsers,
  currentUserId,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingUsers])

  if (messages.length === 0 && typingUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-xs text-muted-foreground mt-2">
            Start a conversation by typing a message
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground scrollbar-track-transparent"
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.userId === currentUserId}
        />
      ))}

      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      <div ref={messagesEndRef} />
    </div>
  )
}

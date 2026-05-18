'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChatStore } from '@/lib/store'
import { useChat } from '@/hooks/useChat'
import { disconnectSocket } from '@/lib/socket'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { Sidebar } from '@/components/chat/Sidebar'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ChatPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Get state from store
  const {
    currentUser,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
  } = useChatStore()

  // Get user from localStorage
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Get user info from localStorage
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')

    if (!storedUserId || !storedUsername) {
      router.push('/')
      return
    }

    setUserId(storedUserId)
    setUsername(storedUsername)
    setIsInitialized(true)
  }, [router])

  // Initialize chat
  const { sendMessage, handleTyping, handleStopTyping } = useChat(
    userId || '',
    username || ''
  )

  if (!isInitialized || !userId || !username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handleLeaveChat = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    disconnectSocket()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        users={onlineUsers}
        currentUserId={userId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Chat Room</h1>
              <p className="text-xs text-muted-foreground">
                {onlineUsers.length} online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeaveChat}
            >
              Leave
            </Button>
          </div>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          currentUserId={userId}
        />

        {/* Input */}
        <ChatInput
          onSendMessage={sendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!isConnected}
        />

        {!isConnected && (
          <div className="bg-destructive/10 text-destructive text-sm p-2 text-center border-t border-destructive/20">
            Connecting...
          </div>
        )}
      </div>
    </div>
  )
}

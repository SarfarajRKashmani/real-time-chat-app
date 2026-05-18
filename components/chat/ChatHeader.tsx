'use client'

import { Users, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/chat'

interface ChatHeaderProps {
  onlineUsersCount: number
  onLeaveChat: () => void
}

export function ChatHeader({
  onlineUsersCount,
  onLeaveChat,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Chat Room</h1>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <Users className="w-4 h-4" />
          <span>{onlineUsersCount} online</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onLeaveChat}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        Leave Chat
      </Button>
    </div>
  )
}

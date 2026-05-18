'use client'

import { formatTime, getAvatarColor, getInitials } from '@/lib/chat-utils'
import type { Message as MessageType } from '@/types/chat'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MessageProps {
  message: MessageType
  isOwn: boolean
}

export function Message({ message, isOwn }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${getAvatarColor(
          message.userId
        )} flex items-center justify-center text-white text-xs font-semibold`}
      >
        {getInitials(message.userName)}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col gap-1 max-w-xs ${isOwn ? 'items-end' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          }`}
        >
          {/* Username */}
          <p className="text-xs font-semibold mb-1 opacity-75">{message.userName}</p>

          {/* Image Preview */}
          {message.imageUrl && (
            <div className="mb-2 max-w-xs">
              <img
                src={message.imageUrl}
                alt="shared"
                className="rounded max-h-48 w-auto"
              />
            </div>
          )}

          {/* Message Content */}
          <p className="text-sm break-words">{message.content}</p>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

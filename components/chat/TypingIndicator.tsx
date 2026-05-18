'use client'

import { motion } from 'framer-motion'
import type { TypingUser } from '@/types/chat'

interface TypingIndicatorProps {
  users: TypingUser[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const names = users.map((u) => u.userName).join(', ')
  const isPlural = users.length > 1

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar placeholder */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted" />

      {/* Typing bubble */}
      <div className="flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground rounded-bl-none">
        <p className="text-sm">{names}</p>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm"
        >
          &nbsp;is{isPlural ? '' : ''} typing
        </motion.span>

        {/* Animated dots */}
        <div className="flex gap-1 ml-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1.5 h-1.5 rounded-full bg-secondary-foreground"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

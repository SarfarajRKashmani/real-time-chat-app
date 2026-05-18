'use client'

import { getAvatarColor, getInitials } from '@/lib/chat-utils'
import type { User } from '@/types/chat'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface SidebarProps {
  users: User[]
  currentUserId: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  users,
  currentUserId,
  isOpen,
  onClose,
}: SidebarProps) {
  const sortedUsers = [...users].sort((a, b) => {
    // Current user first
    if (a.id === currentUserId) return -1
    if (b.id === currentUserId) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:relative md:translate-x-0 left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-40 md:z-0 flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-sidebar-border p-4 flex items-center justify-between">
          <h2 className="font-bold text-sidebar-foreground">Online Users</h2>
          <button
            onClick={onClose}
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent rounded p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedUsers.length === 0 ? (
            <p className="text-sm text-sidebar-foreground/60">No users online</p>
          ) : (
            sortedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  user.id === currentUserId
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full ${getAvatarColor(
                    user.id
                  )} flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {user.id === currentUserId && (
                    <p className="text-xs opacity-75">(You)</p>
                  )}
                </div>
                {user.id !== currentUserId && (
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500" />
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </>
  )
}

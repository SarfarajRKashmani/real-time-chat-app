'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateUsername } from '@/lib/chat-utils'
import { motion } from 'framer-motion'

export default function JoinPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validation = validateUsername(username)
    if (!validation.valid) {
      setError(validation.error || 'Invalid username')
      return
    }

    setIsLoading(true)

    // Generate a unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store user info in localStorage
    localStorage.setItem('userId', userId)
    localStorage.setItem('username', username)

    // Navigate to chat page
    setTimeout(() => {
      router.push('/chat')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Chat</h1>
            <p className="text-muted-foreground">
              Enter your name to join the conversation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Your Name
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                autoFocus
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                2-30 characters, letters and spaces only
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !username}
              className="w-full h-11 font-semibold"
            >
              {isLoading ? 'Joining...' : 'Join Chat'}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            <p>Real-time chat with people around you</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

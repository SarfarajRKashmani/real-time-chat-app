'use client'

import { useState, useRef, useCallback } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { Send, Image as ImageIcon, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/constants'

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void
  onTyping: () => void
  onStopTyping: () => void
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  onTyping,
  onStopTyping,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = useCallback(() => {
    if (message.trim() || previewImage) {
      onSendMessage(message, previewImage || undefined)
      setMessage('')
      setPreviewImage(null)
      onStopTyping()
    }
  }, [message, previewImage, onSendMessage, onStopTyping])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (e.target.value.trim()) {
      onTyping()
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size and type
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB')
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Only image files (JPEG, PNG, GIF, WebP) are allowed')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearPreviewImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-t border-border bg-background p-4 space-y-3">
      {/* Image Preview */}
      {previewImage && (
        <div className="relative inline-block">
          <img
            src={previewImage}
            alt="preview"
            className="max-h-32 rounded-lg"
          />
          <button
            onClick={clearPreviewImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-destructive/90"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        {/* Emoji Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </Button>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full mb-2 z-50 left-0"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="auto"
              />
            </div>
          )}
        </div>

        {/* Image Upload */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || !!previewImage}
        >
          <ImageIcon className="w-5 h-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={disabled}
        />

        {/* Message Input */}
        <Input
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1"
        />

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={disabled || (!message.trim() && !previewImage)}
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

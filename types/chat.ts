export interface User {
  id: string
  name: string
  avatar?: string
  joinedAt: Date
}

export interface Message {
  id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  timestamp: Date
  edited?: boolean
  editedAt?: Date
}

export interface TypingUser {
  userId: string
  userName: string
}

export interface ChatState {
  currentUser: User | null
  messages: Message[]
  onlineUsers: User[]
  typingUsers: TypingUser[]
  isConnected: boolean
  error: string | null
}

export interface SocketMessage {
  id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  timestamp: string
}

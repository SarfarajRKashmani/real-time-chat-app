import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  name: string
  joinedAt: Date
}

export interface Message {
  id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  timestamp: Date
}

export class ChatStore {
  private users: Map<string, User> = new Map()
  private messages: Message[] = []
  private maxMessages = 100

  addUser(userId: string, userName: string): User {
    const user: User = {
      id: userId,
      name: userName,
      joinedAt: new Date(),
    }
    this.users.set(userId, user)
    return user
  }

  removeUser(userId: string): User | undefined {
    const user = this.users.get(userId)
    this.users.delete(userId)
    return user
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  addMessage(userId: string, userName: string, content: string, imageUrl?: string): Message {
    const message: Message = {
      id: uuidv4(),
      userId,
      userName,
      content,
      imageUrl,
      timestamp: new Date(),
    }

    this.messages.push(message)

    // Keep only the last N messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages)
    }

    return message
  }

  getMessages(limit: number = 50): Message[] {
    return this.messages.slice(-limit)
  }

  getAllMessages(): Message[] {
    return [...this.messages]
  }

  clearMessages(): void {
    this.messages = []
  }
}

export const chatStore = new ChatStore()

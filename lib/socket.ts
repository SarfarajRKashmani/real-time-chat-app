import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (userId: string, userName: string) => {
  if (socket?.connected) {
    return socket
  }

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL
 
   console.log('[v0] Initializing Socket.IO connection to:', socketUrl)
  
   socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    upgrade: true,
    rememberUpgrade: true,
    forceNew: false,
    autoConnect: true,
})

  socket.on('connect', () => {
    const transport = socket?.io?.engine?.transport?.name || 'unknown'
    console.log('[v0] Socket connected! Transport:', transport)
    socket?.emit('join-chat', { userId, userName })
  })

  socket.on('connect_error', (error) => {
    console.error('[v0] Socket connection error:', error)
    if (error instanceof Error) {
      console.error('[v0] Error message:', error.message)
      console.error('[v0] Error type:', error.name)
    }
 })

  socket.on('disconnect', (reason) => {
   console.log('[v0] Socket disconnected. Reason:', reason)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const emitMessage = (content: string, imageUrl?: string) => {
  if (socket?.connected) {
    socket.emit('send-message', {
      content,
      imageUrl,
      timestamp: new Date().toISOString(),
    })
  }
}

export const emitTyping = (isTyping: boolean) => {
  if (socket?.connected) {
    if (isTyping) {
      socket.emit('typing')
    } else {
      socket.emit('stop-typing')
    }
  }
}

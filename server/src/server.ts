import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { chatStore } from './store.ts'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  credentials: true,
},
   allowUpgrades: true,
  pingInterval: 25000,
  pingTimeout: 20000,
   
})

const PORT = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`)

  // Join chat
  socket.on('join-chat', (data) => {
    const { userId, userName } = data

    if (!userId || !userName) {
      socket.emit('error', { message: 'Invalid user data' })
      return
    }

    // Add user to store
    const user = chatStore.addUser(userId, userName)
    console.log(`[Chat] User joined: ${userName} (${userId})`)

    // Store socket data
    socket.data.userId = userId
    socket.data.userName = userName

    // Broadcast user list to all clients
    const users = chatStore.getAllUsers()
    io.emit('users-list', { users })

    // Broadcast user joined message
    io.emit('user-joined', {
      userId,
      userName,
      timestamp: new Date().toISOString(),
    })

    // Send message history to the newly joined user
    const messages = chatStore.getMessages(50)
    socket.emit('message-history', { messages })
  })

  // Send message
  socket.on('send-message', (data) => {
    const { content, imageUrl } = data
    const userId = socket.data.userId
    const userName = socket.data.userName
//----------------------------------------------------------//
if (!userId || !userName || (!content && !imageUrl)) {
      socket.emit('error', { message: 'Invalid message data' })
      return
    }

    // if (!userId || !userName || !content) {
    //   socket.emit('error', { message: 'Invalid message data' })
    //   return
    // }
    const message = chatStore.addMessage(userId, userName, content || '', imageUrl)
    console.log(`[Message] ${userName}: ${content ? content.substring(0, 50) : '(image)'}...`)


    // // Add message to store
    // const message = chatStore.addMessage(userId, userName, content, imageUrl)
    // console.log(`[Message] ${userName}: ${content.substring(0, 50)}...`)
//----------------------------------------------------------//
    // Broadcast message to all clients
    io.emit('receive-message', message)

    // Clear typing status for this user
    socket.emit('stop-typing')
    io.emit('user-stop-typing', { userId })
  })

  // Typing indicator
  socket.on('typing', () => {
    const userId = socket.data.userId
    const userName = socket.data.userName

    if (!userId || !userName) return

    socket.broadcast.emit('user-typing', { userId, userName })
  })

  // Stop typing
  socket.on('stop-typing', () => {
    const userId = socket.data.userId

    if (!userId) return

    io.emit('user-stop-typing', { userId })
  })

  // Disconnect
  socket.on('disconnect', () => {
    const userId = socket.data.userId
    const userName = socket.data.userName

    if (userId && userName) {
      // Remove user from store
      chatStore.removeUser(userId)
      console.log(`[Chat] User left: ${userName} (${userId})`)

      // Broadcast updated user list
      const users = chatStore.getAllUsers()
      io.emit('users-list', { users })

      // Broadcast user left message
      io.emit('user-left', {
        userId,
        userName,
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[Socket] Disconnection: ${socket.id}`)
  })

  // Error handler
  socket.on('chat:error', (error) => {
    console.error(`[Socket Error] ${socket.id}:`, error)
  })
})

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/messages', (req, res) => {
  const messages = chatStore.getAllMessages()
  res.json({ messages })
})

app.get('/api/users', (req, res) => {
  const users = chatStore.getAllUsers()
  res.json({ users })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Server] Chat server running on port ${PORT}`)
  console.log(`[Server] CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('[Server] HTTP server closed')
    process.exit(0)
  })
})

// // 'use client'

// // import { useEffect, useCallback, useRef } from 'react'
// // import { useChatStore } from '@/lib/store'
// // import {
// //   initSocket,
// //   getSocket,
// //   disconnectSocket,
// //   emitMessage,
// //   emitTyping,
// // } from '@/lib/socket'
// // import { SOCKET_EVENTS, TYPING_INDICATOR_TIMEOUT } from '@/lib/constants'
// // import { debounce } from '@/lib/chat-utils'
// // import type { Message, User, TypingUser } from '@/types/chat'

// // export const useChat = (userId: string, userName: string) => {
// //   const {
// //     setCurrentUser,
// //     addMessage,
// //     setMessages,
// //     setOnlineUsers,
// //     addTypingUser,
// //     removeTypingUser,
// //     setConnected,
// //     setError,
// //   } = useChatStore()

// //   const typingTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
// //   const typingStatusRef = useRef<boolean>(false)

// //   useEffect(() => {
// //     // Initialize socket connection
// //     const socket = initSocket(userId, userName)

// //     // Set current user
// //     setCurrentUser({
// //       id: userId,
// //       name: userName,
// //       joinedAt: new Date(),
// //     })

// //     // Connection established
// //     socket.on('connect', () => {
// //       console.log('[Chat] Connected to server')
// //       setConnected(true)
// //       setError(null)
// //     })

// //     // Receive message
// //     socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: any) => {
// //       console.log('[Chat] Received message:', data)
// //       const message: Message = {
// //         id: data.id,
// //         // id: data.id || crypto.randomUUID(),
// //         userId: data.userId,
// //         userName: data.userName,
// //         content: data.content,
// //         imageUrl: data.imageUrl,
// //         timestamp: new Date(data.timestamp),
// //       }
// //       addMessage(message)

// //       // Clear typing indicator for this user
// //       removeTypingUser(data.userId)
// //       if (typingTimeoutRef.current[data.userId]) {
// //         clearTimeout(typingTimeoutRef.current[data.userId])
// //         delete typingTimeoutRef.current[data.userId]
// //       }
// //     })

// //     // User typing
// //     socket.on(SOCKET_EVENTS.USER_TYPING, (data: any) => {
// //       const typingUser: TypingUser = {
// //         userId: data.userId,
// //         userName: data.userName,
// //       }
// //       addTypingUser(typingUser)

// //       // Clear existing timeout
// //       if (typingTimeoutRef.current[data.userId]) {
// //         clearTimeout(typingTimeoutRef.current[data.userId])
// //       }

// //       // Set new timeout to remove typing indicator
// //       typingTimeoutRef.current[data.userId] = setTimeout(() => {
// //         removeTypingUser(data.userId)
// //         delete typingTimeoutRef.current[data.userId]
// //       }, TYPING_INDICATOR_TIMEOUT)
// //     })

// //     // User stopped typing
// //     socket.on(SOCKET_EVENTS.USER_STOP_TYPING, (data: any) => {
// //       removeTypingUser(data.userId)
// //       if (typingTimeoutRef.current[data.userId]) {
// //         clearTimeout(typingTimeoutRef.current[data.userId])
// //         delete typingTimeoutRef.current[data.userId]
// //       }
// //     })

// //     // Users list update
// //     socket.on(SOCKET_EVENTS.USERS_LIST, (data: any) => {
// //       console.log('[Chat] Users list updated:', data)
// //       const users: User[] = data.users.map((u: any) => ({
// //         id: u.id,
// //         name: u.name,
// //         joinedAt: new Date(u.joinedAt),
// //       }))
// //       setOnlineUsers(users)
// //     })

// //     // User joined
// //     socket.on(SOCKET_EVENTS.USER_JOINED, (data: any) => {
// //       console.log('[Chat] User joined:', data)
// //       const newUser: User = {
// //         id: data.userId,
// //         name: data.userName,
// //         joinedAt: new Date(data.timestamp),
// //       }
// //       // This will trigger users list update
// //     })

// //     // Error
// //     socket.on(SOCKET_EVENTS.ERROR, (error: any) => {
// //       console.error('[Chat] Socket error:', error)
// //       setError(error.message || 'An error occurred')
// //     })

// //     // Disconnect
// //     socket.on('disconnect', () => {
// //       console.log('[Chat] Disconnected from server')
// //       setConnected(false)
// //     })

// //     // Cleanup
// //     return () => {
// //       // Clean up all typing timeouts
// //       Object.values(typingTimeoutRef.current).forEach(clearTimeout)
// //       // Don't disconnect on unmount - keep connection alive
// //     }
// //   }, [userId, userName, setCurrentUser, addMessage, setOnlineUsers, addTypingUser, removeTypingUser, setConnected, setError])

// //   // Debounced typing indicator
// //   const handleTyping = useCallback(
// //     debounce(() => {
// //       const socket = getSocket()
// //       if (socket?.connected && !typingStatusRef.current) {
// //         typingStatusRef.current = true
// //         emitTyping(true)
// //       }
// //     }, 300),
// //     []
// //   )

// //   const handleStopTyping = useCallback(() => {
// //     const socket = getSocket()
// //     if (socket?.connected && typingStatusRef.current) {
// //       typingStatusRef.current = false
// //       emitTyping(false)
// //     }
// //   }, [])

// //   const sendMessage = useCallback(
// //     (content: string, imageUrl?: string) => {
// //       if (!content.trim() && !imageUrl) return
// //       emitMessage(content, imageUrl)
// //       handleStopTyping()
// //     },
// //     [handleStopTyping]
// //   )

// //   return {
// //     sendMessage,
// //     handleTyping,
// //     handleStopTyping,
// //   }
// // }

// 'use client'

// import { useEffect, useCallback, useRef } from 'react'
// import { useChatStore } from '@/lib/store'
// import {
//   initSocket,
//   getSocket,
//   emitMessage,
//   emitTyping,
// } from '@/lib/socket'
// import {SOCKET_EVENTS,TYPING_INDICATOR_TIMEOUT,} from '@/lib/constants'
// import { debounce } from '@/lib/chat-utils'
// import type {Message,User,TypingUser,} from '@/types/chat'

// type SocketError =
//   | string
//   | {
//     message?: string
//     error?: string
//   }

// export const useChat = (userId: string, userName: string) => {
//   const {
//     setCurrentUser,
//     addMessage,
//     setOnlineUsers,
//     addTypingUser,
//     removeTypingUser,
//     setConnected,
//     setError,
//   } = useChatStore()

//   // const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({})
// const typingTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
//   const typingStatusRef = useRef(false)

//   useEffect(() => {
//     if (!userId || !userName) return

//     // Initialize socket
//     const socket = initSocket(userId, userName)

//     // Set current user
//     setCurrentUser({
//       id: userId,
//       name: userName,
//       joinedAt: new Date(),
//     })

//     // =========================
//     // CONNECT
//     // =========================
//     const handleConnect = () => {
//       console.log('[Chat] Connected')

//       setConnected(true)
//       setError(null)
//     }

//     // =========================
//     // CONNECT ERROR
//     // =========================
//     const handleConnectError = (err: Error) => {
//       console.error(
//         '[Chat] Connection Error:',
//         err
//       )

//       setConnected(false)

//       setError(
//         err?.message || 'Failed to connect'
//       )
//     }

//     // =========================
//     // RECEIVE MESSAGE
//     // =========================
//     const handleReceiveMessage = (
//       data: any
//     ) => {
//       console.log(
//         '[Chat] Received message:',
//         data
//       )

//       // Prevent invalid messages
//       if (!data?.id) return

//       const message: Message = {
//         id: data.id,
//         userId: data.userId,
//         userName: data.userName,
//         content: data.content || '',
//         imageUrl: data.imageUrl || '',
//         timestamp: new Date(data.timestamp),
//       }

//       addMessage(message)

//       // Remove typing indicator
//       removeTypingUser(data.userId)

//       if (
//         typingTimeoutRef.current[data.userId]
//       ) {
//         clearTimeout(
//           typingTimeoutRef.current[data.userId]
//         )

//         delete typingTimeoutRef.current[
//           data.userId
//         ]
//       }
//     }

//     // =========================
//     // USER TYPING
//     // =========================
//     const handleUserTyping = (data: any) => {
//       if (!data?.userId) return

//       const typingUser: TypingUser = {
//         userId: data.userId,
//         userName: data.userName,
//       }

//       addTypingUser(typingUser)

//       // Reset timeout
//       if (
//         typingTimeoutRef.current[data.userId]
//       ) {
//         clearTimeout(
//           typingTimeoutRef.current[data.userId]
//         )
//       }

//       typingTimeoutRef.current[data.userId] =
//         setTimeout(() => {
//           removeTypingUser(data.userId)

//           delete typingTimeoutRef.current[
//             data.userId
//           ]
//         }, TYPING_INDICATOR_TIMEOUT)
//     }

//     // =========================
//     // STOP TYPING
//     // =========================
//     const handleStopTypingUser = (
//       data: any
//     ) => {
//       if (!data?.userId) return

//       removeTypingUser(data.userId)

//       if (
//         typingTimeoutRef.current[data.userId]
//       ) {
//         clearTimeout(
//           typingTimeoutRef.current[data.userId]
//         )

//         delete typingTimeoutRef.current[
//           data.userId
//         ]
//       }
//     }

//     // =========================
//     // USERS LIST
//     // =========================
//     const handleUsersList = (data: any) => {
//       console.log(
//         '[Chat] Users list:',
//         data
//       )

//       if (!data?.users) return

//       const users: User[] = data.users.map(
//         (u: any) => ({
//           id: u.id,
//           name: u.name,
//           joinedAt: new Date(u.joinedAt),
//         })
//       )

//       setOnlineUsers(users)
//     }

//     // =========================
//     // USER JOINED
//     // =========================
//     const handleUserJoined = (data: any) => {
//       console.log(
//         '[Chat] User joined:',
//         data
//       )
//     }

//     // =========================
//     // CHAT ERROR
//     // =========================
//     const handleError = (
//       error: SocketError
//     ) => {
//       console.error(
//         '[Chat] Socket Error:',
//         error
//       )

//       let errorMessage =
//         'An unknown error occurred'

//       if (typeof error === 'string') {
//         errorMessage = error
//       } else if (error?.message) {
//         errorMessage = error.message
//       } else if (error?.error) {
//         errorMessage = error.error
//       }

//       setError(errorMessage)
//     }

//     // =========================
//     // DISCONNECT
//     // =========================
//     const handleDisconnect = (
//       reason: string
//     ) => {
//       console.log(
//         '[Chat] Disconnected:',
//         reason
//       )

//       setConnected(false)
//     }

//     // =========================
//     // REGISTER EVENTS
//     // =========================
//     socket.on('connect', handleConnect)

//     socket.on(
//       'connect_error',
//       handleConnectError
//     )

//     socket.on(
//       SOCKET_EVENTS.RECEIVE_MESSAGE,
//       handleReceiveMessage
//     )

//     socket.on(
//       SOCKET_EVENTS.USER_TYPING,
//       handleUserTyping
//     )

//     socket.on(
//       SOCKET_EVENTS.USER_STOP_TYPING,
//       handleStopTypingUser
//     )

//     socket.on(
//       SOCKET_EVENTS.USERS_LIST,
//       handleUsersList
//     )

//     socket.on(
//       SOCKET_EVENTS.USER_JOINED,
//       handleUserJoined
//     )

//     socket.on(
//       SOCKET_EVENTS.ERROR,
//       handleError
//     )

//     socket.on(
//       'disconnect',
//       handleDisconnect
//     )

//     // =========================
//     // CLEANUP
//     // =========================
//     return () => {
//       Object.values(
//         typingTimeoutRef.current
//       ).forEach(clearTimeout)

//       socket.off('connect', handleConnect)

//       socket.off(
//         'connect_error',
//         handleConnectError
//       )

//       socket.off(
//         SOCKET_EVENTS.RECEIVE_MESSAGE,
//         handleReceiveMessage
//       )

//       socket.off(
//         SOCKET_EVENTS.USER_TYPING,
//         handleUserTyping
//       )

//       socket.off(
//         SOCKET_EVENTS.USER_STOP_TYPING,
//         handleStopTypingUser
//       )

//       socket.off(
//         SOCKET_EVENTS.USERS_LIST,
//         handleUsersList
//       )

//       socket.off(
//         SOCKET_EVENTS.USER_JOINED,
//         handleUserJoined
//       )

//       socket.off(
//         SOCKET_EVENTS.ERROR,
//         handleError
//       )

//       socket.off(
//         'disconnect',
//         handleDisconnect
//       )
//     }
//   }, [
//     userId,
//     userName,
//     setCurrentUser,
//     addMessage,
//     setOnlineUsers,
//     addTypingUser,
//     removeTypingUser,
//     setConnected,
//     setError,
//   ])

//   // =========================
//   // HANDLE TYPING
//   // =========================
//   const handleTyping = useCallback(
//     debounce(() => {
//       const socket = getSocket()

//       if (
//         socket?.connected &&
//         !typingStatusRef.current
//       ) {
//         typingStatusRef.current = true

//         emitTyping(true)
//       }
//     }, 300),
//     []
//   )

//   // =========================
//   // HANDLE STOP TYPING
//   // =========================
//   const handleStopTyping =
//     useCallback(() => {
//       const socket = getSocket()

//       if (
//         socket?.connected &&
//         typingStatusRef.current
//       ) {
//         typingStatusRef.current = false

//         emitTyping(false)
//       }
//     }, [])

//   // =========================
//   // SEND MESSAGE
//   // =========================
//   const sendMessage = useCallback(
//     (
//       content: string,
//       imageUrl?: string
//     ) => {
//       if (
//         !content.trim() &&
//         !imageUrl
//       ) {
//         return
//       }

//       emitMessage(content, imageUrl)

//       handleStopTyping()
//     },
//     [handleStopTyping]
//   )

//   return {
//     sendMessage,
//     handleTyping,
//     handleStopTyping,
//   }
// }



'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useChatStore } from '@/lib/store'
import {
  initSocket,
  getSocket,
  disconnectSocket,
  emitMessage,
  emitTyping,
} from '@/lib/socket'
import { SOCKET_EVENTS, TYPING_INDICATOR_TIMEOUT } from '@/lib/constants'
import { debounce } from '@/lib/chat-utils'
import type { Message, User, TypingUser } from '@/types/chat'

export const useChat = (userId: string, userName: string) => {
  const {
    setCurrentUser,
    addMessage,
    setMessages,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
    setConnected,
    setError,
  } = useChatStore()

  const typingTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
  const typingStatusRef = useRef<boolean>(false)

  useEffect(() => {
    // Initialize socket connection
    const socket = initSocket(userId, userName)

    // Set current user
    setCurrentUser({
      id: userId,
      name: userName,
      joinedAt: new Date(),
    })

    // Connection established
    socket.on('connect', () => {
      console.log('[Chat] Connected to server')
      setConnected(true)
      setError(null)
    })

    // Receive message
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data: any) => {
      console.log('[Chat] Received message:', data)
      const message: Message = {
        id: data.id || crypto.randomUUID(),
        userId: data.userId,
        userName: data.userName,
        content: data.content,
        imageUrl: data.imageUrl,
        timestamp: new Date(data.timestamp),
      }
      addMessage(message)

      // Clear typing indicator for this user
      removeTypingUser(data.userId)
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId])
        delete typingTimeoutRef.current[data.userId]
      }
    })

    // User typing
    socket.on(SOCKET_EVENTS.USER_TYPING, (data: any) => {
      const typingUser: TypingUser = {
        userId: data.userId,
        userName: data.userName,
      }
      addTypingUser(typingUser)

      // Clear existing timeout
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId])
      }

      // Set new timeout to remove typing indicator
      typingTimeoutRef.current[data.userId] = setTimeout(() => {
        removeTypingUser(data.userId)
        delete typingTimeoutRef.current[data.userId]
      }, TYPING_INDICATOR_TIMEOUT)
    })

    // User stopped typing
    socket.on(SOCKET_EVENTS.USER_STOP_TYPING, (data: any) => {
      removeTypingUser(data.userId)
      if (typingTimeoutRef.current[data.userId]) {
        clearTimeout(typingTimeoutRef.current[data.userId])
        delete typingTimeoutRef.current[data.userId]
      }
    })

    // Users list update
    socket.on(SOCKET_EVENTS.USERS_LIST, (data: any) => {
      console.log('[Chat] Users list updated:', data)
      const users: User[] = data.users.map((u: any) => ({
        id: u.id,
        name: u.name,
        joinedAt: new Date(u.joinedAt),
      }))
      setOnlineUsers(users)
    })

    // User joined
    socket.on(SOCKET_EVENTS.USER_JOINED, (data: any) => {
      console.log('[Chat] User joined:', data)
      const newUser: User = {
        id: data.userId,
        name: data.userName,
        joinedAt: new Date(data.timestamp),
      }
      // This will trigger users list update
    })

    // Error
    socket.on(SOCKET_EVENTS.ERROR, (error: any) => {
      console.error('[Chat] Socket error:', error)
      setError(error.message || 'An error occurred')
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('[Chat] Disconnected from server')
      setConnected(false)
    })

    // Cleanup
    return () => {
      // Clean up all typing timeouts
      Object.values(typingTimeoutRef.current).forEach(clearTimeout)
      // Don't disconnect on unmount - keep connection alive
    }
  }, [userId, userName, setCurrentUser, addMessage, setOnlineUsers, addTypingUser, removeTypingUser, setConnected, setError])

  // Debounced typing indicator
  const handleTyping = useCallback(
    debounce(() => {
      const socket = getSocket()
      if (socket?.connected && !typingStatusRef.current) {
        typingStatusRef.current = true
        emitTyping(true)
      }
    }, 300),
    []
  )

  const handleStopTyping = useCallback(() => {
    const socket = getSocket()
    if (socket?.connected && typingStatusRef.current) {
      typingStatusRef.current = false
      emitTyping(false)
    }
  }, [])

  const sendMessage = useCallback(
    (content: string, imageUrl?: string) => {
      if (!content.trim() && !imageUrl) return
      emitMessage(content, imageUrl)
      handleStopTyping()
    },
    [handleStopTyping]
  )

  return {
    sendMessage,
    handleTyping,
    handleStopTyping,
  }
}

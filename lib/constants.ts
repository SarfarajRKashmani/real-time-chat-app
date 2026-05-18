// Socket.IO Event Names
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Chat
  JOIN_CHAT: 'join-chat',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  MESSAGE_SENT: 'message-sent',

  // Typing
  TYPING: 'typing',
  STOP_TYPING: 'stop-typing',
  USER_TYPING: 'user-typing',
  USER_STOP_TYPING: 'user-stop-typing',

  // Users
  USERS_LIST: 'users-list',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',

  // Errors
  // ERROR: 'error',
  ERROR: 'chat:error'
}

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// UI
export const TYPING_INDICATOR_TIMEOUT = 3000
export const MESSAGE_ANIMATION_DURATION = 300
export const DEBOUNCE_DELAY = 300

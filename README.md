# Real-Time Chat Application

A modern, full-stack real-time chat application built with Next.js, Socket.IO, and Express.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO bidirectional communication
- **User Management**: Join chat with your name and see online users in real-time
- **Typing Indicators**: See when other users are typing
- **Image Sharing**: Upload and share images in the chat
- **Emoji Picker**: Insert emojis directly into messages
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Message History**: View message history when joining the chat
- **Animated UI**: Smooth animations with Framer Motion

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Socket.IO Client** for real-time communication
- **Zustand** for state management
- **Framer Motion** for animations
- **next-themes** for dark mode support
- **emoji-picker-react** for emoji selection

### Backend
- **Express.js** web framework
- **Socket.IO** for real-time events
- **Node.js** runtime
- In-memory store for data persistence (can be upgraded to MongoDB)

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. **Install Frontend Dependencies**
   ```bash
   pnpm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   pnpm install
   cd ..
   ```

### Development

Run both frontend and backend servers:

1. **Terminal 1 - Frontend**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`

2. **Terminal 2 - Backend**
   ```bash
   cd server
   pnpm dev
   ```
   The backend server will run on `http://localhost:3001`

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Backend** (`server/.env`):
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Project Structure

```
├── app/
│   ├── page.tsx                 # Join page
│   ├── chat/
│   │   └── page.tsx            # Chat page
│   ├── layout.tsx              # Root layout with theme provider
│   └── globals.css             # Global styles
├── components/
│   ├── chat/
│   │   ├── Message.tsx         # Individual message bubble
│   │   ├── MessageList.tsx     # Message list with scrolling
│   │   ├── ChatInput.tsx       # Input field with emoji picker and image upload
│   │   ├── ChatHeader.tsx      # Header with user count
│   │   ├── Sidebar.tsx         # Online users list
│   │   └── TypingIndicator.tsx # Typing animation
│   └── common/
│       └── ThemeToggle.tsx     # Dark/light mode toggle
├── hooks/
│   └── useChat.ts             # Custom hook for chat logic
├── lib/
│   ├── store.ts               # Zustand store
│   ├── socket.ts              # Socket.IO client
│   ├── chat-utils.ts          # Helper functions
│   ├── constants.ts           # Constants and event names
│   └── utils.ts               # General utilities
├── types/
│   └── chat.ts                # TypeScript interfaces
└── server/
    └── src/
        ├── server.ts          # Express server with Socket.IO
        ├── store.ts           # In-memory chat store
        └── ...
```

## How to Use

1. **Join the Chat**
   - Enter your name (2-30 characters)
   - Click "Join Chat"

2. **Send Messages**
   - Type a message in the input field
   - Add emojis using the emoji picker button
   - Add images using the image button
   - Press Enter or click the send button

3. **See Typing Status**
   - Watch the "User is typing..." indicator
   - It automatically clears when they send a message

4. **Toggle Theme**
   - Click the moon/sun icon in the header
   - Theme preference is saved locally

5. **Leave Chat**
   - Click the "Leave" button to disconnect

## Socket.IO Events

### Client to Server
- `join-chat`: Join with user ID and name
- `send-message`: Send a message with content and optional image
- `typing`: Notify when user starts typing
- `stop-typing`: Notify when user stops typing

### Server to Client
- `users-list`: List of currently online users
- `user-joined`: New user joined notification
- `receive-message`: New message received
- `user-typing`: User typing indicator
- `user-stop-typing`: User stopped typing
- `message-history`: Previous messages (on join)
- `user-left`: User left notification

## Deployment

### Deploy to Vercel
The frontend can be deployed directly to Vercel:
```bash
vercel deploy
```

### Backend Deployment
For production, deploy the backend to a service like:
- Railway
- Render
- Heroku
- AWS EC2

Update the `NEXT_PUBLIC_SOCKET_URL` environment variable to point to your deployed backend.

## Features Coming Soon

- Message editing and deletion
- User profiles and avatars
- Private messages
- Chat rooms
- Message search
- Voice/video calls
- Message reactions

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.

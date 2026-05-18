export const getAvatarColor = (userId: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ]
  const hash = userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1)
  return colors[hash % colors.length]
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()

  // Less than 1 minute
  if (diff < 60000) {
    return 'now'
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }

  // Format as date
  const date2 = new Date(date)
  return date2.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const parseEmojis = (text: string): string => {
  return text
}

export const validateUsername = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }
  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  if (name.length > 30) {
    return { valid: false, error: 'Name must be less than 30 characters' }
  }
  return { valid: true }
}

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

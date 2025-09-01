import { io, Socket } from 'socket.io-client'

// Socket.IO client setup
let socket: Socket | null = null

export const initializeSocket = (gameId: string, playerAddress: string) => {
  if (!socket) {
    // Connect to Socket.IO server (you'll need to set up a server)
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002', {
      query: {
        gameId,
        playerAddress
      }
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error)
    })
  }

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Game event types
export interface GameEvent {
  type: 'player_joined' | 'player_left' | 'game_started' | 'question_started' | 'answer_submitted' | 'game_ended'
  data: any
}

// Emit game events
export const emitGameEvent = (event: GameEvent) => {
  if (socket) {
    socket.emit('game_event', event)
  }
}

// Listen for game events
export const onGameEvent = (callback: (event: GameEvent) => void) => {
  if (socket) {
    socket.on('game_event', callback)
  }
}

// Remove game event listener
export const offGameEvent = (callback: (event: GameEvent) => void) => {
  if (socket) {
    socket.off('game_event', callback)
  }
}

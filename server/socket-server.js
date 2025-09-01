const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store active games
const activeGames = new Map()

io.on('connection', (socket) => {
  const { gameId, playerAddress } = socket.handshake.query
  
  console.log(`Player ${playerAddress} connected to game ${gameId}`)
  
  // Join the game room
  socket.join(gameId)
  
  // Initialize game if it doesn't exist
  if (!activeGames.has(gameId)) {
    activeGames.set(gameId, {
      players: [],
      currentQuestion: null,
      gameState: 'waiting',
      questions: []
    })
  }
  
  const game = activeGames.get(gameId)
  
  // Add player to game
  const player = {
    address: playerAddress,
    score: 0,
    currentQuestion: 0,
    isFinished: false,
    answers: []
  }
  
  game.players.push(player)
  
  // Notify all players in the game
  io.to(gameId).emit('game_event', {
    type: 'player_joined',
    data: { player }
  })
  
  // Handle game events
  socket.on('game_event', (event) => {
    console.log(`Game event: ${event.type}`, event.data)
    
    switch (event.type) {
      case 'player_joined':
        // Player already added above
        break
        
      case 'player_left':
        game.players = game.players.filter(p => p.address !== event.data.playerAddress)
        io.to(gameId).emit('game_event', event)
        break
        
      case 'game_started':
        game.gameState = 'playing'
        io.to(gameId).emit('game_event', event)
        break
        
      case 'question_started':
        game.currentQuestion = event.data.question
        io.to(gameId).emit('game_event', event)
        break
        
      case 'answer_submitted':
        // Update player's answer
        const playerIndex = game.players.findIndex(p => p.address === event.data.playerAddress)
        if (playerIndex !== -1) {
          game.players[playerIndex].answers.push({
            questionId: event.data.questionId,
            selectedAnswer: event.data.answerIndex,
            timeSpent: event.data.timeSpent,
            isCorrect: false, // Will be calculated based on correct answer
            score: 0 // Will be calculated
          })
        }
        io.to(gameId).emit('game_event', event)
        break
        
      case 'game_ended':
        game.gameState = 'finished'
        io.to(gameId).emit('game_event', event)
        break
    }
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player ${playerAddress} disconnected from game ${gameId}`)
    
    // Remove player from game
    game.players = game.players.filter(p => p.address !== playerAddress)
    
    // Notify remaining players
    io.to(gameId).emit('game_event', {
      type: 'player_left',
      data: { playerAddress }
    })
    
    // Clean up empty games
    if (game.players.length === 0) {
      activeGames.delete(gameId)
    }
  })
})

const PORT = process.env.SOCKET_PORT || 3002

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

import { useState, useEffect, useCallback } from 'react'
import { initializeSocket, disconnectSocket, emitGameEvent, onGameEvent, offGameEvent, GameEvent } from '../lib/socket'
import { QuizRound, Player } from '../types/global'

interface UseRealtimeQuizProps {
  gameId: string
  playerAddress: string
  onPlayersUpdate?: (players: Player[]) => void
  onGameStart?: () => void
  onQuestionStart?: (question: QuizRound) => void
  onGameEnd?: (results: any) => void
}

export const useRealtimeQuiz = ({
  gameId,
  playerAddress,
  onPlayersUpdate,
  onGameStart,
  onQuestionStart,
  onGameEnd
}: UseRealtimeQuizProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QuizRound | null>(null)
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting')

  // Initialize socket connection
  useEffect(() => {
    const socket = initializeSocket(gameId, playerAddress)
    
    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to real-time quiz')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from real-time quiz')
    })

    // Listen for game events
    const handleGameEvent = (event: GameEvent) => {
      switch (event.type) {
        case 'player_joined':
          setPlayers(prev => {
            const newPlayers = [...prev, event.data.player]
            onPlayersUpdate?.(newPlayers)
            return newPlayers
          })
          break
          
        case 'player_left':
          setPlayers(prev => {
            const newPlayers = prev.filter(p => p.address !== event.data.playerAddress)
            onPlayersUpdate?.(newPlayers)
            return newPlayers
          })
          break
          
        case 'game_started':
          setGameState('playing')
          onGameStart?.()
          break
          
        case 'question_started':
          setCurrentQuestion(event.data.question)
          onQuestionStart?.(event.data.question)
          break
          
        case 'game_ended':
          setGameState('finished')
          onGameEnd?.(event.data.results)
          break
      }
    }

    onGameEvent(handleGameEvent)

    // Cleanup
    return () => {
      offGameEvent(handleGameEvent)
      disconnectSocket()
    }
  }, [gameId, playerAddress, onPlayersUpdate, onGameStart, onQuestionStart, onGameEnd])

  // Join game
  const joinGame = useCallback(() => {
    emitGameEvent({
      type: 'player_joined',
      data: { player: { address: playerAddress, score: 0, currentQuestion: 0, isFinished: false, answers: [] } }
    })
  }, [playerAddress])

  // Leave game
  const leaveGame = useCallback(() => {
    emitGameEvent({
      type: 'player_left',
      data: { playerAddress }
    })
  }, [playerAddress])

  // Submit answer
  const submitAnswer = useCallback((questionId: string, answerIndex: number, timeSpent: number) => {
    emitGameEvent({
      type: 'answer_submitted',
      data: {
        playerAddress,
        questionId,
        answerIndex,
        timeSpent
      }
    })
  }, [playerAddress])

  return {
    isConnected,
    players,
    currentQuestion,
    gameState,
    joinGame,
    leaveGame,
    submitAnswer
  }
}

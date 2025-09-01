'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ethers } from 'ethers'

// Contract ABI (simplified for enterGame function)
const QUIZ_GAME_ABI = [
  "function enterGame(uint256 gameId, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external payable",
  "function currentGameId() external view returns (uint256)",
  "function games(uint256) external view returns (uint256 entryFee, uint256 totalEntries, bool isActive, uint256 startTime, uint256 endTime, uint256 categoryId, bool isStarted)"
]

interface Player {
  address: string
  joinedAt: number
}

export default function LobbyPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const gameId = params.gameId as string
  const category = searchParams.get('category') || 'technology'
  
  const [players, setPlayers] = useState<Player[]>([])
  const [playerCount, setPlayerCount] = useState(0)
  const [maxPlayers] = useState(20)
  const [minPlayers] = useState(2) // Test için 2 kişi yeterli
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isLoading, setIsLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')

  useEffect(() => {
    checkConnection()
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate players joining (for testing, start with 1 player)
    const mockPlayers: Player[] = [
      { address: '0x3C44...dD82', joinedAt: Date.now() - 30000 },
    ]
    
    setPlayers(mockPlayers)
    setPlayerCount(mockPlayers.length)
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const handleJoinGame = async () => {
    // For demo purposes, skip wallet connection

    setIsLoading(true)
    
    try {
      // Simulate joining the game (payment already done in categories page)
      console.log('Joining game...')
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add current player to the list
      const newPlayer: Player = {
        address: `Demo Player ${Math.floor(Math.random() * 1000)}`,
        joinedAt: Date.now()
      }
      
      setPlayers(prev => [...prev, newPlayer])
      setPlayerCount(prev => {
        const newCount = prev + 1
        console.log(`Player count: ${newCount}/${minPlayers}`)
        
        // Check if enough players joined to start the game
        if (newCount >= minPlayers && !gameStarted) {
          console.log('🎉 Enough players! Starting quiz...')
          setGameStarted(true)
          setTimeout(() => {
            router.push(`/quiz/${gameId}?category=${category}`)
          }, 2000)
        }
        
        return newCount
      })
      
      console.log('Successfully joined game!')
      
    } catch (error) {
      console.error('Error joining game:', error)
      alert('Failed to join game. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Game Lobby
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Category: <span className="font-semibold capitalize">{category.replace('-', ' ')}</span>
        </p>
        <p className="text-lg text-gray-500">
          Waiting for other players to join...
        </p>
      </motion.div>

      {/* Demo Mode Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mb-8"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800">Demo Mode - Ready to Play!</span>
          </div>
        </div>
      </motion.div>

      {/* Game Info */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">{playerCount}</div>
              <div className="text-sm text-gray-500">Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600">{minPlayers}</div>
              <div className="text-sm text-gray-500">Required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">Time Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gray-200 rounded-full h-4">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(playerCount / minPlayers) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {playerCount} of {minPlayers} players joined
        </div>
      </div>

      {/* Players List */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Players in Lobby</h3>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-mono text-gray-700">{player.address}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.floor((Date.now() - player.joinedAt) / 1000)}s ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Button */}
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={handleJoinGame}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Joining Game...
            </div>
          ) : (
            'Join Game'
          )}
        </motion.button>
      </div>

      {/* Game Started Message */}
      {gameStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Game Starting!</h3>
            <p className="text-gray-600">Redirecting to quiz...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

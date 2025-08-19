'use client'

import React, { useState, useEffect } from 'react'
import { IDKitWidget } from '@worldcoin/idkit'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Play, 
  Shield, 
  Award,
  Zap
} from 'lucide-react'

interface GameInfo {
  gameId: number
  startTime: number
  endTime: number
  totalPrizePool: number
  playerCount: number
  isActive: boolean
  isFinished: boolean
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [currentGame, setCurrentGame] = useState<GameInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkConnection()
    fetchCurrentGame()
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

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        setIsConnected(true)
      } catch (error) {
        setError('Failed to connect wallet')
      }
    } else {
      setError('Please install MetaMask')
    }
  }

  const fetchCurrentGame = async () => {
    // This would fetch from your backend/contract
    // For demo purposes, using mock data
    setCurrentGame({
      gameId: 1,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + 300,
      totalPrizePool: 5000000, // 5 USDC
      playerCount: 3,
      isActive: true,
      isFinished: false
    })
  }

  const handleVerify = async (proof: any) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Here you would call your backend to verify the proof
      // and then call the smart contract
      console.log('World ID proof:', proof)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to quiz or show success
      window.location.href = '/quiz'
    } catch (error) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const skipVerification = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = '/quiz'
    }, 500)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString()
  }

  const formatUSDC = (amount: number) => {
    return (amount / 1000000).toFixed(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🎯 Quiz Chain
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join the ultimate quiz experience on World Chain. Prove you're human, pay the entry fee, 
          and compete for prizes!
        </p>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md mx-auto mb-8"
      >
        {!isConnected ? (
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">Connect your wallet to start playing</p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 mb-2">Connected</p>
            <p className="text-xs text-gray-500 font-mono">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        )}
      </motion.div>

      {/* Current Game Info */}
      {currentGame && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Current Game #{currentGame.gameId}</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-success-600 font-medium">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{formatUSDC(currentGame.totalPrizePool)}</p>
              <p className="text-sm text-gray-600">Prize Pool</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{currentGame.playerCount}</p>
              <p className="text-sm text-gray-600">Players</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-danger-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-800">
                {Math.max(0, Math.floor((currentGame.endTime - Date.now() / 1000) / 60))}
              </p>
              <p className="text-sm text-gray-600">Minutes Left</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-success-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-800">1.00</p>
              <p className="text-sm text-gray-600">Entry Fee</p>
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Prize Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>1st Place</span>
                </div>
                <span className="font-semibold">50%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span>2nd Place</span>
                </div>
                <span className="font-semibold">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>3rd Place</span>
                </div>
                <span className="font-semibold">20%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* World ID Verification */}
      {isConnected && currentGame && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md mx-auto"
        >
          <div className="text-center">
            <Zap className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verify Your Humanity</h3>
            <p className="text-gray-600 mb-6">
              Prove you're human using World ID to join the quiz
            </p>
            
            <IDKitWidget
              app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID || "app_staging_1234567890"}
              action="quiz_verification"
              signal={account}
              onSuccess={handleVerify}
            >
              {({ open }) => (
                <button 
                  onClick={open}
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {isLoading ? 'Verifying...' : 'Verify with World ID'}
                </button>
              )}
            </IDKitWidget>
            
            <button 
              onClick={skipVerification}
              disabled={isLoading}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Skip Verification (Demo)'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md mx-auto mt-4 border-danger-200 bg-danger-50"
        >
          <p className="text-danger-600 text-center">{error}</p>
        </motion.div>
      )}

      {/* Features */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 grid md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">World ID Verification</h3>
          <p className="text-gray-600">Prove you're human with zero-knowledge proofs</p>
        </div>
        <div className="text-center">
          <Trophy className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Real Prizes</h3>
          <p className="text-gray-600">Win USDC prizes distributed automatically</p>
        </div>
        <div className="text-center">
          <Play className="w-12 h-12 text-success-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Competition</h3>
          <p className="text-gray-600">Compete in real-time with players worldwide</p>
        </div>
      </motion.div>
    </div>
  )
}

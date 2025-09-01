'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Brain, 
  Globe, 
  Music, 
  Gamepad2, 
  Palette, 
  BookOpen, 
  Trophy,
  Users,
  Clock,
  DollarSign,
  Type,
  Image as ImageIcon,
  Shield,
  CheckCircle
} from 'lucide-react'
import { initializeContract, QuizType, getCategoryInfo, getCategoryCount } from '../../lib/contract'
import { useWorldId } from '../../hooks/useWorldId'
import { WorldIdWidget } from '../../components/WorldIdWidget'

interface Category {
  id: number
  name: string
  description: string
  questionCount: number
  activeGames: number
  playersWaiting: number
  entryFee: number // ETH cinsinden
  prizePool: number // ETH cinsinden
  icon: React.ReactNode
  color: string
  supportsImageReveal: boolean
}

const categories: Category[] = [
  {
    id: 1,
    name: "Technology & AI",
    description: "Latest tech trends, AI breakthroughs, programming, and digital innovations",
    questionCount: 20,
    activeGames: 5,
    playersWaiting: 18,
    entryFee: 0.002,
    prizePool: 0.01,
    icon: <Zap className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    supportsImageReveal: true
  },
  {
    id: 2,
    name: "Science & Discovery",
    description: "Physics, chemistry, biology, space exploration, and scientific breakthroughs",
    questionCount: 18,
    activeGames: 4,
    playersWaiting: 15,
    entryFee: 0.002,
    prizePool: 0.01,
    icon: <Brain className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    supportsImageReveal: true
  },
  {
    id: 3,
    name: "History & Culture",
    description: "Ancient civilizations, world wars, historical events, and cultural heritage",
    questionCount: 16,
    activeGames: 3,
    playersWaiting: 12,
    entryFee: 0.002,
    prizePool: 0.01,
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500",
    supportsImageReveal: true
  },
  {
    id: 4,
    name: "Geography & Travel",
    description: "Countries, capitals, landmarks, world geography, and travel destinations",
    questionCount: 18,
    activeGames: 4,
    playersWaiting: 14,
    entryFee: 0.002,
    prizePool: 0.01,
    icon: <Globe className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500",
    supportsImageReveal: true
  },
  {
    id: 5,
    name: "Entertainment & Sports",
    description: "Movies, music, sports, celebrities, and pop culture",
    questionCount: 20,
    activeGames: 6,
    playersWaiting: 22,
    entryFee: 0.002,
    prizePool: 0.01,
    icon: <Music className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
    supportsImageReveal: true
  }
]

export default function CategoriesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
          const { isVerified: worldIdVerified, verificationData, error: worldIdError, handleVerificationSuccess, handleVerificationError } = useWorldId()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // World ID demo state (for backward compatibility)


  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await initializeContract()
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await initializeContract()
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask')
    }
  }



  const handleCategorySelect = async (category: Category) => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setSelectedCategory(category)
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    if (!selectedCategory || !isConnected) return

    setIsLoading(true)
    
    try {
      console.log(`Paying ${selectedCategory.entryFee} ETH for ${selectedCategory.name} - Mixed Quiz`)
      
      // Gerçek smart contract entegrasyonu
      const { ethers } = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Contract address ve ABI'yi import et
      const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' // Yeni deploy edilen address
      const contractABI = [
        "function payEntryFee(uint256 categoryId) external payable",
        "function getEntryFee(uint256 categoryId) external view returns (uint256)",
        "function getPrizePool(uint256 categoryId) external view returns (uint256)"
      ]
      
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      
      // Entry fee ödemesi
      const entryFeeWei = ethers.parseEther(selectedCategory.entryFee.toString())
      const tx = await contract.payEntryFee(selectedCategory.id, { value: entryFeeWei })
      
      console.log('Transaction sent:', tx.hash)
      
      // Transaction'ın onaylanmasını bekle
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      
      // Show success message
      alert(`Payment successful! You paid ${selectedCategory.entryFee} ETH for ${selectedCategory.name}`)
      
      // Generate game ID and navigate to lobby
      const gameId = Math.floor(Math.random() * 1000) + 1
      router.push(`/lobby/${gameId}?category=${selectedCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}&quizType=mixed`)
      
    } catch (error) {
      console.error('Payment failed:', error)
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
      setShowPaymentModal(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Choose Your Category
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Select a category and enjoy mixed quizzes with both text and image questions!
        </p>
        
        {/* Connection Status */}
        {!isConnected ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800">Wallet not connected</span>
              <button 
                onClick={connectWallet}
                className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-800">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>
          </div>
        )}

        {/* World ID Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-md mx-auto"
        >
          {!worldIdVerified ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">World ID Verification (Optional)</span>
              </div>
              <WorldIdWidget
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
              />
              <p className="text-xs text-blue-600 mt-2 text-center">
                World ID verification is optional but recommended for fair gameplay.
              </p>
              {worldIdError && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  ⚠️ {worldIdError}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Verified with World ID</span>
              </div>
              <p className="text-xs text-green-600 mt-1 text-center">
                Nullifier: {verificationData?.nullifier_hash?.slice(0, 20)}...
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => handleCategorySelect(category)}
          >
            <div className="text-center">
              {/* Category Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {category.icon}
                </div>
              </div>
              
              {/* Category Info */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              
              {/* Quiz Type Support */}
              <div className="flex justify-center space-x-2 mb-4">
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Type className="w-3 h-3" />
                  <span>MIXED QUIZ</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-purple-600">
                  <ImageIcon className="w-3 h-3" />
                  <span>TEXT + IMAGE</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-primary-600">{category.questionCount}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-secondary-600">{category.activeGames}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-success-600">{category.playersWaiting}</div>
                  <div className="text-xs text-gray-500">Waiting</div>
                </div>
              </div>
              
              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-bold text-primary-600">{category.entryFee} ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Prize Pool:</span>
                  <span className="font-bold text-success-600">{category.prizePool} ETH</span>
                </div>
              </div>
              
              {/* Join Button */}
              <button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  !isConnected
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${category.color} hover:shadow-lg text-white`
                }`}
                disabled={!isConnected}
              >
                {!isConnected ? 'Connect Wallet' : 'Select Quiz Type'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quiz Type Selection Modal */}


      {/* Payment Modal */}
      {showPaymentModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold text-center mb-4">Confirm Payment</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span>Category:</span>
                <span className="font-semibold">{selectedCategory.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quiz Type:</span>
                <span className="font-semibold">Mixed Quiz (Text + Image)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Entry Fee:</span>
                <span className="font-bold text-primary-600">{selectedCategory.entryFee} ETH</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prize Pool:</span>
                <span className="font-bold text-success-600">{selectedCategory.prizePool} ETH</span>
              </div>
              {worldIdVerified && (
                <div className="flex justify-between items-center">
                  <span>World ID:</span>
                  <span className="font-semibold text-green-600">✓ Verified</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Pay & Join'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center mx-auto space-x-2"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>
      </motion.div>
    </div>
  )
}

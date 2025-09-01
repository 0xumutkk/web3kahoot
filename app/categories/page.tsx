'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Brain, 
  Globe, 
  Music, 
  Shield,
  CheckCircle
} from 'lucide-react'
import { useWorldId } from '../../hooks/useWorldId'
import { WorldIdWidget } from '../../components/WorldIdWidget'
import { toast } from 'react-hot-toast';
import { useWallet } from '../../hooks/useWallet'
import { joinOrCreateGame } from '../../lib/contract'

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
}

const categoriesData: Category[] = [
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
    icon: <Globe className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500",
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
  }
]

export default function CategoriesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const { isConnected, account, chainId, connect: connectWallet, switchNetwork, error: walletError } = useWallet()
  const { isVerified: worldIdVerified, verificationData, error: worldIdError, handleVerificationSuccess, handleVerificationError } = useWorldId()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const HARDHAT_CHAIN_ID = 31337;

  useEffect(() => {
    if (walletError) {
      toast.error(walletError);
    }
  }, [walletError]);


  const handleCategorySelect = async (category: Category) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (chainId !== HARDHAT_CHAIN_ID) {
      try {
        await switchNetwork(HARDHAT_CHAIN_ID);
        toast.success("Switched to Hardhat Network!");
      } catch (error) {
        toast.error("Failed to switch to Hardhat network. Please do it manually.");
        return;
      }
    }

    setSelectedCategory(category)
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    if (!selectedCategory || !isConnected) return

    if (chainId !== HARDHAT_CHAIN_ID) {
      toast.error("Please switch to the Hardhat network before paying.");
      return;
    }

    setIsPaying(true)
    const toastId = toast.loading('Preparing transaction...');
    
    try {
      console.log(`Paying ${selectedCategory.entryFee} ETH for ${selectedCategory.name} - Mixed Quiz`)
      
      toast.loading('Please confirm the transaction in your wallet.', { id: toastId });

      // Call the robust, centralized function from lib/contract.ts
      const gameId = await joinOrCreateGame(selectedCategory.id);
      
      console.log('Transaction confirmed, received game ID:', gameId);
      
      toast.success('Payment successful! Joining the lobby...', { id: toastId });
      
      router.push(`/lobby/${gameId}`)
      
    } catch (error: any) {
      console.error('Payment failed:', error)
      const errorMessage = error.reason || (error.message ? error.message.split('(')[0] : 'Unknown error');
      toast.error(`Payment failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsPaying(false)
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
              <span className="text-green-800">Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</span>
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
        {categoriesData.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="text-center flex-grow">
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
                  <span>MIXED QUIZ:</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-purple-600">
    
                  <span>TEXT + IMAGE</span>
                </div>
              </div>
              
              {/* Stats and Payment Info will go here */}
              
              {/* Join Button */}
              <button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-auto ${
                  !isConnected
                    ? 'bg-gray-300 hover:bg-gray-400'
                    : `bg-gradient-to-r ${category.color} hover:shadow-lg text-white`
                }`}
                onClick={() => isConnected ? handleCategorySelect(category) : connectWallet()}
              >
                {!isConnected ? 'Connect Wallet' : 'Join Quiz'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

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
                disabled={isPaying}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                disabled={isPaying}
              >
                {isPaying ? (
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

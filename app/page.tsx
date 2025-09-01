'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Zap, Users, Trophy, CheckCircle } from 'lucide-react'
import { useWorldId } from '../hooks/useWorldId'
import { WorldIdWidget } from '../components/WorldIdWidget'

export default function HomePage() {
  const { isVerified, verificationData, isLoading, error, handleVerificationSuccess, handleVerificationError, resetVerification } = useWorldId()

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Chain
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Blockchain-powered quiz platform with World ID verification
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">World ID Verified</h3>
            <p className="text-gray-600">Proof-of-personhood verification for fair gameplay</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instant Rewards</h3>
            <p className="text-gray-600">Earn tokens for correct answers and quick responses</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Users className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multiplayer</h3>
            <p className="text-gray-600">Compete with other verified players in real-time</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <Trophy className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Leaderboards</h3>
            <p className="text-gray-600">Track your progress and compete for top positions</p>
          </div>
        </motion.div>

        {/* World ID Verification Section */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">World ID Verification</h2>
            </div>
            {isVerified && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Verified</span>
              </div>
            )}
          </div>

          {!isVerified ? (
            <div className="space-y-4">
              <WorldIdWidget
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
              />
              {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Verifying with World ID...</span>
                </div>
              )}
              <p className="text-sm text-gray-600">
                World ID verification is optional but recommended for fair gameplay.
              </p>
              {error && (
                <p className="text-sm text-red-600">
                  ⚠️ {error}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Verification Successful</span>
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  <p><strong>Nullifier Hash:</strong> {verificationData?.nullifier_hash?.slice(0, 20)}...</p>
                  <p><strong>Credential Type:</strong> {verificationData?.credential_type}</p>
                  <p><strong>Status:</strong> World ID Verified</p>
                </div>
              </div>
              <button
                onClick={resetVerification}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Reset Verification
              </button>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Link href="/categories">
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg">
              Start Playing
            </button>
          </Link>
          
          <Link href="/categories">
            <button className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Browse Categories
            </button>
          </Link>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className="mt-12 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>Built on World Chain • Powered by World ID • Secure & Fair Gaming</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

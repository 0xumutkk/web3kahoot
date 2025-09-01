import React from 'react'
import { motion } from 'framer-motion'
import TestImageReveal from '../../components/TestImageReveal'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎯 IMAGE_REVEAL Quiz Demo
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Test the new blur-to-sharp image reveal functionality
        </p>
        <p className="text-lg text-gray-500">
          Images start heavily blurred and gradually become clearer over 30 seconds
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <TestImageReveal />
      </div>
      
      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How IMAGE_REVEAL Works</h3>
          <ul className="text-blue-700 text-left space-y-2">
            <li>• Images start with 24px blur</li>
            <li>• Blur decreases linearly over 30 seconds</li>
            <li>• Faster answers earn bonus points</li>
            <li>• Progress bar shows reveal percentage</li>
            <li>• Works alongside traditional TEXT questions</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 text-center space-x-4">
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Home
        </a>
        <a 
          href="/categories" 
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Full Quiz
        </a>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageRevealQuiz } from '../types/global'

interface ImageRevealQuestionProps {
  question: ImageRevealQuiz
  timeLeft: number
  totalTime: number
  onAnswerSelect: (answerIndex: number) => void
  isAnswered: boolean
  selectedAnswer: number | null
  correctAnswer: number
}

export default function ImageRevealQuestion({
  question,
  timeLeft,
  totalTime,
  onAnswerSelect,
  isAnswered,
  selectedAnswer,
  correctAnswer
}: ImageRevealQuestionProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // Calculate blur amount based on time remaining
  const blurAmount = Math.max(0, (timeLeft / totalTime) * question.blurMaxPx)
  
  // Calculate reveal progress (0 to 1)
  const revealProgress = 1 - (timeLeft / totalTime)

  const getAnswerClass = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index 
        ? "bg-primary-200 border-primary-600 text-primary-900" 
        : "hover:bg-gray-100 text-gray-900 border-gray-300"
    }
    
    if (index === correctAnswer) {
      return "bg-success-200 border-success-600"
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return "bg-danger-200 border-danger-600"
    }
    
    return "bg-white text-gray-900 border-gray-300"
  }

  const getAnswerIcon = (index: number) => {
    if (!isAnswered) return null
    
    if (index === correctAnswer) {
      return <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">✓</span>
      </div>
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return <div className="w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">✗</span>
      </div>
    }
    
    return null
  }

  return (
    <div className="space-y-6">
      {/* Image Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative">
          <img
            ref={imageRef}
            src={question.imageUrl}
            alt="Question image"
            className={`w-full h-64 object-cover transition-all duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: `blur(${blurAmount}px)`,
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {/* Reveal progress indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-full h-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${revealProgress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-white text-sm mt-1 text-center">
              {Math.round(revealProgress * 100)}% revealed
            </div>
          </div>
        </div>
      </div>

      {/* Question Instructions */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          What do you see in this image?
        </h3>
        <p className="text-sm text-gray-600">
          The image will become clearer as time passes. Answer quickly for bonus points!
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={isAnswered}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 font-medium ${getAnswerClass(index)}`}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">{option}</span>
              {getAnswerIcon(index)}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Time and Blur Info */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Time remaining: <span className="font-semibold">{timeLeft}s</span>
        </div>
        <div>
          Blur: <span className="font-semibold">{Math.round(blurAmount)}px</span>
        </div>
      </div>
    </div>
  )
}

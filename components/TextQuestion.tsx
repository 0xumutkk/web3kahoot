'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TextQuiz } from '../types/global'

interface TextQuestionProps {
  question: TextQuiz
  timeLeft: number
  onAnswerSelect: (answerIndex: number) => void
  isAnswered: boolean
  selectedAnswer: number | null
  correctAnswer: number
}

export default function TextQuestion({
  question,
  timeLeft,
  onAnswerSelect,
  isAnswered,
  selectedAnswer,
  correctAnswer
}: TextQuestionProps) {
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
      {/* Question Text */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {question.prompt}
        </h3>
        <p className="text-sm text-gray-600">
          Choose the correct answer from the options below.
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

      {/* Time Info */}
      <div className="text-center text-sm text-gray-600">
        Time remaining: <span className="font-semibold">{timeLeft}s</span>
      </div>
    </div>
  )
}

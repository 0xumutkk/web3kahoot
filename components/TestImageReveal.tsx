'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImageRevealQuiz } from '../types/global'

// Test IMAGE_REVEAL question
const testQuestion: ImageRevealQuiz = {
  id: "test-1",
  categoryId: "test",
  questionType: "IMAGE_REVEAL",
  imageUrl: "https://picsum.photos/800/600?random=999",
  blurMaxPx: 24,
  options: ["Apple MacBook", "Dell XPS", "Lenovo ThinkPad", "HP Spectre"],
  correctAnswer: 0,
  durationMs: 30000
}

export default function TestImageReveal() {
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)
  }

  const blurAmount = Math.max(0, (timeLeft / 30) * testQuestion.blurMaxPx)
  const revealProgress = 1 - (timeLeft / 30)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">IMAGE_REVEAL Test</h2>
      
      {/* Image Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6">
        <img
          src={testQuestion.imageUrl}
          alt="Test image"
          className="w-full h-64 object-cover transition-all duration-1000"
          style={{
            filter: `blur(${blurAmount}px)`,
          }}
        />
        
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

      {/* Question */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          What do you see in this image?
        </h3>
        <p className="text-sm text-gray-600">
          Time remaining: <span className="font-semibold">{timeLeft}s</span> | 
          Blur: <span className="font-semibold">{Math.round(blurAmount)}px</span>
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {testQuestion.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isAnswered}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 font-medium ${
              !isAnswered
                ? selectedAnswer === index 
                  ? "bg-primary-200 border-primary-600 text-primary-900" 
                  : "hover:bg-gray-100 text-gray-900 border-gray-300"
                : index === testQuestion.correctAnswer
                ? "bg-success-200 border-success-600"
                : selectedAnswer === index && index !== testQuestion.correctAnswer
                ? "bg-danger-200 border-danger-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">{option}</span>
              {isAnswered && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === testQuestion.correctAnswer ? 'bg-success-500' : 
                  selectedAnswer === index && index !== testQuestion.correctAnswer ? 'bg-danger-500' : 'bg-gray-300'
                }">
                  {index === testQuestion.correctAnswer ? '✓' : 
                   selectedAnswer === index && index !== testQuestion.correctAnswer ? '✗' : ''}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Result */}
      {isAnswered && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg text-center"
        >
          <p className="text-lg font-semibold">
            {selectedAnswer === testQuestion.correctAnswer 
              ? '✅ Correct!' 
              : '❌ Wrong! The correct answer is: ' + testQuestion.options[testQuestion.correctAnswer]
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}

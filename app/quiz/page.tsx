'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Users, 
  ArrowRight,
  Timer
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

interface Player {
  address: string
  score: number
  currentQuestion: number
  isFinished: boolean
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    timeLimit: 30
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    timeLimit: 30
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    timeLimit: 15
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: 1,
    timeLimit: 30
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    timeLimit: 30
  }
]

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [players, setPlayers] = useState<Player[]>([
    { address: "0x1234...5678", score: 0, currentQuestion: 0, isFinished: false },
    { address: "0x8765...4321", score: 0, currentQuestion: 0, isFinished: false },
    { address: "0x1111...2222", score: 0, currentQuestion: 0, isFinished: false }
  ])

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex]

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameFinished, currentQuestionIndex])

  const startGame = () => {
    setGameStarted(true)
    setTimeLeft(currentQuestion.timeLimit)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)
    
    // Calculate score based on time and correctness
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const timeBonus = Math.floor((timeLeft / currentQuestion.timeLimit) * 100)
    const questionScore = isCorrect ? 100 + timeBonus : 0
    
    setScore(prev => prev + questionScore)
    
    // Update player score in the list
    setPlayers(prev => prev.map(player => 
      player.address === "0x1234...5678" 
        ? { ...player, score: player.score + questionScore }
        : player
    ))
  }

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true)
      setSelectedAnswer(null)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(SAMPLE_QUESTIONS[currentQuestionIndex + 1].timeLimit)
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameFinished(true)
    // Here you would submit the final score to the contract
  }

  const getAnswerClass = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index 
        ? "bg-primary-100 border-primary-500" 
        : "hover:bg-gray-50"
    }
    
    if (index === currentQuestion.correctAnswer) {
      return "bg-success-100 border-success-500"
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return "bg-danger-100 border-danger-500"
    }
    
    return "bg-gray-50"
  }

  const getAnswerIcon = (index: number) => {
    if (!isAnswered) return null
    
    if (index === currentQuestion.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-success-500" />
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return <XCircle className="w-5 h-5 text-danger-500" />
    }
    
    return null
  }

  if (!gameStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-2xl mx-auto text-center"
        >
          <Trophy className="w-16 h-16 text-secondary-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Starting Soon!</h1>
          <p className="text-gray-600 mb-8">
            Get ready to answer {SAMPLE_QUESTIONS.length} questions. 
            Speed and accuracy matter for your score!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">{SAMPLE_QUESTIONS.length} Questions</p>
            </div>
            <div className="text-center">
              <Timer className="w-8 h-8 text-danger-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">30s per Question</p>
            </div>
          </div>
          
          <button onClick={startGame} className="btn-primary text-lg px-8 py-4">
            Start Quiz
          </button>
        </motion.div>
      </div>
    )
  }

  if (gameFinished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-2xl mx-auto text-center"
        >
          <Trophy className="w-16 h-16 text-secondary-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <p className="text-2xl font-semibold text-primary-600 mb-8">
            Final Score: {score} points
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div key={player.address} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold">#{index + 1}</span>
                      <span className="font-mono">{player.address}</span>
                    </div>
                    <span className="font-semibold">{player.score} pts</span>
                  </div>
                ))}
            </div>
          </div>
          
          <button 
            onClick={() => window.location.href = '/'} 
            className="btn-primary"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1}/{SAMPLE_QUESTIONS.length}</h1>
            <div className="flex items-center space-x-2 text-danger-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Score</p>
            <p className="text-2xl font-bold text-primary-600">{score}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div 
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Question Section */}
        <div className="lg:col-span-2">
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getAnswerClass(index)}`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {getAnswerIcon(index)}
                  </div>
                </motion.button>
              ))}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <button 
                  onClick={nextQuestion}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>{currentQuestionIndex < SAMPLE_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Live Leaderboard */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold text-gray-800">Live Leaderboard</h3>
            </div>
            
            <div className="space-y-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <motion.div 
                    key={player.address}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-mono text-sm">{player.address}</span>
                    </div>
                    <span className="font-semibold">{player.score}</span>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

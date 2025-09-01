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
  Timer,
  Image as ImageIcon,
  Type
} from 'lucide-react'
import { QuizRound, Player } from '../../../types/global'
import { getRandomQuizzes } from '../../../lib/quiz-data'
import TextQuestion from '../../../components/TextQuestion'
import ImageRevealQuestion from '../../../components/ImageRevealQuestion'

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [players, setPlayers] = useState<Player[]>([
    { address: "0x1234...5678", score: 0, currentQuestion: 0, isFinished: false, answers: [] },
    { address: "0x8765...4321", score: 0, currentQuestion: 0, isFinished: false, answers: [] },
    { address: "0x1111...2222", score: 0, currentQuestion: 0, isFinished: false, answers: [] }
  ])

  // Get category from URL params
  const [category, setCategory] = useState('technology')
  const [questions, setQuestions] = useState<QuizRound[]>([])
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setCategory(categoryParam)
    }
    
    // Get random quizzes for the category
    const quizData = getRandomQuizzes(categoryParam || 'technology', 5)
    setQuestions(quizData)
  }, [])
  
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (gameStarted && !gameFinished && currentQuestion) {
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
  }, [gameStarted, gameFinished, currentQuestionIndex, currentQuestion])

  const startGame = () => {
    if (currentQuestion) {
      setGameStarted(true)
      setTimeLeft(Math.floor(currentQuestion.durationMs / 1000))
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered || !currentQuestion) return
    
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)
    
    // Calculate score based on time and correctness
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const timeBonus = Math.floor((timeLeft / (currentQuestion.durationMs / 1000)) * 100)
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      const nextQuestion = questions[currentQuestionIndex + 1]
      if (nextQuestion) {
        setTimeLeft(Math.floor(nextQuestion.durationMs / 1000))
      }
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameFinished(true)
    // Here you would submit the final score to the contract
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
            Get ready to answer {questions.length} questions. 
            Speed and accuracy matter for your score!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">{questions.length} Questions</p>
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
                      <span className="text-lg font-semibold text-gray-800">#{index + 1}</span>
                      <span className="font-mono text-gray-800">{player.address}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{player.score} pts</span>
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

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1}/{questions.length}</h1>
            <div className="flex items-center space-x-2 text-danger-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
            {/* Question Type Indicator */}
            <div className="flex items-center space-x-2 text-gray-600">
              {currentQuestion.questionType === "IMAGE_REVEAL" ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <Type className="w-5 h-5" />
              )}
              <span className="text-sm font-medium capitalize">
                {currentQuestion.questionType === "IMAGE_REVEAL" ? "Image Reveal" : "Text Question"}
              </span>
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
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
            {currentQuestion.questionType === "TEXT" ? (
              <TextQuestion
                question={currentQuestion}
                timeLeft={timeLeft}
                onAnswerSelect={handleAnswerSelect}
                isAnswered={isAnswered}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
              />
            ) : (
              <ImageRevealQuestion
                question={currentQuestion}
                timeLeft={timeLeft}
                totalTime={Math.floor(currentQuestion.durationMs / 1000)}
                onAnswerSelect={handleAnswerSelect}
                isAnswered={isAnswered}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
              />
            )}

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
                  <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
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
                      <span className="font-mono text-sm text-gray-800">{player.address}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{player.score}</span>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

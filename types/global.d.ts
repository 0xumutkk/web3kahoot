declare global {
  interface Window {
    ethereum?: any;
  }
}

// Quiz Types - Backward compatible discriminated union
export type BaseQuiz = {
  id: string;
  categoryId: string;
  questionType: "TEXT" | "IMAGE_REVEAL";
  durationMs: number;
  options: string[];
  correctAnswer: number;
};

export type TextQuiz = BaseQuiz & {
  questionType: "TEXT";
  prompt: string;
};

export type ImageRevealQuiz = BaseQuiz & {
  questionType: "IMAGE_REVEAL";
  imageUrl: string;
  blurMaxPx: number;
};

export type QuizRound = TextQuiz | ImageRevealQuiz;

// Game State Types
export interface GameState {
  gameId: string;
  categoryId: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  isStarted: boolean;
  isFinished: boolean;
  rounds: QuizRound[];
}

export interface Player {
  address: string;
  score: number;
  currentQuestion: number;
  isFinished: boolean;
  answers: PlayerAnswer[];
}

export interface PlayerAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
  isCorrect: boolean;
  score: number;
}

export {};

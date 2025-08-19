import { ethers } from 'ethers'

// QuizGame contract ABI
export const QUIZ_GAME_ABI = [
  'function enterGame(uint256 gameId, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external',
  'function submitAnswers(uint256 gameId, uint256 score, uint256 finishTime, bytes calldata signature) external',
  'function getGameInfo(uint256 gameId) external view returns (uint256 startTime, uint256 endTime, uint256 totalPrizePool, uint256 playerCount, bool isActive, bool isFinished)',
  'function getPlayerInfo(uint256 gameId, address player) external view returns (uint256 score, uint256 finishTime, bool hasSubmitted, bool hasWithdrawn)',
  'function getPlayerAddresses(uint256 gameId) external view returns (address[] memory)',
  'function currentGameId() external view returns (uint256)',
  'event GameStarted(uint256 indexed gameId, uint256 startTime)',
  'event PlayerJoined(uint256 indexed gameId, address indexed player)',
  'event AnswerSubmitted(uint256 indexed gameId, address indexed player, uint256 score, uint256 finishTime)',
  'event GameFinished(uint256 indexed gameId, address[] winners, uint256[] prizes)'
]

export interface GameInfo {
  startTime: number
  endTime: number
  totalPrizePool: number
  playerCount: number
  isActive: boolean
  isFinished: boolean
}

export interface PlayerInfo {
  score: number
  finishTime: number
  hasSubmitted: boolean
  hasWithdrawn: boolean
}

export class QuizGameContract {
  private contract: ethers.Contract
  private signer: ethers.Signer

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(contractAddress, QUIZ_GAME_ABI, signer)
    this.signer = signer
  }

  async getCurrentGameId(): Promise<number> {
    return await this.contract.currentGameId()
  }

  async getGameInfo(gameId: number): Promise<GameInfo> {
    const [startTime, endTime, totalPrizePool, playerCount, isActive, isFinished] = 
      await this.contract.getGameInfo(gameId)
    
    return {
      startTime: Number(startTime),
      endTime: Number(endTime),
      totalPrizePool: Number(totalPrizePool),
      playerCount: Number(playerCount),
      isActive,
      isFinished
    }
  }

  async getPlayerInfo(gameId: number, playerAddress: string): Promise<PlayerInfo> {
    const [score, finishTime, hasSubmitted, hasWithdrawn] = 
      await this.contract.getPlayerInfo(gameId, playerAddress)
    
    return {
      score: Number(score),
      finishTime: Number(finishTime),
      hasSubmitted,
      hasWithdrawn
    }
  }

  async getPlayerAddresses(gameId: number): Promise<string[]> {
    return await this.contract.getPlayerAddresses(gameId)
  }

  async enterGame(
    gameId: number,
    root: string,
    nullifierHash: string,
    proof: number[]
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.enterGame(gameId, root, nullifierHash, proof)
  }

  async submitAnswers(
    gameId: number,
    score: number,
    finishTime: number,
    signature: string
  ): Promise<ethers.ContractTransaction> {
    return await this.contract.submitAnswers(gameId, score, finishTime, signature)
  }

  // Event listeners
  onGameStarted(callback: (gameId: number, startTime: number) => void) {
    this.contract.on('GameStarted', callback)
  }

  onPlayerJoined(callback: (gameId: number, player: string) => void) {
    this.contract.on('PlayerJoined', callback)
  }

  onAnswerSubmitted(callback: (gameId: number, player: string, score: number, finishTime: number) => void) {
    this.contract.on('AnswerSubmitted', callback)
  }

  onGameFinished(callback: (gameId: number, winners: string[], prizes: number[]) => void) {
    this.contract.on('GameFinished', callback)
  }

  // Remove event listeners
  removeAllListeners() {
    this.contract.removeAllListeners()
  }
}

// Utility functions
export function formatUSDC(amount: number): string {
  return (amount / 1000000).toFixed(2)
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString()
}

export function calculateTimeLeft(endTime: number): number {
  return Math.max(0, Math.floor((endTime - Date.now() / 1000) / 60))
}

export function calculateScore(correctAnswers: number, totalTime: number, timeLimit: number): number {
  const baseScore = correctAnswers * 100
  const timeBonus = Math.floor((totalTime / timeLimit) * 50)
  return baseScore + timeBonus
}

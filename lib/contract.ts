import { ethers } from 'ethers'
import { QuizGame__factory, QuizGame } from '../typechain-types'

// Contract addresses
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const WORLD_ID_ADDRESS = '0x1234567890123456789012345678901234567890'

// Quiz types - must match the contract enum
export enum QuizType {
  TEXT = 0,
  IMAGE_REVEAL = 1
}

// Network configuration
const NETWORK_CONFIG = {
  chainId: 31337, // Hardhat local network
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
}

// Contract instance
let contract: QuizGame | null = null
let provider: ethers.BrowserProvider | null = null
let signer: ethers.JsonRpcSigner | null = null

// Initialize contract
export async function initializeContract() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed')
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner()
    
    // Create contract instance
    contract = QuizGame__factory.connect(CONTRACT_ADDRESS, signer)
    
    // Switch to Hardhat network if needed
    await switchToHardhatNetwork()
    
    return contract
  } catch (error) {
    console.error('Failed to initialize contract:', error)
    throw error
  }
}

// Switch to Hardhat network
async function switchToHardhatNetwork() {
  if (!provider) return

  const network = await provider.getNetwork()
  if (network.chainId !== BigInt(NETWORK_CONFIG.chainId)) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        })
      } else {
        throw switchError
      }
    }
  }
}

// Get contract instance
export function getContract(): QuizGame {
  if (!contract) {
    throw new Error('Contract not initialized. Call initializeContract() first.')
  }
  return contract
}

// Get signer
export function getSigner(): ethers.JsonRpcSigner {
  if (!signer) {
    throw new Error('Signer not initialized. Call initializeContract() first.')
  }
  return signer
}

// Get provider
export function getProvider(): ethers.BrowserProvider {
  if (!provider) {
    throw new Error('Provider not initialized. Call initializeContract() first.')
  }
  return provider
}

// Contract functions
export async function startNewGame(categoryId: number, quizType: QuizType) {
  const contract = getContract()
  const tx = await contract.startNewGame(categoryId, quizType)
  await tx.wait()
  return tx
}

export async function enterGame(
  gameId: number,
  preferredQuizType: QuizType,
  root: string = '0x0',
  nullifierHash: string = '0x0',
  proof: number[] = [0, 0, 0, 0, 0, 0, 0, 0]
) {
  const contract = getContract()
  const entryFee = ethers.parseEther('0.001') // 0.001 ETH
  
  const tx = await contract.enterGame(
    gameId,
    preferredQuizType,
    root,
    nullifierHash,
    proof,
    { value: entryFee }
  )
  await tx.wait()
  return tx
}

export async function submitAnswers(
  gameId: number,
  score: number,
  finishTime: number,
  signature: string
) {
  const contract = getContract()
  const tx = await contract.submitAnswers(gameId, score, finishTime, signature)
  await tx.wait()
  return tx
}

export async function finishGame(gameId: number) {
  const contract = getContract()
  const tx = await contract.finishGame(gameId)
  await tx.wait()
  return tx
}

export async function getGameInfo(gameId: number) {
  const contract = getContract()
  return await contract.getGameInfo(gameId)
}

export async function getPlayerInfo(gameId: number, playerAddress: string) {
  const contract = getContract()
  return await contract.getPlayerInfo(gameId, playerAddress)
}

export async function getPlayerAddresses(gameId: number) {
  const contract = getContract()
  return await contract.getPlayerAddresses(gameId)
}

export async function getCategoryInfo(categoryId: number) {
  const contract = getContract()
  return await contract.getCategoryInfo(categoryId)
}

export async function getCategoryCount() {
  const contract = getContract()
  return await contract.getCategoryCount()
}

// Utility functions
export function formatEther(wei: bigint): string {
  return ethers.formatEther(wei)
}

export function parseEther(ether: string): bigint {
  return ethers.parseEther(ether)
}

// Get current account
export async function getCurrentAccount(): Promise<string> {
  const signer = getSigner()
  return await signer.getAddress()
}

// Get account balance
export async function getAccountBalance(address?: string): Promise<string> {
  const provider = getProvider()
  const targetAddress = address || await getCurrentAccount()
  const balance = await provider.getBalance(targetAddress)
  return formatEther(balance)
}

// Event listeners (simplified for now)
export function onGameStarted(callback: (gameId: number, startTime: number, quizType: QuizType) => void) {
  // TODO: Implement proper event listening
  console.log('GameStarted event listener registered')
}

export function onPlayerJoined(callback: (gameId: number, player: string, preferredQuizType: QuizType) => void) {
  // TODO: Implement proper event listening
  console.log('PlayerJoined event listener registered')
}

export function onAnswerSubmitted(callback: (gameId: number, player: string, score: number, finishTime: number) => void) {
  // TODO: Implement proper event listening
  console.log('AnswerSubmitted event listener registered')
}

export function onGameFinished(callback: (gameId: number, winners: string[], prizes: bigint[]) => void) {
  // TODO: Implement proper event listening
  console.log('GameFinished event listener registered')
}

// Remove event listeners
export function removeAllListeners() {
  // TODO: Implement proper event listener removal
  console.log('All event listeners removed')
}

import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// QuizGame contract ABI (simplified for demo)
const QUIZ_GAME_ABI = [
  'function enterGame(uint256 gameId, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external',
  'function submitAnswers(uint256 gameId, uint256 score, uint256 finishTime, bytes calldata signature) external'
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      gameId, 
      proof, 
      nullifierHash, 
      root, 
      signal,
      playerAddress 
    } = body

    // Verify World ID proof
    const isValidProof = await verifyWorldIDProof({
      proof,
      nullifierHash,
      root,
      signal
    })

    if (!isValidProof) {
      return NextResponse.json(
        { error: 'Invalid World ID proof' },
        { status: 400 }
      )
    }

    // Call smart contract to enter game
    const contractAddress = process.env.CONTRACT_ADDRESS
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const contract = new ethers.Contract(contractAddress!, QUIZ_GAME_ABI, wallet)

    const tx = await contract.enterGame(
      gameId,
      root,
      nullifierHash,
      proof
    )

    await tx.wait()

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      message: 'Successfully joined the quiz!'
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

async function verifyWorldIDProof({
  proof,
  nullifierHash,
  root,
  signal
}: {
  proof: any
  nullifierHash: string
  root: string
  signal: string
}) {
  try {
    // In a real implementation, you would verify the proof against the World ID contract
    // For demo purposes, we'll simulate verification
    
    // Check if nullifier hash has been used before
    // Check if root is valid
    // Verify the proof is correct
    
    return true // Simulated success
  } catch (error) {
    console.error('Proof verification error:', error)
    return false
  }
}

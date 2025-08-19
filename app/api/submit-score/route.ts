import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      gameId, 
      playerAddress, 
      score, 
      finishTime 
    } = body

    // Validate inputs
    if (!gameId || !playerAddress || score === undefined || !finishTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create message hash for signature
    const messageHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'address', 'uint256', 'uint256'],
        [gameId, playerAddress, score, finishTime]
      )
    )

    // Sign the message with the private key
    const privateKey = process.env.PRIVATE_KEY!
    const wallet = new ethers.Wallet(privateKey)
    const signature = await wallet.signMessage(ethers.getBytes(messageHash))

    // Call smart contract to submit answers
    const contractAddress = process.env.CONTRACT_ADDRESS
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const contractWallet = new ethers.Wallet(privateKey, provider)
    const contract = new ethers.Contract(contractAddress!, [
      'function submitAnswers(uint256 gameId, uint256 score, uint256 finishTime, bytes calldata signature) external'
    ], contractWallet)

    const tx = await contract.submitAnswers(
      gameId,
      score,
      finishTime,
      signature
    )

    await tx.wait()

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      signature,
      message: 'Score submitted successfully!'
    })

  } catch (error) {
    console.error('Score submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    )
  }
}

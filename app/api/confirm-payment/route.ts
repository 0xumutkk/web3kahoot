import { NextRequest, NextResponse } from 'next/server'
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js'
import { getPaymentReference, removePaymentReference } from '../../../lib/payment-utils'

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload
}

export async function POST(req: NextRequest) {
  try {
    const { payload } = (await req.json()) as IRequestPayload
    
    console.log('Payment confirmation received:', payload)
    
    // For local testing, we'll accept any payment with a valid transaction ID
    if (payload.transaction_id && payload.transaction_id.startsWith('0x')) {
      console.log('Local payment confirmed:', payload.transaction_id)
      
      return NextResponse.json({ 
        success: true,
        transactionId: payload.transaction_id,
        amount: 0.001,
        playerAddress: 'local_test'
      })
    }
    
    // Get the original payment reference from our storage (for World App payments)
    const originalReference = getPaymentReference(payload.reference)
    
    if (!originalReference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference not found' },
        { status: 400 }
      )
    }
    
    // Verify that the transaction we received matches what we initiated
    if (payload.reference !== originalReference.id) {
      return NextResponse.json(
        { success: false, error: 'Payment reference mismatch' },
        { status: 400 }
      )
    }
    
    // For demo purposes, we'll optimistically confirm the payment
    // In production, you should verify with Developer Portal API or on-chain events
    
    // Remove the payment reference to prevent replay attacks
    removePaymentReference(payload.reference)
    
    console.log('Payment confirmed successfully:', {
      transactionId: payload.transaction_id,
      reference: payload.reference,
      playerAddress: originalReference.playerAddress,
      amount: originalReference.amount
    })
    
    return NextResponse.json({ 
      success: true,
      transactionId: payload.transaction_id,
      amount: originalReference.amount,
      playerAddress: originalReference.playerAddress
    })
    
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}

// Production verification with Developer Portal API
async function verifyWithDeveloperPortal(transactionId: string, reference: string) {
  // This would be used in production
  // const response = await fetch(
  //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${process.env.APP_ID}`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
  //     },
  //   }
  // )
  // const transaction = await response.json()
  // return transaction.reference === reference && transaction.status !== 'failed'
  
  // For demo, return true
  return true
}

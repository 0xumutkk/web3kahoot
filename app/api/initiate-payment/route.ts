import { NextRequest, NextResponse } from 'next/server'
import { setPaymentReference } from '../../../lib/payment-utils'

export async function POST(req: NextRequest) {
  try {
    const { amount, playerAddress } = await req.json()
    
    // Generate unique reference ID
    const uuid = crypto.randomUUID().replace(/-/g, '')
    
    // Store payment reference in memory (use database in production)
    setPaymentReference(uuid, {
      id: uuid,
      amount: amount || 1, // Default 1 USDC
      playerAddress,
      timestamp: Date.now()
    })
    
    console.log('Payment initiated:', { uuid, amount, playerAddress })
    
    return NextResponse.json({ 
      id: uuid,
      success: true 
    })
  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}


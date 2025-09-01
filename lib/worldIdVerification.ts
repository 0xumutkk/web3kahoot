export interface WorldIdProof {
  merkle_root: string
  nullifier_hash: string
  proof: string
  credential_type: string
}

export interface VerificationResponse {
  success: boolean
  message?: string
}

export const verifyWorldIdProof = async (proof: WorldIdProof): Promise<VerificationResponse> => {
  try {
    console.log('Verifying World ID proof...', proof)
    
    const response = await fetch('https://developer.worldcoin.org/api/v1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merkle_root: proof.merkle_root,
        nullifier_hash: proof.nullifier_hash,
        proof: proof.proof,
        credential_type: proof.credential_type,
        action: 'quiz_verification',
        signal: 'user_quiz_participation'
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('World ID verification failed:', errorData)
      return {
        success: false,
        message: errorData.message || 'Verification failed'
      }
    }
    
    const result = await response.json()
    console.log('World ID verification successful:', result)
    
    return {
      success: true,
      message: 'Verification successful'
    }
    
  } catch (error) {
    console.error('World ID verification error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Verification error'
    }
  }
}

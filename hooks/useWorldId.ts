'use client'

import { useState, useCallback } from 'react'
import { verifyWorldIdProof, WorldIdProof } from '../lib/worldIdVerification'

export interface WorldIdVerification {
  proof: string
  merkle_root: string
  nullifier_hash: string
  credential_type: string
}

export const useWorldId = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [verificationData, setVerificationData] = useState<WorldIdVerification | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerificationSuccess = useCallback(async (proof: WorldIdProof) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('World ID proof received:', proof)
      
      // Proof'u World ID verify endpoint'e gönder
      const verificationResult = await verifyWorldIdProof(proof)
      
      if (verificationResult.success) {
        // Verification başarılı
        const verificationData: WorldIdVerification = {
          proof: proof.proof,
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          credential_type: proof.credential_type
        }
        
        setVerificationData(verificationData)
        setIsVerified(true)
        console.log('World ID verification completed successfully')
      } else {
        // Verification başarısız
        setError(verificationResult.message || 'Verification failed')
        console.error('World ID verification failed:', verificationResult.message)
      }
      
    } catch (error) {
      console.error('World ID verification error:', error)
      setError(error instanceof Error ? error.message : 'Verification error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleVerificationError = useCallback((error: any) => {
    console.error('World ID widget error:', error)
    setError('World ID verification was cancelled or failed')
    setIsLoading(false)
  }, [])

  const resetVerification = useCallback(() => {
    setIsVerified(false)
    setVerificationData(null)
    setError(null)
  }, [])

  return {
    isVerified,
    verificationData,
    isLoading,
    error,
    handleVerificationSuccess,
    handleVerificationError,
    resetVerification
  }
}

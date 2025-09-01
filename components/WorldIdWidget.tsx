'use client'

import { IDKitWidget } from '@worldcoin/idkit'

interface WorldIdWidgetProps {
  onSuccess: (proof: any) => void
  onError?: (error: any) => void
}

export const WorldIdWidget = ({ onSuccess, onError }: WorldIdWidgetProps) => {
  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || '6f0c381855716b8cf989330b922406f5'}
      action="quiz_verification"
      signal="user_quiz_participation"
      onSuccess={onSuccess}
      // WalletConnect Project ID opsiyonel - eğer yoksa kaldır
      // walletConnectProjectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
    >
      {({ open }) => (
        <button
          onClick={open}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  )
}

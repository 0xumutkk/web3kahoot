// In-memory storage for demo purposes
// In production, use a proper database
const paymentReferences = new Map<string, {
  id: string
  amount: number
  playerAddress: string
  timestamp: number
}>()

// Helper function to get payment reference
export function getPaymentReference(id: string) {
  return paymentReferences.get(id)
}

// Helper function to remove payment reference after successful payment
export function removePaymentReference(id: string) {
  return paymentReferences.delete(id)
}

// Helper function to set payment reference
export function setPaymentReference(id: string, data: {
  id: string
  amount: number
  playerAddress: string
  timestamp: number
}) {
  paymentReferences.set(id, data)
}

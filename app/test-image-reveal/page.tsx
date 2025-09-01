import TestImageReveal from '../../components/TestImageReveal'

export default function TestImageRevealPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          IMAGE_REVEAL Quiz Test
        </h1>
        <p className="text-xl text-gray-600">
          Test the new blur-to-sharp image reveal functionality
        </p>
      </div>
      
      <TestImageReveal />
      
      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="text-primary-600 hover:text-primary-800 underline"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

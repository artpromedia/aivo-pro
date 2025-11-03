import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIVO Baseline Assessment
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Initial skills assessment platform - Port 5179
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Discover Your Learning Level
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Take comprehensive assessments to identify your current skill 
              level and learning needs. Our AI will create a personalized 
              learning path based on your results.
            </p>
            <button className="mt-6 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors">
              Start Assessment
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
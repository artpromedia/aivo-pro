import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIVO Learning App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive learning experience for students - Port 5176
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Learning Adventure
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Engage with interactive lessons, complete assessments, track 
              your progress, and learn with AI-powered personalization 
              tailored to your learning style and pace.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
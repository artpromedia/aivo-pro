import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIVO Teacher Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your classroom and student progress - Port 5175
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Classroom Management Hub
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Access student analytics, create assessments, track learning 
              outcomes, and utilize AI-powered insights to enhance your 
              teaching effectiveness and student engagement.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
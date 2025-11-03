import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to AIVO Learning Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Marketing Website - Port 5173
            </p>
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Empowering Learning Through AI
              </h2>
              <p className="text-gray-600 leading-relaxed">
                AIVO is a comprehensive learning platform that combines AI-powered 
                personalization with expert curriculum design to create engaging 
                educational experiences for students, parents, and teachers.
              </p>
            </div>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Play, ArrowRight, Target, Clock, Sparkles } from 'lucide-react';
import { useAssessment } from '../providers/AssessmentProvider';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { sessionData } = useAssessment();

  const startAssessment = () => {
    navigate('/assess');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AIVO Baseline Assessment</span>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome, {sessionData.childName}! 👋
            </h1>
            
            <p className="text-xl text-gray-600">
              Let's discover how you learn best
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">15-30 Minutes</h3>
                <p className="text-sm text-gray-600">Take your time - no rush!</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Adaptive Questions</h3>
                <p className="text-sm text-gray-600">Questions match your level</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
                <p className="text-sm text-gray-600">Personalized for you</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">What to Expect:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Questions across reading, math, science, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Some questions may be easy, others challenging - that's normal!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>You can take breaks whenever you need</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>There are no wrong answers - just do your best!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startAssessment}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

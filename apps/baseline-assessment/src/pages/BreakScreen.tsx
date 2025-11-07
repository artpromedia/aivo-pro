import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, Play } from 'lucide-react';

export const BreakScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center max-w-2xl"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Coffee className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Great Job! Time for a Break 🎉
        </h1>
        
        <p className="text-gray-600 mb-8">
          You've completed half of the assessment. Take a moment to stretch, get a drink, or rest your eyes.
        </p>

        <button
          onClick={() => navigate('/assess')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5" />
          Continue Assessment
        </button>
      </motion.div>
    </div>
  );
};

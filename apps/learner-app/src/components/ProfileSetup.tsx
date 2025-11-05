import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, BookOpen } from 'lucide-react';

interface UserProfile {
  name: string;
  age: number;
  grade: string;
}

interface ProfileSetupProps {
  onProfileSetup: (profile: UserProfile) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileSetup }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age && grade) {
      onProfileSetup({
        name: name.trim(),
        age: parseInt(age),
        grade: grade.trim()
      });
    }
  };

  const getThemePreview = (ageNum: number) => {
    if (ageNum >= 5 && ageNum <= 10) return { theme: 'K5', color: 'from-pink-400 to-purple-500', description: 'Fun & Playful Learning' };
    if (ageNum >= 11 && ageNum <= 14) return { theme: 'MS', color: 'from-blue-400 to-indigo-500', description: 'Balanced & Engaging' };
    if (ageNum >= 15 && ageNum <= 18) return { theme: 'HS', color: 'from-gray-600 to-gray-800', description: 'Professional & Focused' };
    return { theme: 'K5', color: 'from-pink-400 to-purple-500', description: 'Fun & Playful Learning' };
  };

  const currentAge = parseInt(age) || 0;
  const themePreview = getThemePreview(currentAge);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-4xl shadow-2xl p-10 max-w-2xl w-full border-2 border-gray-100"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            🌟
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Welcome to AIVO!
            </span>
          </h1>
          
          <p className="text-xl text-gray-600">
            Let's set up your personalized learning experience
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
              <User className="w-6 h-6 text-purple-600" />
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </motion.div>

          {/* Age Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
              How old are you?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="5"
              max="18"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </motion.div>

          {/* Grade Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
              What grade are you in?
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., Kindergarten, 3rd Grade, 8th Grade, 11th Grade"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </motion.div>

          {/* Theme Preview */}
          {currentAge >= 5 && currentAge <= 18 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Your Personalized Learning Experience
              </h3>
              
              <div className="flex items-center justify-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${themePreview.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl text-white font-bold">{themePreview.theme}</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{themePreview.theme} Theme</p>
                  <p className="text-gray-600">{themePreview.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!name || !age || !grade}
            className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Start My Learning Journey! 🚀
          </motion.button>
        </form>

        {/* Age Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Age-based learning experiences:</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-pink-50 rounded-xl p-3 border border-pink-200">
              <div className="font-semibold text-pink-700">Ages 5-10</div>
              <div className="text-pink-600">K-5 Playful Theme</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <div className="font-semibold text-blue-700">Ages 11-14</div>
              <div className="text-blue-600">Middle School Theme</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="font-semibold text-gray-700">Ages 15-18</div>
              <div className="text-gray-600">High School Theme</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
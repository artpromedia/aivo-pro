import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    // Navigate to auth page with signup mode
    navigate('/auth?mode=signup');
  };

  const handleLearnMore = () => {
    navigate('/how-it-works');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-purple-800 mb-8 border border-purple-100 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>New AI Learning Model Released</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Personalized Learning for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800">
                Every Unique Mind
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Aivo AI is an adaptive learning platform for neurodiverse K–12 and college learners. 
              Each student gets a "virtual brain" agent that personalizes lessons across subjects, 
              ingests uploads, and updates plans in real time with accessible, minimal UI.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                size="lg"
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLearnMore}
                className="px-8 py-4 rounded-full font-semibold border-2 border-purple-200 hover:border-purple-300 hover:bg-white/50"
              >
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Phone mockups section */}
          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* Left phone */}
              <motion.div
                className="relative mx-auto"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-64 bg-white rounded-[2.5rem] shadow-2xl p-2">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-[2rem] p-6 h-80">
                    <div className="flex items-center justify-center h-full flex-col">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
                        <Play className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700 text-center px-2">
                        Interactive lessons adapt to your pace
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center phone - Main - Larger */}
              <motion.div
                className="relative mx-auto transform scale-110 z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-64 bg-white rounded-[2.5rem] shadow-2xl p-2">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-[2rem] p-4 h-80">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                      <span className="font-semibold text-sm">AIVO Assistant</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-700">Daily Learning Goal</p>
                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                          <div className="h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-700">Math Progress</p>
                        <p className="text-lg font-bold text-purple-600">85%</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-700">Today's Focus</p>
                        <p className="text-xs text-gray-500">Algebra & Reading</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right phone */}
              <motion.div
                className="relative mx-auto"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-64 bg-white rounded-[2.5rem] shadow-2xl p-2">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-[2rem] p-6 h-80">
                    <div className="flex items-center justify-center h-full flex-col">
                      <div className="text-4xl mb-4">🎯</div>
                      <p className="text-xs font-medium text-gray-700 text-center px-2">
                        IEP goals tracked automatically
                      </p>
                      <div className="mt-4 w-full bg-white rounded-lg p-2">
                        <div className="text-xs text-gray-600">Weekly Goal</div>
                        <div className="text-green-600 font-bold text-sm">89% Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

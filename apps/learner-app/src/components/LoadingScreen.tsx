import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Target } from 'lucide-react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  // Always use the AIVO brain icon as the main loading icon
  const LoadingIcon = Brain;

  const loadingSteps = [
    { text: 'Analyzing assessment results', delay: 0 },
    { text: 'Creating learning profile', delay: 0.2 },
    { text: 'Cloning AI model', delay: 0.4 },
    { text: 'Personalizing content', delay: 0.6 },
    { text: 'Setting up dashboard', delay: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        
        {/* Main Loading Icon */}
        <motion.div
          className="mb-8 flex justify-center"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
            <LoadingIcon className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* AIVO Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              AIVO
            </span>
          </h1>
          <p className="text-2xl text-white/80 font-medium">
            AI-Powered Learning Platform
          </p>
        </motion.div>

        {/* Current Message */}
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-3xl font-bold text-white mb-4">{message}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Loading Steps */}
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: step.delay,
                }}
                className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              />
              <span className="text-white/90 font-medium text-lg">{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Fun Loading Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/80 text-lg"
            >
              🧠 Creating your unique learning experience...
            </motion.p>
          </div>
        </motion.div>

        {/* Powered by AI message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Powered by Advanced AI Technology
            <Sparkles className="w-4 h-4" />
          </p>
        </motion.div>

      </div>
    </div>
  );
};
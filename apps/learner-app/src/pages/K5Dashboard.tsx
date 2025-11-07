import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Star, 
  Zap, 
  Heart, 
  Gamepad2, 
  PenTool, 
  Crown,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FocusMonitor } from '../components/FocusMonitor';
import { HomeworkHelper } from '../pages/HomeworkHelper';
import { AdvancedWritingPad } from '../components/WritingPad';
import { GameBreak } from '../pages/GameBreak';


interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentId: string;
  baselineResults?: {
    mathLevel: number;
    readingLevel: number;
    scienceLevel: number;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    interests: string[];
    strengths: string[];
    needsImprovement: string[];
  };
  aiModelCloned: boolean;
}

interface K5DashboardProps {
  childProfile: ChildProfile;
}

export const K5Dashboard: React.FC<K5DashboardProps> = ({ childProfile }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showHomeworkHelper, setShowHomeworkHelper] = useState(false);
  const [showWritingPad, setShowWritingPad] = useState(false);
  const [showGameBreak, setShowGameBreak] = useState(false);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF7B5C', '#A855F7', '#EC4899', '#FFB347']
    });
  };

  const subjects = [
    { 
      id: 'math', 
      name: 'Math Adventures', 
      icon: '🔢', 
      bgGradient: 'from-blue-400 to-blue-600',
      progress: 75,
      level: 'Level 3',
      stars: 3,
      description: 'Numbers and counting fun!'
    },
    { 
      id: 'reading', 
      name: 'Story Time', 
      icon: '📚', 
      bgGradient: 'from-emerald-400 to-emerald-600',
      progress: 60,
      level: 'Level 2',
      stars: 2,
      description: 'Magical reading adventures!'
    },
    { 
      id: 'writing', 
      name: 'Creative Writing', 
      icon: '✏️', 
      bgGradient: 'from-purple-400 to-purple-600',
      progress: 45,
      level: 'Level 2',
      stars: 2,
      description: 'Express your imagination!'
    },
    { 
      id: 'science', 
      name: 'Science Fun', 
      icon: '🔬', 
      bgGradient: 'from-orange-400 to-orange-600',
      progress: 80,
      level: 'Level 4',
      stars: 3,
      description: 'Discover amazing things!'
    },
  ];

  const achievements = [
    { emoji: '🦄', name: 'Unicorn Reader', unlocked: true },
    { emoji: '🚀', name: 'Math Rocket', unlocked: true },
    { emoji: '🌈', name: 'Rainbow Writer', unlocked: true },
    { emoji: '⭐', name: 'Superstar', unlocked: false },
    { emoji: '🎈', name: 'Party Master', unlocked: false },
    { emoji: '🏆', name: 'Champion', unlocked: true },
    { emoji: '💎', name: 'Diamond Mind', unlocked: false },
    { emoji: '🎯', name: 'Perfect Shot', unlocked: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 font-comic overflow-hidden" style={{ backgroundColor: '#fef7ff', minHeight: '100vh' }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ position: 'fixed', inset: '0', overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20"
          animate={{
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-30"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8 py-12 max-w-7xl" style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl"
            >
              👑
            </motion.div>
          </div>

          <h1 className="text-6xl font-extrabold mb-6 text-shadow" style={{ fontSize: '3.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ background: 'linear-gradient(to right, #9333ea, #e91e63, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome Back, {childProfile.name}!
            </span>
          </h1>
          
          {/* Animated Star Rating */}
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ 
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.3 }
                }}
                className="cursor-pointer"
                onClick={() => {
                  triggerCelebration();
                  alert(`⭐ Star ${i + 1} clicked! You're a superstar! ⭐\n\nKeep clicking to spread more magic! ✨`);
                }}
              >
                <Star className="w-12 h-12 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            ))}
          </div>

          <p className="text-2xl text-gray-700 flex items-center justify-center gap-3 font-medium">
            Ready for another amazing learning adventure? 
            <motion.span 
              className="text-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎯
            </motion.span>
            <motion.span 
              className="text-3xl"
              animate={{ 
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              ✨
            </motion.span>
          </p>
        </motion.div>

        {/* Explorer Level Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl px-8 py-6 flex items-center gap-4 border-2 border-yellow-200"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Your Amazing Level</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Level 3 Explorer Queen! 👸
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-4xl p-2 shadow-2xl">
            <div className="bg-white rounded-4xl p-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className="w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center shadow-lg"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800 mb-2">Today's Magic Challenge</h2>
                      <p className="text-lg text-gray-600">Complete and win amazing prizes!</p>
                    </div>
                  </div>
                  
                  <p className="text-2xl text-gray-700 mb-8 font-medium">
                    🎯 Complete 3 math problems to unlock a magical surprise! 🎁
                  </p>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 progress-fill rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: '33%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-gray-600 font-medium">1 of 3 completed! You're doing great! 🌟</p>
                    <motion.button
                      onClick={() => {
                        triggerCelebration();
                        alert('🎯 Great job! Challenge started! Let\'s solve some fun math problems! 🌟');
                        // In a real app, this would navigate to the challenge page
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Challenge! 🚀
                    </motion.button>
                  </div>
                </div>
                
                <div className="hidden lg:block ml-8">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-9xl"
                  >
                    🎁
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              onHoverStart={() => setHoveredCard(subject.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => {
                triggerCelebration();
                navigate(`/learn/${subject.id}`);
              }}
              className="cursor-pointer learner-card"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-4xl shadow-xl overflow-hidden h-full border-2 border-gray-100"
              >
                {/* Colorful Header Stripe */}
                <div className={`h-4 bg-gradient-to-r ${subject.bgGradient}`} />
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-6">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${subject.bgGradient} rounded-3xl flex items-center justify-center text-4xl shadow-lg border-4 border-white`}
                        animate={hoveredCard === subject.id ? {
                          rotate: [0, -15, 15, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        {subject.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                        <p className="text-lg text-gray-600 font-medium">{subject.description}</p>
                        <p className="text-sm text-gray-500 font-bold mt-1">{subject.level}</p>
                      </div>
                    </div>
                    
                    {/* Hearts/Stars */}
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 + i * 0.1 }}
                          whileHover={{ scale: 1.3 }}
                        >
                          <Heart
                            className={`w-8 h-8 ${
                              i < subject.stars 
                                ? 'fill-red-400 text-red-400' 
                                : 'text-gray-300'
                            } drop-shadow-sm`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress Section */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-700">Your Amazing Progress</span>
                      <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {subject.progress}%
                      </span>
                    </div>
                    
                    <div className="bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${subject.bgGradient} rounded-full relative`}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1.5, delay: 1 + index * 0.2 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${subject.bgGradient} text-white font-bold text-xl rounded-3xl shadow-lg flex items-center justify-center gap-3 border-2 border-white`}
                  >
                    Let's Go Learn! 
                    <Sparkles className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Quick Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🛠️ Amazing Learning Tools! 🛠️
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Writing Pad */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWritingPad(true)}
              className="bg-white rounded-3xl shadow-xl p-6 cursor-pointer border-2 border-purple-100 hover:border-purple-300 transition-colors"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PenTool className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Writing Pad ✏️</h3>
              <p className="text-gray-600 text-center text-sm">Draw, write, and create amazing art!</p>
            </motion.div>

            {/* Homework Helper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHomeworkHelper(true)}
              className="bg-white rounded-3xl shadow-xl p-6 cursor-pointer border-2 border-orange-100 hover:border-orange-300 transition-colors"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <HelpCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Homework Help 📚</h3>
              <p className="text-gray-600 text-center text-sm">Get help with your homework questions!</p>
            </motion.div>

            {/* Brain Games */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGameBreak(true)}
              className="bg-white rounded-3xl shadow-xl p-6 cursor-pointer border-2 border-green-100 hover:border-green-300 transition-colors"
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Gamepad2 className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Brain Games 🎮</h3>
              <p className="text-gray-600 text-center text-sm">Fun games to boost your focus!</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements Collection */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-4xl p-10 shadow-xl border-2 border-purple-200">
            <motion.h3 
              className="text-4xl font-bold text-center text-gray-800 mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Your Magical Achievement Collection! ✨💫
            </motion.h3>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1.4 + i * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 360,
                    y: -10,
                    transition: { duration: 0.4 }
                  }}
                  className={`
                    aspect-square bg-white rounded-3xl flex items-center justify-center shadow-lg cursor-pointer border-2
                    ${achievement.unlocked ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200 grayscale opacity-50'}
                  `}
                  title={achievement.name}
                  onClick={() => {
                    if (achievement.unlocked) {
                      triggerCelebration();
                      alert(`🏆 Amazing! You unlocked "${achievement.name}"!\n\n${achievement.emoji} This badge shows you're becoming a true learning champion! Keep up the fantastic work! ✨`);
                    } else {
                      alert(`🔒 "${achievement.name}" is locked.\n\nKeep learning and completing challenges to unlock this awesome badge! ${achievement.emoji}`);
                    }
                  }}
                >
                  <span className="text-4xl md:text-5xl">{achievement.emoji}</span>
                  {achievement.unlocked && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <motion.p 
              className="text-center text-xl text-gray-600 mt-8 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Unlock more by completing challenges! 🎯
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Focus Monitor */}
      <FocusMonitor 
        onGameBreakNeeded={() => setShowGameBreak(true)}
        isVisible={!showHomeworkHelper && !showWritingPad && !showGameBreak}
        position="top-left"
      />

      {/* Floating AI Assistant */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          triggerCelebration();
          alert('🤖 Hi there, superstar! I\'m AIVO, your learning buddy! I can help you with:\n\n• 📚 Finding fun lessons\n• 🎯 Completing challenges\n• 🏆 Earning badges\n• ❓ Answering questions\n\nWhat would you like to learn today? ✨');
        }}
      >
        <div className="bg-white rounded-4xl shadow-2xl p-6 flex items-center gap-4 border-4 border-purple-200">
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-4xl">🤖</span>
          </motion.div>
          <div>
            <p className="text-lg font-bold text-gray-800">AIVO Helper</p>
            <p className="text-sm text-gray-600">Click me for magic help! ✨</p>
          </div>
        </div>
      </motion.div>

      {/* Feature Modals */}
      {showHomeworkHelper && (
        <HomeworkHelper
          childName={childProfile.name}
          childAge={childProfile.age}
          onClose={() => setShowHomeworkHelper(false)}
        />
      )}

      {showWritingPad && (
        <AdvancedWritingPad
          childName={childProfile.name}
          onClose={() => setShowWritingPad(false)}
        />
      )}

      {showGameBreak && (
        <GameBreak
          childAge={childProfile.age}
          onGameComplete={() => {}}
          onBackToLearning={() => setShowGameBreak(false)}
        />
      )}
    </div>
  );
};
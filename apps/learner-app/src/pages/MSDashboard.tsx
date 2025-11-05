import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calculator, 
  Beaker, 
  Globe, 
  Target, 
  TrendingUp, 
  Award,
  Clock,
  Users,
  Zap,
  PenTool,
  HelpCircle,
  Gamepad2,
  FileText
} from 'lucide-react';
import { FocusMonitor } from '../components/FocusMonitor';
import { HomeworkHelper } from '../pages/HomeworkHelper';
import { WritingPad } from '../components/WritingPad';
import { GameBreak } from '../pages/GameBreak';
import { TestCenter } from '../pages/TestCenter';

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

interface MSDashboardProps {
  childProfile: ChildProfile;
}

export const MSDashboard: React.FC<MSDashboardProps> = ({ childProfile }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showHomeworkHelper, setShowHomeworkHelper] = useState(false);
  const [showWritingPad, setShowWritingPad] = useState(false);
  const [showGameBreak, setShowGameBreak] = useState(false);
  const [showTestCenter, setShowTestCenter] = useState(false);

  const subjects = [
    { 
      id: 'math', 
      name: 'Algebra & Geometry', 
      icon: Calculator, 
      bgGradient: 'from-blue-500 to-blue-700',
      progress: 78,
      level: 'Grade 7',
      nextTopic: 'Quadratic Equations',
      timeSpent: '2h 15m this week'
    },
    { 
      id: 'science', 
      name: 'Physical Science', 
      icon: Beaker, 
      bgGradient: 'from-emerald-500 to-emerald-700',
      progress: 65,
      level: 'Grade 8', 
      nextTopic: 'Chemical Reactions',
      timeSpent: '1h 45m this week'
    },
    { 
      id: 'english', 
      name: 'Language Arts', 
      icon: BookOpen, 
      bgGradient: 'from-purple-500 to-purple-700',
      progress: 82,
      level: 'Grade 7',
      nextTopic: 'Creative Writing',
      timeSpent: '3h 20m this week'
    },
    { 
      id: 'history', 
      name: 'World History', 
      icon: Globe, 
      bgGradient: 'from-orange-500 to-orange-700',
      progress: 71,
      level: 'Grade 8',
      nextTopic: 'Ancient Civilizations',
      timeSpent: '1h 30m this week'
    },
  ];

  const achievements = [
    { name: 'Problem Solver', icon: Target, unlocked: true, description: 'Solved 50 math problems' },
    { name: 'Speed Reader', icon: Zap, unlocked: true, description: 'Read 5 books this month' },
    { name: 'Science Explorer', icon: Beaker, unlocked: false, description: 'Complete 10 experiments' },
    { name: 'History Buff', icon: Globe, unlocked: true, description: 'Mastered 3 civilizations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-nunito">
      
      {/* Header Section */}
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Welcome Back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{childProfile.name}</span>!
          </h1>
          <p className="text-xl text-gray-600">Ready to expand your knowledge today?</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-10"
        >
          {[
            { label: 'Current Level', value: 'Grade 7-8', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
            { label: 'Weekly Goal', value: '8h / 10h', icon: Target, color: 'from-green-500 to-green-600' },
            { label: 'Streak', value: '12 days', icon: Award, color: 'from-purple-500 to-purple-600' },
            { label: 'Study Friends', value: '23 online', icon: Users, color: 'from-orange-500 to-orange-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Today's Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 mb-10 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Today's Focus Session</h2>
              <p className="text-xl opacity-90 mb-4">Algebra: Linear Functions Review</p>
              <p className="opacity-75 mb-6">Strengthen your foundation with targeted practice</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  alert('📚 Starting Focus Session: Algebra Review\n\nThis 25-minute session includes:\n\n• Linear function basics\n• Graphing techniques\n• Practice problems\n• Progress tracking\n\nReady to focus and learn? 🎯');
                  navigate('/learn/math');
                }}
                className="bg-white text-blue-600 font-bold py-3 px-6 rounded-2xl shadow-lg"
              >
                Start Session (25 min)
              </motion.button>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Calculator className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onHoverStart={() => setHoveredCard(subject.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => navigate(`/learn/${subject.id}`)}
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 h-full"
              >
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${subject.bgGradient}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-14 h-14 bg-gradient-to-br ${subject.bgGradient} rounded-2xl flex items-center justify-center shadow-md`}
                        animate={hoveredCard === subject.id ? { rotate: 5 } : { rotate: 0 }}
                      >
                        <subject.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{subject.name}</h3>
                        <p className="text-gray-600">{subject.level}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{subject.progress}%</p>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${subject.bgGradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Next: {subject.nextTopic}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{subject.timeSpent}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <motion.button
                    onClick={() => {
                      alert(`📖 Continuing ${subject.name}\n\nNext topic: ${subject.nextTopic}\nCurrent progress: ${subject.progress}%\nTime spent: ${subject.timeSpent}\n\nLet's keep building your knowledge! 🚀`);
                      navigate(`/learn/${subject.id}`);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full py-3 bg-gradient-to-r ${subject.bgGradient} text-white font-semibold rounded-2xl`}
                  >
                    Continue Learning
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Learning Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Study Tools</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWritingPad(true)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-100 hover:border-purple-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 text-center mb-2">Digital Notebook</h4>
              <p className="text-gray-600 text-center text-sm">Take notes, sketch ideas, and organize thoughts</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHomeworkHelper(true)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-100 hover:border-orange-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 text-center mb-2">Study Assistant</h4>
              <p className="text-gray-600 text-center text-sm">Get help with assignments and complex problems</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGameBreak(true)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-100 hover:border-green-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 text-center mb-2">Focus Breaks</h4>
              <p className="text-gray-600 text-center text-sm">Refresh your mind with cognitive games</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTestCenter(true)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border border-gray-100 hover:border-indigo-300 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 text-center mb-2">Assessment Center</h4>
              <p className="text-gray-600 text-center text-sm">Take tests to measure your progress</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Recent Achievements</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className={`
                  p-6 rounded-2xl border-2 text-center
                  ${achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                  ${achievement.unlocked 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  <achievement.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Unlocked!
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Focus Monitor */}
      <FocusMonitor 
        onGameBreakNeeded={() => setShowGameBreak(true)}
        isVisible={!showHomeworkHelper && !showWritingPad && !showGameBreak && !showTestCenter}
        position="top-right"
      />

      {/* Feature Modals */}
      {showHomeworkHelper && (
        <HomeworkHelper
          childName={childProfile.name}
          childAge={childProfile.age}
          onClose={() => setShowHomeworkHelper(false)}
        />
      )}

      {showWritingPad && (
        <WritingPad
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

      {showTestCenter && (
        <TestCenter
          childName={childProfile.name}
          childAge={childProfile.age}
          childGrade={childProfile.grade}
          onClose={() => setShowTestCenter(false)}
        />
      )}
    </div>
  );
};
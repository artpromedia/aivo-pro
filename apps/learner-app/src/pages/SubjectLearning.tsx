import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, BookOpen } from 'lucide-react';

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

interface SubjectLearningProps {
  childProfile: ChildProfile;
}

export const SubjectLearning: React.FC<SubjectLearningProps> = ({ childProfile }) => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const subjectData: Record<string, any> = {
    math: {
      name: 'Math Adventures',
      color: 'from-blue-400 to-blue-600',
      icon: '🔢',
      topics: [
        'Number Recognition', 'Basic Addition', 'Subtraction Fun', 'Shapes & Patterns'
      ]
    },
    reading: {
      name: 'Story Time',
      color: 'from-emerald-400 to-emerald-600', 
      icon: '📚',
      topics: [
        'Letter Sounds', 'Simple Words', 'Short Stories', 'Reading Comprehension'
      ]
    },
    writing: {
      name: 'Creative Writing',
      color: 'from-purple-400 to-purple-600',
      icon: '✏️',
      topics: [
        'Letter Formation', 'Simple Sentences', 'Story Writing', 'Poetry Fun'
      ]
    },
    science: {
      name: 'Science Fun',
      color: 'from-orange-400 to-orange-600',
      icon: '🔬',
      topics: [
        'Animals & Plants', 'Weather Patterns', 'Simple Experiments', 'Space Exploration'
      ]
    }
  };

  const currentSubject = subjectData[subject || 'math'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 font-comic">
      <div className="container mx-auto px-8 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="p-3 bg-white rounded-2xl shadow-lg border-2 border-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${currentSubject.color} rounded-3xl flex items-center justify-center text-3xl shadow-lg`}>
              {currentSubject.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{currentSubject.name}</h1>
              <p className="text-lg text-gray-600">Let's learn something amazing!</p>
            </div>
          </div>
        </motion.div>

        {/* Learning Topics Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {currentSubject.topics.map((topic: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-4xl shadow-xl p-8 border-2 border-gray-100 cursor-pointer learner-card"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentSubject.color} rounded-2xl flex items-center justify-center shadow-md`}>
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{topic}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Explore this exciting topic with interactive lessons and fun activities!
              </p>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => {
                    alert(`🎯 Starting "${topic}" lesson!\n\nGet ready for an amazing learning adventure! You'll discover:\n\n• Interactive activities\n• Fun games\n• Helpful examples\n• Practice exercises\n\nLet's learn and have fun! 🚀`);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 px-4 bg-gradient-to-r ${currentSubject.color} text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2`}
                >
                  <Play className="w-5 h-5" />
                  Start Learning
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    alert(`📚 "${topic}" Study Guide\n\nHere's what you'll learn:\n\n• Key concepts and definitions\n• Step-by-step examples\n• Practice problems\n• Tips and tricks\n\nReady to become an expert? 📖✨`);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gray-100 rounded-2xl"
                >
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fun Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-4xl p-10 text-center"
        >
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
            className="text-8xl mb-6"
          >
            🎯
          </motion.div>
          
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            Ready for More Fun?
          </h3>
          
          <p className="text-xl text-gray-600 mb-8">
            Complete lessons to unlock games, badges, and special rewards!
          </p>
          
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-3xl shadow-lg"
          >
            Back to Dashboard 🏠
          </motion.button>
        </motion.div>
        
      </div>
    </div>
  );
};
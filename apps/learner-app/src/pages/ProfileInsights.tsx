import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, TrendingUp, Target, Brain, 
  BookOpen, Clock, Award, BarChart3, Lightbulb,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { VirtualBrainMap } from '../components/VirtualBrainMap';

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

interface ProfileInsightsProps {
  childProfile: ChildProfile;
  onBack: () => void;
}

export const ProfileInsights: React.FC<ProfileInsightsProps> = ({ childProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'goals' | 'insights'>('insights');
  const [showBrainMap, setShowBrainMap] = useState(false);

  console.log('ProfileInsights render - showBrainMap:', showBrainMap);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Brain }
  ];

  const strengths = childProfile.baselineResults?.strengths || ['Visual Learning', 'Problem Solving', 'Pattern Recognition', 'Mathematical Reasoning'];
  const growthAreas = childProfile.baselineResults?.needsImprovement || ['Reading Comprehension', 'Focus Duration', 'Science Vocabulary'];
  
  const handleViewBrainMap = () => {
    console.log('handleViewBrainMap called');
    setShowBrainMap(true);
  };

  const recommendations = [
    'Incorporate more visual aids in reading lessons',
    'Break science lessons into shorter segments',
    'Use hands-on experiments for science concepts'
  ];

  const stats = [
    { label: 'Overall Progress', value: '78%', color: 'from-orange-400 to-red-400' },
    { label: 'This Week', value: '12.5h', color: 'from-purple-400 to-blue-400' },
    { label: 'Skills Mastered', value: '47', color: 'from-red-400 to-pink-400' },
    { label: 'Day Streak', value: '5', color: 'from-green-400 to-emerald-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              EJ
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{childProfile.name}</h1>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <span>{childProfile.grade}</span>
                <span>•</span>
                <span>Age {childProfile.age}</span>
                <span>•</span>
                <span>ZIP 10001</span>
              </div>
              <div className="flex gap-3">
                <motion.div
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Assessment Complete
                </motion.div>
                <motion.div
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Brain className="w-4 h-4" />
                  AI Model Ready
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-100 rounded-2xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-2 gap-8">
            {/* AI Learning Insights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">AI Learning Insights</h2>
              </div>

              {/* Strengths */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Strengths</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Growth Areas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {growthAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Learning Profile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Learning Profile</h2>
              </div>

              {/* Learning Style */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Learning Style</h3>
                <div className="px-4 py-3 bg-purple-100 rounded-xl">
                  <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                    Visual-Kinesthetic
                  </span>
                </div>
              </div>

              {/* Motivation Profile */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Motivation Profile</h3>
                <p className="text-gray-600 text-sm">
                  Achievement-oriented with strong response to positive reinforcement
                </p>
              </div>

              {/* Next Focus Area */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Next Focus Area</h3>
                <p className="text-gray-600 text-sm">
                  Reading comprehension strategies and science vocabulary building
                </p>
              </div>

              {/* Brain Map Button */}
              <button
                onClick={() => {
                  console.log('Brain map button clicked! Current state:', showBrainMap);
                  alert('Button clicked - opening brain map');
                  setShowBrainMap(true);
                  console.log('showBrainMap set to true');
                }}
                className="w-full px-8 py-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                type="button"
              >
                <Brain className="w-6 h-6" />
                View Virtual Brain Map
              </button>
            </motion.div>
          </div>
        )}

        {/* Other tab content placeholders */}
        {activeTab !== 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{activeTab} Content</h2>
            <p className="text-gray-600">This section is coming soon!</p>
          </motion.div>
        )}
      </div>

      {/* Virtual Brain Map Modal */}
      {showBrainMap && (
        <div>
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ color: 'white', fontSize: '24px' }}>
              Brain Map Loading... (Test)
            </div>
          </div>
          <VirtualBrainMap 
            childProfile={childProfile}
            onClose={() => setShowBrainMap(false)}
          />
        </div>
      )}
    </div>
  );
};
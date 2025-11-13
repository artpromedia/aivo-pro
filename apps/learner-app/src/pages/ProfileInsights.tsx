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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'AI Insights', icon: Brain }
  ];

  const strengths = childProfile.baselineResults?.strengths || ['Visual Learning', 'Problem Solving', 'Pattern Recognition', 'Mathematical Reasoning'];
  const growthAreas = childProfile.baselineResults?.needsImprovement || ['Reading Comprehension', 'Focus Duration', 'Science Vocabulary'];
  
  const handleViewBrainMap = () => {
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
                  setShowBrainMap(true);
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white text-2xl font-bold mb-2`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Profile Summary
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Basic Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">Name:</span> {childProfile.name}</p>
                    <p><span className="font-medium">Age:</span> {childProfile.age} years old</p>
                    <p><span className="font-medium">Grade:</span> {childProfile.grade}</p>
                    <p><span className="font-medium">Learning Style:</span> {childProfile.baselineResults?.learningStyle || 'Not assessed'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Academic Levels</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Math</span>
                        <span className="text-sm text-gray-600">{childProfile.baselineResults?.mathLevel || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{width: `${childProfile.baselineResults?.mathLevel || 0}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Reading</span>
                        <span className="text-sm text-gray-600">{childProfile.baselineResults?.readingLevel || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: `${childProfile.baselineResults?.readingLevel || 0}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Science</span>
                        <span className="text-sm text-gray-600">{childProfile.baselineResults?.scienceLevel || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{width: `${childProfile.baselineResults?.scienceLevel || 0}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            {childProfile.baselineResults?.interests && childProfile.baselineResults.interests.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {childProfile.baselineResults.interests.map((interest, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full text-gray-700 font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Learning Progress
              </h3>

              {/* Strengths */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Strengths
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Areas for Growth
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {growthAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                      <Target className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Completed Math Module</p>
                    <p className="text-sm text-gray-600">Advanced Algebra - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <BookOpen className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Reading Exercise</p>
                    <p className="text-sm text-gray-600">Comprehension skills - 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Achievement Unlocked</p>
                    <p className="text-sm text-gray-600">5-day learning streak - 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Active Goals */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Active Learning Goals
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">Improve Reading Comprehension</h4>
                      <p className="text-sm text-gray-600">Complete 5 reading exercises this week</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">Master Science Vocabulary</h4>
                      <p className="text-sm text-gray-600">Learn 20 new science terms</p>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">14/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">Increase Focus Duration</h4>
                      <p className="text-sm text-gray-600">Reach 45-minute study sessions</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">30min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
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
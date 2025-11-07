import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Target,
  Clock,
  Award,
  Activity,
  Download,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalStudents: 4823,
    avgProgress: 78,
    engagementRate: 85,
    learningVelocity: 1.4,
    improvements: {
      progress: 5.2,
      engagement: 3.8,
      velocity: 0.3
    }
  },
  aiPerformance: {
    accuracy: 94.2,
    adaptiveResponses: 12453,
    modelsActive: 2456,
    trainingHours: 8942
  },
  topSubjects: [
    { name: 'Mathematics', students: 1845, avgScore: 82, growth: 6.5 },
    { name: 'Reading', students: 1923, avgScore: 86, growth: 4.2 },
    { name: 'Science', students: 1654, avgScore: 79, growth: 5.8 },
    { name: 'Social Studies', students: 1401, avgScore: 81, growth: 3.9 }
  ],
  schoolPerformance: [
    { name: 'Lincoln Elementary', score: 94, students: 856, trend: 'up' },
    { name: 'Washington Middle', score: 91, students: 1234, trend: 'up' },
    { name: 'Roosevelt High', score: 88, students: 1456, trend: 'stable' },
    { name: 'Jefferson Elementary', score: 92, students: 734, trend: 'up' }
  ],
  weeklyActivity: [
    { day: 'Mon', sessions: 3421, avgMinutes: 42 },
    { day: 'Tue', sessions: 3589, avgMinutes: 45 },
    { day: 'Wed', sessions: 3712, avgMinutes: 48 },
    { day: 'Thu', sessions: 3645, avgMinutes: 46 },
    { day: 'Fri', sessions: 3398, avgMinutes: 41 }
  ]
};

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['district-analytics', timeRange],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAnalyticsData;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              </div>
              <p className="text-purple-100">
                Comprehensive insights into district-wide learning performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="7days" className="text-gray-900">Last 7 Days</option>
                <option value="30days" className="text-gray-900">Last 30 Days</option>
                <option value="90days" className="text-gray-900">Last 90 Days</option>
                <option value="1year" className="text-gray-900">Last Year</option>
              </select>
              <button
                onClick={() => alert('Exporting analytics...')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-start justify-between mb-3">
              <Users className="w-10 h-10 text-purple-600" />
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUp className="w-4 h-4" />
                {analyticsData?.overview.improvements.progress}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Student Progress</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData?.overview.avgProgress}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-pink-500"
          >
            <div className="flex items-start justify-between mb-3">
              <Activity className="w-10 h-10 text-pink-600" />
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUp className="w-4 h-4" />
                {analyticsData?.overview.improvements.engagement}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData?.overview.engagementRate}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-600"
          >
            <div className="flex items-start justify-between mb-3">
              <Brain className="w-10 h-10 text-purple-600" />
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUp className="w-4 h-4" />
                0.2%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">AI Accuracy</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData?.aiPerformance.accuracy}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-coral-500"
          >
            <div className="flex items-start justify-between mb-3">
              <Zap className="w-10 h-10 text-coral-500" />
              <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                <ArrowUp className="w-4 h-4" />
                {analyticsData?.overview.improvements.velocity}x
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Learning Velocity</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData?.overview.learningVelocity}x</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Top Performing Subjects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
                <Link to="/analytics/performance" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View Details →
                </Link>
              </div>
              <div className="space-y-4">
                {analyticsData?.topSubjects.map((subject, index) => (
                  <div key={subject.name} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-purple-700">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{subject.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{subject.students.toLocaleString()} students</span>
                          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <ArrowUp className="w-3 h-3" />
                            {subject.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${subject.avgScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{subject.avgScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Performance */}
          <div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8" />
                <h2 className="text-xl font-semibold">AI Performance</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Active Models</p>
                  <p className="text-3xl font-bold">{analyticsData?.aiPerformance.modelsActive.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm mb-1">Adaptive Responses</p>
                  <p className="text-3xl font-bold">{analyticsData?.aiPerformance.adaptiveResponses.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm mb-1">Training Hours</p>
                  <p className="text-3xl font-bold">{analyticsData?.aiPerformance.trainingHours.toLocaleString()}</p>
                </div>
              </div>
              <Link 
                to="/analytics/ai-overview"
                className="block w-full mt-6 px-4 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors font-medium text-center"
              >
                View AI Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* School Performance */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">School Performance</h2>
              <Link to="/schools" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {analyticsData?.schoolPerformance.map((school) => (
                <div key={school.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      school.score >= 90 ? 'bg-green-100' :
                      school.score >= 80 ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      <Award className={`w-5 h-5 ${
                        school.score >= 90 ? 'text-green-600' :
                        school.score >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{school.name}</p>
                      <p className="text-sm text-gray-500">{school.students.toLocaleString()} students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">{school.score}</span>
                    {school.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
              <Link to="/analytics/usage" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Usage Report →
              </Link>
            </div>
            <div className="space-y-3">
              {analyticsData?.weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.day}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">{day.sessions.toLocaleString()} sessions</span>
                      <span className="text-sm text-gray-600">{day.avgMinutes} min avg</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(day.sessions / 4000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link to="/analytics/usage">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200">
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Usage Reports</h3>
              <p className="text-sm text-gray-600">Detailed platform usage analytics and engagement metrics</p>
            </div>
          </Link>
          
          <Link to="/analytics/performance">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-pink-200">
              <Target className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Performance Analysis</h3>
              <p className="text-sm text-gray-600">Student progress tracking and achievement reports</p>
            </div>
          </Link>
          
          <Link to="/analytics/compliance">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200">
              <Award className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Compliance Reports</h3>
              <p className="text-sm text-gray-600">FERPA, COPPA, and state compliance monitoring</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

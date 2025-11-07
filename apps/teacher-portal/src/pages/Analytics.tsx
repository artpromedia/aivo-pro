import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Users,
  Calendar,
  Download,
  Filter,
  Eye,
  Brain,
  Award,
  BookOpen,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@aivo/ui';

interface AnalyticsData {
  totalLearningHours: number;
  skillsCompleted: number;
  averageScore: number;
  streakDays: number;
  weeklyProgress: { day: string; hours: number; score: number }[];
  subjectProgress: { subject: string; progress: number; timeSpent: number; improvement: number }[];
  monthlyTrends: { month: string; engagement: number; performance: number }[];
}

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedChild, setSelectedChild] = useState<string>('all');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalLearningHours: 47.5,
    skillsCompleted: 23,
    averageScore: 87,
    streakDays: 12,
    weeklyProgress: [
      { day: 'Mon', hours: 2.5, score: 85 },
      { day: 'Tue', hours: 3.2, score: 92 },
      { day: 'Wed', hours: 1.8, score: 78 },
      { day: 'Thu', hours: 2.9, score: 88 },
      { day: 'Fri', hours: 2.1, score: 91 },
      { day: 'Sat', hours: 3.5, score: 94 },
      { day: 'Sun', hours: 2.0, score: 86 },
    ],
    subjectProgress: [
      { subject: 'Mathematics', progress: 92, timeSpent: 15.2, improvement: 8 },
      { subject: 'Language Arts', progress: 78, timeSpent: 12.8, improvement: 5 },
      { subject: 'Science', progress: 85, timeSpent: 10.5, improvement: 12 },
      { subject: 'Social Studies', progress: 73, timeSpent: 9.0, improvement: -2 },
    ],
    monthlyTrends: [
      { month: 'Aug', engagement: 75, performance: 82 },
      { month: 'Sep', engagement: 82, performance: 85 },
      { month: 'Oct', engagement: 88, performance: 87 },
      { month: 'Nov', engagement: 91, performance: 89 },
    ],
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== 0 && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(change)}% from last {timeRange}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Learning Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your children's learning progress and performance
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          >
            <option value="all">All Children</option>
            <option value="emma">Emma Chen</option>
            <option value="noah">Noah Johnson</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button 
            onClick={() => {
              // Generate and download report
              const reportData = JSON.stringify(analyticsData, null, 2);
              const blob = new Blob([reportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `aivo-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Learning Hours"
          value={`${analyticsData.totalLearningHours}h`}
          change={15}
          icon={Clock}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Skills Completed"
          value={analyticsData.skillsCompleted}
          change={8}
          icon={Award}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Average Score"
          value={`${analyticsData.averageScore}%`}
          change={3}
          icon={Target}
          color="bg-gradient-to-br from-coral-500 to-coral-600"
        />
        <StatCard
          title="Current Streak"
          value={`${analyticsData.streakDays} days`}
          change={12}
          icon={Zap}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-coral-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.weeklyProgress.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 w-8">{day.day}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">Hours:</span>
                      <span className="font-medium">{day.hours}h</span>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-coral-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${(day.hours / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-lg font-bold text-gray-900">{day.score}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Subject Performance</h3>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.subjectProgress.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                  <div className="flex items-center gap-2">
                    {subject.improvement > 0 ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <ArrowUp className="w-3 h-3" />
                        <span>+{subject.improvement}%</span>
                      </div>
                    ) : subject.improvement < 0 ? (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <ArrowDown className="w-3 h-3" />
                        <span>{subject.improvement}%</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Time Spent: {subject.timeSpent}h</span>
                  <span>Last {timeRange} performance</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Learning Trends</h3>
          <TrendingUp className="w-5 h-5 text-coral-600" />
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          {analyticsData.monthlyTrends.map((trend, index) => (
            <motion.div
              key={trend.month}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gradient-to-br from-coral-50 to-purple-50 rounded-xl border border-coral-100"
            >
              <h4 className="font-bold text-gray-900 mb-2">{trend.month}</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Engagement</p>
                  <p className="text-lg font-bold text-coral-600">{trend.engagement}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Performance</p>
                  <p className="text-lg font-bold text-purple-600">{trend.performance}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-coral-600" />
          <h3 className="text-xl font-bold text-gray-900">AI-Powered Insights</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Observations</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm text-gray-700">
                  Mathematics performance has improved consistently over the past month
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-500 mt-1">⚡</span>
                <span className="text-sm text-gray-700">
                  Learning sessions are most effective in morning hours (9-11 AM)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">🎯</span>
                <span className="text-sm text-gray-700">
                  Visual learning activities show 23% higher engagement rates
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">→</span>
                <span className="text-sm text-gray-700">
                  Consider adding more challenging content in Mathematics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">→</span>
                <span className="text-sm text-gray-700">
                  Social Studies could benefit from interactive multimedia content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">→</span>
                <span className="text-sm text-gray-700">
                  Maintain current learning schedule and session duration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
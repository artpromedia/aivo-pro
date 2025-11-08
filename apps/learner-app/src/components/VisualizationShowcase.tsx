import React from 'react';
import { ProgressChart, SkillTree, AnalyticsDashboard } from '@aivo/visualizations';
import type { LearningProgressData, SkillTreeData, AnalyticsData } from '@aivo/visualizations';

// Sample data for demonstration
const sampleProgressData: LearningProgressData[] = [
  {
    subject: 'Mathematics',
    level: 5,
    xp: 2840,
    timeSpent: 450,
    completedLessons: 25,
    totalLessons: 40,
    averageScore: 87,
    streakDays: 7,
    lastActivity: '2024-01-15',
    weeklyProgress: [
      { date: '2024-01-08', value: 75, type: 'xp' },
      { date: '2024-01-09', value: 82, type: 'xp' },
      { date: '2024-01-10', value: 78, type: 'xp' },
      { date: '2024-01-11', value: 91, type: 'xp' },
      { date: '2024-01-12', value: 85, type: 'xp' },
      { date: '2024-01-13', value: 93, type: 'xp' },
      { date: '2024-01-14', value: 87, type: 'xp' },
      { date: '2024-01-15', value: 96, type: 'xp' }
    ],
    skillsProgress: []
  },
  {
    subject: 'Science',
    level: 4,
    xp: 2140,
    timeSpent: 320,
    completedLessons: 18,
    totalLessons: 35,
    averageScore: 82,
    streakDays: 4,
    lastActivity: '2024-01-15',
    weeklyProgress: [
      { date: '2024-01-08', value: 68, type: 'xp' },
      { date: '2024-01-09', value: 74, type: 'xp' },
      { date: '2024-01-10', value: 71, type: 'xp' },
      { date: '2024-01-11', value: 79, type: 'xp' },
      { date: '2024-01-12', value: 83, type: 'xp' },
      { date: '2024-01-13', value: 80, type: 'xp' },
      { date: '2024-01-14', value: 86, type: 'xp' },
      { date: '2024-01-15', value: 82, type: 'xp' }
    ],
    skillsProgress: []
  },
  {
    subject: 'Reading',
    level: 6,
    xp: 3250,
    timeSpent: 380,
    completedLessons: 32,
    totalLessons: 45,
    averageScore: 91,
    streakDays: 12,
    lastActivity: '2024-01-15',
    weeklyProgress: [
      { date: '2024-01-08', value: 85, type: 'xp' },
      { date: '2024-01-09', value: 89, type: 'xp' },
      { date: '2024-01-10', value: 92, type: 'xp' },
      { date: '2024-01-11', value: 88, type: 'xp' },
      { date: '2024-01-12', value: 94, type: 'xp' },
      { date: '2024-01-13', value: 91, type: 'xp' },
      { date: '2024-01-14', value: 95, type: 'xp' },
      { date: '2024-01-15', value: 93, type: 'xp' }
    ],
    skillsProgress: []
  }
];

const sampleSkillTreeData: SkillTreeData = {
  id: 'math-root',
  name: 'Mathematics',
  description: 'Core mathematics skills',
  level: 1,
  isCompleted: false,
  isAvailable: true,
  prerequisites: [],
  subject: 'Mathematics',
  difficulty: 'beginner',
  estimatedTime: 60,
  xpReward: 100,
  icon: '🧮',
  progress: 100,
  status: 'completed',
  children: [
    {
      id: 'arithmetic',
      name: 'Arithmetic',
      description: 'Basic arithmetic operations',
      level: 2,
      isCompleted: true,
      isAvailable: true,
      prerequisites: ['math-root'],
      subject: 'Mathematics',
      difficulty: 'beginner',
      estimatedTime: 45,
      xpReward: 75,
      icon: '➕',
      progress: 100,
      status: 'completed',
      children: [
        {
          id: 'addition',
          name: 'Addition',
          level: 3,
          isCompleted: true,
          isAvailable: true,
          prerequisites: ['arithmetic'],
          subject: 'Mathematics',
          difficulty: 'beginner',
          estimatedTime: 20,
          xpReward: 25,
          icon: '➕',
          progress: 100,
          status: 'completed'
        },
        {
          id: 'subtraction',
          name: 'Subtraction',
          level: 3,
          isCompleted: true,
          isAvailable: true,
          prerequisites: ['arithmetic'],
          subject: 'Mathematics',
          difficulty: 'beginner',
          estimatedTime: 20,
          xpReward: 25,
          icon: '➖',
          progress: 100,
          status: 'completed'
        }
      ]
    },
    {
      id: 'algebra',
      name: 'Algebra',
      description: 'Introduction to algebra',
      level: 2,
      isCompleted: false,
      isAvailable: true,
      prerequisites: ['arithmetic'],
      subject: 'Mathematics',
      difficulty: 'intermediate',
      estimatedTime: 90,
      xpReward: 150,
      icon: '🔢',
      progress: 60,
      status: 'in-progress',
      children: [
        {
          id: 'variables',
          name: 'Variables',
          level: 3,
          isCompleted: false,
          isAvailable: true,
          prerequisites: ['algebra'],
          subject: 'Mathematics',
          difficulty: 'intermediate',
          estimatedTime: 30,
          xpReward: 50,
          icon: 'x',
          progress: 75,
          status: 'in-progress'
        },
        {
          id: 'equations',
          name: 'Equations',
          level: 3,
          isCompleted: false,
          isAvailable: false,
          prerequisites: ['variables'],
          subject: 'Mathematics',
          difficulty: 'intermediate',
          estimatedTime: 45,
          xpReward: 75,
          icon: '⚖️',
          progress: 0,
          status: 'locked'
        }
      ]
    }
  ]
};

const sampleAnalyticsData: AnalyticsData = {
  overview: {
    totalStudents: 1250,
    totalLessons: 2840,
    averageProgress: 74,
    completionRate: 68,
    activeUsers: 892,
    retentionRate: 85,
    satisfactionScore: 4.2
  },
  engagement: {
    dailyActiveUsers: [
      { date: '2024-01-08', value: 120 },
      { date: '2024-01-09', value: 135 },
      { date: '2024-01-10', value: 142 },
      { date: '2024-01-11', value: 128 },
      { date: '2024-01-12', value: 156 },
      { date: '2024-01-13', value: 149 },
      { date: '2024-01-14', value: 163 },
      { date: '2024-01-15', value: 158 }
    ],
    sessionDuration: [],
    lessonCompletions: [],
    interactionRate: 0.78,
    bounceRate: 0.15,
    returnVisitors: 756
  },
  performance: {
    averageScores: [
      { subject: 'Mathematics', score: 87, trend: 'up', change: 3.2 },
      { subject: 'Science', score: 82, trend: 'stable', change: 0.1 },
      { subject: 'Reading', score: 91, trend: 'up', change: 2.8 },
      { subject: 'History', score: 79, trend: 'down', change: -1.5 },
      { subject: 'Art', score: 85, trend: 'up', change: 4.1 }
    ],
    improvementRate: 12.5,
    strugglingAreas: ['Fractions', 'Chemical Formulas'],
    topPerformers: [],
    learningVelocity: [],
    adaptationEffectiveness: 0.73
  },
  timeAnalysis: {
    peakUsageHours: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      usage: Math.floor(Math.random() * 100) + 20,
      engagement: Math.floor(Math.random() * 100) + 30
    })),
    weeklyPatterns: [],
    sessionLengths: [],
    timeToCompletion: []
  },
  subjectBreakdown: [
    { 
      subject: 'Mathematics', 
      totalTime: 12540, 
      averageScore: 87, 
      completionRate: 72, 
      difficulty: 3.2, 
      engagement: 4.1, 
      studentCount: 342,
      trendsData: []
    },
    { 
      subject: 'Science', 
      totalTime: 9850, 
      averageScore: 82, 
      completionRate: 68, 
      difficulty: 3.8, 
      engagement: 3.9, 
      studentCount: 298,
      trendsData: []
    },
    { 
      subject: 'Reading', 
      totalTime: 11200, 
      averageScore: 91, 
      completionRate: 78, 
      difficulty: 2.9, 
      engagement: 4.3, 
      studentCount: 387,
      trendsData: []
    }
  ],
  comparativeData: {
    gradeComparison: [],
    schoolComparison: [],
    nationalBenchmarks: [],
    historicalTrends: []
  }
};

export const VisualizationShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AIVO Visualizations Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive data visualizations for learning analytics, progress tracking, and skill development
          </p>
        </div>

        <div className="space-y-12">
          {/* Progress Chart Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Progress Chart</h2>
              <p className="text-gray-600">Track student progress across subjects over time with interactive trend analysis</p>
            </div>
            <div className="h-96">
              <ProgressChart
                data={sampleProgressData}
                timeRange="7d"
                showTrendLine={true}
                compareSubjects={true}
                onDataPointClick={(point: any) => {
                  console.log('Progress point clicked:', point);
                }}
                className="w-full h-full"
              />
            </div>
          </section>

          {/* Skill Tree Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Interactive Skill Tree</h2>
              <p className="text-gray-600">Visualize learning paths and skill dependencies with progress indicators</p>
            </div>
            <div className="h-96">
              <SkillTree
                data={sampleSkillTreeData}
                layout="tree"
                showProgress={true}
                interactive={true}
                onSkillClick={(skill: any) => {
                  console.log('Skill clicked:', skill);
                }}
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 text-center">
              <button 
                className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                Tree Layout
              </button>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                Force Layout
              </button>
            </div>
          </section>

          {/* Analytics Dashboard Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600">Comprehensive learning analytics with multiple visualization types</p>
            </div>
            <AnalyticsDashboard
              data={sampleAnalyticsData}
              viewMode="teacher"
              timeRange="30d"
              className="w-full"
            />
          </section>

          {/* Feature Highlights */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Interactive Charts</h3>
              <p className="text-blue-700">Hover, click, and explore data with smooth animations and responsive design</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Learning-Focused</h3>
              <p className="text-green-700">Specialized visualizations designed specifically for educational data and insights</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">High Performance</h3>
              <p className="text-purple-700">Optimized D3.js integration with React hooks for smooth, efficient rendering</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
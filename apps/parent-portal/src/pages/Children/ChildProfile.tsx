import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Brain, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  BookOpen, 
  Settings,
  Edit3,
  Plus,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  User,
  Heart,
  Lightbulb
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Progress,
  Avatar,
  Button
} from '@aivo/ui';

interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  zipCode: string;
  avatar?: string;
  assessmentStatus: 'pending' | 'in-progress' | 'completed';
  modelStatus: 'pending' | 'cloning' | 'ready';
  
  // Learning Analytics
  analytics: {
    overallProgress: number;
    weeklyHours: number;
    skillsMastered: number;
    currentStreak: number;
    totalSessions: number;
    avgSessionLength: number;
  };
  
  // Subject Progress
  subjects: {
    [key: string]: {
      name: string;
      progress: number;
      level: string;
      unitsCompleted: number;
      totalUnits: number;
      mastery: number;
      timeSpent: number;
      icon: string;
    };
  };
  
  // Learning Goals
  goals: {
    id: string;
    title: string;
    description: string;
    category: 'academic' | 'behavioral' | 'social';
    progress: number;
    target: number;
    unit: string;
    deadline: string;
    status: 'active' | 'completed' | 'paused';
  }[];
  
  // Recent Activities
  recentActivities: {
    id: string;
    type: 'lesson' | 'assessment' | 'achievement' | 'goal';
    title: string;
    description: string;
    timestamp: string;
    subject?: string;
    score?: number;
  }[];
  
  // AI Insights
  aiInsights: {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    learningStyle: string;
    motivation: string;
    nextFocus: string;
  };
}

// Mock data for demonstration
const mockChild: ChildProfile = {
  id: 'child_123',
  firstName: 'Emma',
  lastName: 'Johnson',
  dateOfBirth: '2015-06-15',
  grade: '3',
  zipCode: '10001',
  assessmentStatus: 'completed',
  modelStatus: 'ready',
  
  analytics: {
    overallProgress: 78,
    weeklyHours: 12.5,
    skillsMastered: 47,
    currentStreak: 5,
    totalSessions: 156,
    avgSessionLength: 25
  },
  
  subjects: {
    math: {
      name: 'Mathematics',
      progress: 85,
      level: 'Grade 3 - Advanced',
      unitsCompleted: 12,
      totalUnits: 15,
      mastery: 92,
      timeSpent: 8.5,
      icon: '🔢'
    },
    reading: {
      name: 'Reading & Language Arts',
      progress: 72,
      level: 'Grade 3 - On Track',
      unitsCompleted: 8,
      totalUnits: 12,
      mastery: 78,
      timeSpent: 6.2,
      icon: '📚'
    },
    science: {
      name: 'Science',
      progress: 68,
      level: 'Grade 3 - Developing',
      unitsCompleted: 5,
      totalUnits: 10,
      mastery: 75,
      timeSpent: 4.8,
      icon: '🔬'
    }
  },
  
  goals: [
    {
      id: 'goal_1',
      title: 'Master Multiplication Tables',
      description: 'Complete multiplication tables 1-10 with 90% accuracy',
      category: 'academic',
      progress: 7,
      target: 10,
      unit: 'tables',
      deadline: '2025-12-15',
      status: 'active'
    },
    {
      id: 'goal_2',
      title: 'Read 20 Minutes Daily',
      description: 'Establish consistent daily reading habit',
      category: 'behavioral',
      progress: 14,
      target: 21,
      unit: 'days',
      deadline: '2025-11-24',
      status: 'active'
    },
    {
      id: 'goal_3',
      title: 'Science Vocabulary',
      description: 'Learn 50 new science vocabulary words',
      category: 'academic',
      progress: 35,
      target: 50,
      unit: 'words',
      deadline: '2025-12-01',
      status: 'active'
    }
  ],
  
  recentActivities: [
    {
      id: 'act_1',
      type: 'lesson',
      title: 'Fractions and Decimals',
      description: 'Completed lesson with 95% accuracy',
      timestamp: '2025-11-03T09:30:00Z',
      subject: 'math',
      score: 95
    },
    {
      id: 'act_2',
      type: 'achievement',
      title: 'Reading Streak Champion',
      description: 'Achieved 5-day reading streak',
      timestamp: '2025-11-02T16:45:00Z',
      subject: 'reading'
    },
    {
      id: 'act_3',
      type: 'assessment',
      title: 'Weekly Math Quiz',
      description: 'Scored 88% on multiplication assessment',
      timestamp: '2025-11-01T14:20:00Z',
      subject: 'math',
      score: 88
    }
  ],
  
  aiInsights: {
    strengths: ['Visual Learning', 'Problem Solving', 'Pattern Recognition', 'Mathematical Reasoning'],
    challenges: ['Reading Comprehension', 'Focus Duration', 'Science Vocabulary'],
    recommendations: [
      'Incorporate more visual aids in reading lessons',
      'Break science lessons into shorter segments',
      'Use hands-on experiments for science concepts'
    ],
    learningStyle: 'Visual-Kinesthetic',
    motivation: 'Achievement-oriented with strong response to positive reinforcement',
    nextFocus: 'Reading comprehension strategies and science vocabulary building'
  }
};

export const ChildProfile: React.FC = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'goals' | 'insights'>('overview');
  
  // In a real app, this would fetch data based on childId
  const child = mockChild;
  
  const getStatusBadge = (status: string, type: 'assessment' | 'model') => {
    const configs = {
      assessment: {
        pending: { variant: 'warning' as const, text: 'Pending Assessment' },
        'in-progress': { variant: 'info' as const, text: 'In Progress' },
        completed: { variant: 'success' as const, text: 'Assessment Complete' }
      },
      model: {
        pending: { variant: 'warning' as const, text: 'Model Pending' },
        cloning: { variant: 'info' as const, text: 'Cloning Model' },
        ready: { variant: 'success' as const, text: 'AI Model Ready' }
      }
    };
    
    const config = configs[type][status as keyof typeof configs[typeof type]];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };
  
  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'progress', label: 'Progress', icon: TrendingUp },
    { key: 'goals', label: 'Goals', icon: Target },
    { key: 'insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
            <div className="flex items-start gap-6">
              <Avatar 
                name={`${child.firstName} ${child.lastName}`}
                src={child.avatar}
                size="xl"
                fallbackColor="coral"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {child.firstName} {child.lastName}
                  </h1>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span>Grade {child.grade}</span>
                  <span>•</span>
                  <span>Age {new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()}</span>
                  <span>•</span>
                  <span>ZIP {child.zipCode}</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {getStatusBadge(child.assessmentStatus, 'assessment')}
                  {getStatusBadge(child.modelStatus, 'model')}
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-coral-50 rounded-xl border border-coral-100">
                    <p className="text-2xl font-bold text-coral-600">{child.analytics.overallProgress}%</p>
                    <p className="text-sm text-coral-700">Overall Progress</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{child.analytics.weeklyHours}h</p>
                    <p className="text-sm text-purple-700">This Week</p>
                  </div>
                  <div className="text-center p-3 bg-salmon-50 rounded-xl border border-salmon-100">
                    <p className="text-2xl font-bold text-salmon-600">{child.analytics.skillsMastered}</p>
                    <p className="text-sm text-salmon-700">Skills Mastered</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-2xl font-bold text-green-600">{child.analytics.currentStreak}</p>
                    <p className="text-sm text-green-700">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-aivo-gradient text-white shadow-lg'
                    : 'text-gray-600 hover:text-coral-600 hover:bg-coral-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Subject Progress */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-coral-600" />
                    Subject Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.values(child.subjects).map((subject) => (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{subject.icon}</span>
                          <span className="font-medium text-gray-900">{subject.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} variant="gradient" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{subject.level}</span>
                        <span>{subject.unitsCompleted}/{subject.totalUnits} units</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {child.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-white/30">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        activity.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'assessment' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'lesson' ? '📖' :
                         activity.type === 'achievement' ? '🏆' :
                         activity.type === 'assessment' ? '📊' : '🎯'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()} at {' '}
                          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {activity.score && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">{activity.score}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Analytics Cards */}
              <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Sessions', value: child.analytics.totalSessions, icon: '📚', color: 'coral' },
                  { label: 'Avg Session Length', value: `${child.analytics.avgSessionLength}min`, icon: '⏱️', color: 'purple' },
                  { label: 'Skills Mastered', value: child.analytics.skillsMastered, icon: '🎯', color: 'salmon' },
                  { label: 'Current Streak', value: `${child.analytics.currentStreak} days`, icon: '🔥', color: 'green' },
                ].map((stat, index) => (
                  <Card key={index} variant="glass" className="p-4 text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </Card>
                ))}
              </div>

              {/* Subject Details */}
              {Object.values(child.subjects).map((subject) => (
                <Card key={subject.name} variant="glass" className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{subject.icon}</span>
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-coral-600 mb-1">{subject.progress}%</div>
                      <p className="text-sm text-gray-600">Overall Progress</p>
                    </div>
                    
                    <Progress value={subject.progress} variant="gradient" size="lg" showValue />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{subject.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Units Completed:</span>
                        <span className="font-medium">{subject.unitsCompleted}/{subject.totalUnits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mastery Score:</span>
                        <span className="font-medium">{subject.mastery}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Spent:</span>
                        <span className="font-medium">{subject.timeSpent}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              {/* Add Goal Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Learning Goals</h2>
                <Button variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              {/* Goals Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {child.goals.map((goal) => (
                  <Card key={goal.id} variant="glass" className="p-6">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
                          <Badge 
                            variant={goal.category === 'academic' ? 'coral' : goal.category === 'behavioral' ? 'purple' : 'info'}
                            size="sm"
                          >
                            {goal.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-coral-600">
                            {Math.round((goal.progress / goal.target) * 100)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {goal.progress}/{goal.target} {goal.unit}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{goal.description}</p>
                      
                      <Progress 
                        value={goal.progress} 
                        max={goal.target} 
                        variant="coral" 
                        size="lg"
                      />
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {goal.status === 'active' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : goal.status === 'completed' ? (
                            <Award className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="capitalize font-medium">{goal.status}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {child.aiInsights.strengths.map((strength, index) => (
                        <Badge key={index} variant="success" size="sm">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Growth Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {child.aiInsights.challenges.map((challenge, index) => (
                        <Badge key={index} variant="warning" size="sm">
                          {challenge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {child.aiInsights.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Profile */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-coral-600" />
                    Learning Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Learning Style</h4>
                      <Badge variant="coral">{child.aiInsights.learningStyle}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Motivation Profile</h4>
                      <p className="text-sm text-gray-600">{child.aiInsights.motivation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Next Focus Area</h4>
                      <p className="text-sm text-gray-600">{child.aiInsights.nextFocus}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="gradient" className="w-full">
                      <Brain className="w-4 h-4 mr-2" />
                      View Virtual Brain Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

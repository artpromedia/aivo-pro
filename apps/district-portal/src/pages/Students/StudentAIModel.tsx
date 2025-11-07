import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Activity,
  TrendingUp,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Cpu,
  Database,
  Network,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  User,
  School,
  GraduationCap,
  FileText,
  History,
  Play,
  RotateCcw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Mock student data with AI model details
const mockStudentData = {
  id: 'STU-001',
  name: 'Emma Johnson',
  grade: 5,
  school: 'Lincoln Elementary',
  teacher: 'Mrs. Sarah Smith',
  hasIEP: true,
  avatar: null,
  aiModel: {
    id: 'MODEL-001',
    status: 'active',
    version: '2.1.4',
    lastUpdated: '2025-11-05T10:30:00Z',
    trainingStartDate: '2025-09-01T00:00:00Z',
    totalInteractions: 2847,
    accuracy: 94.2,
    confidence: 91.5,
    adaptationRate: 88.7,
    learningProgress: 76,
    personalizedContent: 1284,
    adaptiveAssessments: 156,
    interventionsSuggested: 23,
    interventionsApplied: 19,
    dataPoints: 15234,
    modelSize: '2.3 GB',
    inferenceTime: '0.12s',
    lastTrainingDuration: '3h 24m',
    nextScheduledTraining: '2025-11-10T02:00:00Z'
  },
  learningProfile: {
    strengths: ['Mathematics', 'Problem Solving', 'Visual Learning'],
    challenges: ['Reading Comprehension', 'Time Management', 'Focus Duration'],
    learningStyle: 'Visual/Kinesthetic',
    pace: 'Above Average',
    preferredTime: 'Morning',
    attentionSpan: '35 minutes',
    motivationFactors: ['Gamification', 'Peer Collaboration', 'Immediate Feedback']
  },
  performanceMetrics: {
    overallScore: 85,
    mathematics: 92,
    reading: 78,
    science: 88,
    socialStudies: 82,
    writing: 76,
    engagement: 89,
    consistency: 84,
    improvement: 12
  },
  aiInsights: [
    {
      type: 'strength',
      category: 'Mathematics',
      insight: 'Excels in algebraic thinking and pattern recognition. Model suggests advanced problem-solving challenges.',
      confidence: 95,
      date: '2025-11-05'
    },
    {
      type: 'intervention',
      category: 'Reading',
      insight: 'Struggles with inferential comprehension. Recommended: Guided reading with scaffolded questions.',
      confidence: 88,
      date: '2025-11-04'
    },
    {
      type: 'prediction',
      category: 'Overall',
      insight: 'Predicted to achieve 90%+ proficiency in current curriculum by end of semester with current pace.',
      confidence: 82,
      date: '2025-11-03'
    },
    {
      type: 'behavioral',
      category: 'Engagement',
      insight: 'Optimal engagement during morning sessions. Consider scheduling complex tasks between 9-11 AM.',
      confidence: 91,
      date: '2025-11-02'
    }
  ],
  trainingHistory: [
    { date: '2025-11-01', accuracy: 94.2, dataPoints: 1250, duration: '2h 15m', status: 'completed' },
    { date: '2025-10-15', accuracy: 93.1, dataPoints: 1180, duration: '2h 08m', status: 'completed' },
    { date: '2025-10-01', accuracy: 91.8, dataPoints: 1120, duration: '2h 05m', status: 'completed' },
    { date: '2025-09-15', accuracy: 89.5, dataPoints: 980, duration: '1h 55m', status: 'completed' },
    { date: '2025-09-01', accuracy: 85.2, dataPoints: 850, duration: '1h 42m', status: 'completed' }
  ],
  progressOverTime: [
    { month: 'Sep', mathematics: 85, reading: 72, science: 82, overall: 79 },
    { month: 'Oct', mathematics: 89, reading: 75, science: 85, overall: 83 },
    { month: 'Nov', mathematics: 92, reading: 78, science: 88, overall: 85 }
  ],
  cognitiveProfile: [
    { subject: 'Memory', score: 88 },
    { subject: 'Reasoning', score: 92 },
    { subject: 'Processing Speed', score: 85 },
    { subject: 'Attention', score: 78 },
    { subject: 'Problem Solving', score: 94 },
    { subject: 'Creativity', score: 87 }
  ],
  adaptiveRecommendations: [
    {
      id: 1,
      title: 'Increase Math Challenge Level',
      description: 'Student consistently scores 90%+ on grade-level math. Recommend introducing 6th grade concepts.',
      priority: 'high',
      impact: 'Prevents boredom, maintains engagement',
      implementedBy: 'AI Model',
      status: 'active'
    },
    {
      id: 2,
      title: 'Reading Comprehension Scaffolding',
      description: 'Provide graphic organizers and guided questions for complex texts.',
      priority: 'high',
      impact: 'Improves comprehension by 15-20%',
      implementedBy: 'Teacher + AI',
      status: 'active'
    },
    {
      id: 3,
      title: 'Break Time Optimization',
      description: 'Schedule 5-minute movement breaks every 30 minutes during afternoon sessions.',
      priority: 'medium',
      impact: 'Increases focus duration by 40%',
      implementedBy: 'AI Model',
      status: 'pending'
    }
  ],
  dataPrivacy: {
    dataCollection: 'Active',
    parentConsent: true,
    consentDate: '2025-08-15',
    dataRetention: '3 years',
    canExportData: true,
    canDeleteData: true,
    thirdPartySharing: false,
    anonymizationLevel: 'High'
  }
};

export const StudentAIModel: React.FC = () => {
  const { studentId: _studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'insights' | 'training' | 'privacy'>('overview');
  const [_showRetrainingModal, setShowRetrainingModal] = useState(false);
  const [_showExportModal, setShowExportModal] = useState(false);

  const student = mockStudentData; // In real app, fetch using _studentId
  const model = student.aiModel;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'training': return 'bg-blue-100 text-blue-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5" />;
      case 'training': return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'inactive': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Award className="w-5 h-5 text-green-600" />;
      case 'intervention': return <Target className="w-5 h-5 text-orange-600" />;
      case 'prediction': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'behavioral': return <Activity className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Students
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{student.name}'s AI Learning Model</h1>
                <p className="text-purple-100 mb-2">Student ID: {student.id} • Grade {student.grade}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4" />
                    {student.school}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {student.teacher}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Model Version {model.version}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRetrainingModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30"
              >
                <RefreshCw className="w-5 h-5" />
                Retrain Model
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg"
              >
                <Download className="w-5 h-5" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Model Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getStatusColor(model.status)}`}>
                {getStatusIcon(model.status)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Model Status: {model.status.charAt(0).toUpperCase() + model.status.slice(1)}</h3>
                <p className="text-gray-600">Last updated {new Date(model.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{model.accuracy}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-blue-600">{model.confidence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-2xl font-bold text-purple-600">{model.dataPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Brain },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'insights', label: 'AI Insights', icon: Sparkles },
            { id: 'training', label: 'Training History', icon: History },
            { id: 'privacy', label: 'Privacy & Data', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Interactions</p>
                    <p className="text-2xl font-bold text-gray-900">{model.totalInteractions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Personalized Content</p>
                    <p className="text-2xl font-bold text-gray-900">{model.personalizedContent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interventions Applied</p>
                    <p className="text-2xl font-bold text-gray-900">{model.interventionsApplied}/{model.interventionsSuggested}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Learning Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{model.learningProgress}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Learning Profile */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                    Learning Profile
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        Strengths
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {student.learningProfile.strengths.map((strength) => (
                          <span key={strength} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        Growth Areas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {student.learningProfile.challenges.map((challenge) => (
                          <span key={challenge} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium">
                            {challenge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Learning Style</p>
                        <p className="font-semibold text-gray-900">{student.learningProfile.learningStyle}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Learning Pace</p>
                        <p className="font-semibold text-gray-900">{student.learningProfile.pace}</p>
                      </div>
                      <div className="p-4 bg-pink-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Optimal Time</p>
                        <p className="font-semibold text-gray-900">{student.learningProfile.preferredTime}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Attention Span</p>
                        <p className="font-semibold text-gray-900">{student.learningProfile.attentionSpan}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Motivation Factors</h3>
                      <div className="space-y-2">
                        {student.learningProfile.motivationFactors.map((factor) => (
                          <div key={factor} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <span className="text-gray-900 font-medium">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cognitive Profile Radar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Cognitive Profile</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={student.cognitiveProfile}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
                      <Radar name="Cognitive Abilities" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Model Technical Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-purple-600" />
                    Technical Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Model Size</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{model.modelSize}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Inference Time</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{model.inferenceTime}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-medium text-gray-700">Last Training</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{model.lastTrainingDuration}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Adaptation Rate</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{model.adaptationRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Next Training */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Next Scheduled Training</h3>
                  </div>
                  <p className="text-2xl font-bold mb-2">
                    {new Date(model.nextScheduledTraining).toLocaleDateString('en-US', { 
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-purple-100 text-sm">
                    {new Date(model.nextScheduledTraining).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <button className="mt-4 w-full px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all border border-white/30 font-medium">
                    Reschedule Training
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors">
                      <Play className="w-5 h-5" />
                      <span className="font-medium">Start Training Session</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View Model Logs</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition-colors">
                      <RotateCcw className="w-5 h-5" />
                      <span className="font-medium">Reset to Baseline</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Overall Performance</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block text-purple-600">
                      {student.performanceMetrics.overallScore}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-purple-200">
                    <div
                      style={{ width: `${student.performanceMetrics.overallScore}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-600 font-semibold">+{student.performanceMetrics.improvement}%</span> improvement this semester
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Engagement Level</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {student.performanceMetrics.engagement}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-200">
                    <div
                      style={{ width: `${student.performanceMetrics.engagement}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">High engagement during morning sessions</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Consistency Score</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {student.performanceMetrics.consistency}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-green-200">
                    <div
                      style={{ width: `${student.performanceMetrics.consistency}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Steady progress across all subjects</p>
              </div>
            </div>

            {/* Progress Over Time Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={student.progressOverTime}>
                  <defs>
                    <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScience" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="mathematics" stroke="#a855f7" fillOpacity={1} fill="url(#colorMath)" name="Mathematics" />
                  <Area type="monotone" dataKey="reading" stroke="#ec4899" fillOpacity={1} fill="url(#colorReading)" name="Reading" />
                  <Area type="monotone" dataKey="science" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScience)" name="Science" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subject Performance Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { subject: 'Math', score: student.performanceMetrics.mathematics },
                    { subject: 'Reading', score: student.performanceMetrics.reading },
                    { subject: 'Science', score: student.performanceMetrics.science },
                    { subject: 'Social Studies', score: student.performanceMetrics.socialStudies },
                    { subject: 'Writing', score: student.performanceMetrics.writing }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]}>
                    {[student.performanceMetrics.mathematics, student.performanceMetrics.reading, 
                      student.performanceMetrics.science, student.performanceMetrics.socialStudies, 
                      student.performanceMetrics.writing].map((score, index) => (
                      <Cell key={`cell-${index}`} fill={
                        score >= 90 ? '#10b981' :
                        score >= 80 ? '#3b82f6' :
                        score >= 70 ? '#f59e0b' :
                        '#ef4444'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* AI Generated Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI-Generated Insights
              </h2>
              <div className="space-y-4">
                {student.aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <span className="font-semibold text-gray-900">{insight.category}</span>
                          <span className="text-sm text-gray-600 ml-2">• {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-white rounded-full">
                          <span className="text-xs font-semibold text-gray-700">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{insight.insight}</p>
                    <p className="text-xs text-gray-500 mt-2">Generated on {new Date(insight.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Adaptive Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-600" />
                Adaptive Recommendations
              </h2>
              <div className="space-y-4">
                {student.adaptiveRecommendations.map((rec) => (
                  <div key={rec.id} className="p-5 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{rec.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            rec.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {rec.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>{rec.impact}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{rec.implementedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {rec.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Approve & Implement
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Training History Tab */}
        {activeTab === 'training' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Training Session History</h2>
              <div className="space-y-4">
                {student.trainingHistory.map((session, index) => (
                  <div key={index} className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">Duration: {session.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{session.accuracy}%</p>
                        <p className="text-sm text-gray-600">Accuracy</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Data Points</p>
                        <p className="font-semibold text-gray-900">{session.dataPoints}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <p className="font-semibold text-gray-900 capitalize">{session.status}</p>
                      </div>
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900">{session.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Accuracy Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Training Accuracy Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={student.trainingHistory.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888"
                    tickFormatter={(date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#888" domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} name="Accuracy %" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Privacy & Data Tab */}
        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                Data Privacy & Consent
              </h2>
              
              <div className="space-y-6">
                <div className="p-5 bg-green-50 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-gray-900">Parent Consent Granted</h3>
                  </div>
                  <p className="text-gray-700">
                    Consent provided on {new Date(student.dataPrivacy.consentDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Data Collection Status</p>
                    <p className="font-bold text-gray-900 text-lg">{student.dataPrivacy.dataCollection}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Data Retention Period</p>
                    <p className="font-bold text-gray-900 text-lg">{student.dataPrivacy.dataRetention}</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Anonymization Level</p>
                    <p className="font-bold text-gray-900 text-lg">{student.dataPrivacy.anonymizationLevel}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Third-Party Sharing</p>
                    <p className="font-bold text-gray-900 text-lg">{student.dataPrivacy.thirdPartySharing ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Data Rights & Controls</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900">Export Student Data</span>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Export
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">View Privacy Policy</span>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        View
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Request Data Deletion</span>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        Request
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Compliance & Security
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>FERPA compliant data handling and storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>COPPA compliant for students under 13</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>End-to-end encryption for all sensitive data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Regular security audits and penetration testing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

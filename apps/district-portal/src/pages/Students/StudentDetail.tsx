import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  School,
  GraduationCap,
  Brain,
  FileText,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  Edit,
  Download,
  MessageSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Mock student data
const mockStudentData = {
  id: 'STU-001',
  name: 'Emma Johnson',
  firstName: 'Emma',
  lastName: 'Johnson',
  grade: 5,
  age: 10,
  dateOfBirth: '2014-05-15',
  gender: 'Female',
  studentId: 'STU-001',
  enrollmentDate: '2023-08-15',
  status: 'Active',
  
  // Contact Info
  email: 'emma.johnson@student.school.edu',
  phone: '(555) 123-4567',
  address: '123 Oak Street',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  
  // School Info
  school: 'Lincoln Elementary',
  schoolId: 'SCH-001',
  homeroom: 'Room 205',
  teacher: 'Mrs. Sarah Smith',
  teacherId: 'TCH-001',
  
  // Parent/Guardian Info
  parents: [
    {
      name: 'Jennifer Johnson',
      relationship: 'Mother',
      email: 'jennifer.j@email.com',
      phone: '(555) 234-5678',
      isPrimary: true
    },
    {
      name: 'Michael Johnson',
      relationship: 'Father',
      email: 'michael.j@email.com',
      phone: '(555) 234-5679',
      isPrimary: false
    }
  ],
  
  // Academic Info
  gpa: 3.8,
  attendanceRate: 96.5,
  hasIEP: true,
  iepId: 'IEP-001',
  iepStatus: 'Active',
  iepNextReview: '2025-12-15',
  
  // AI Model
  aiModelStatus: 'Active',
  aiModelAccuracy: 94.2,
  aiModelLastUpdated: '2025-11-05',
  
  // Performance Metrics
  performanceMetrics: {
    overall: 85,
    mathematics: 92,
    reading: 78,
    science: 88,
    socialStudies: 82,
    writing: 76,
    arts: 90,
    physicalEducation: 95
  },
  
  // Attendance History
  attendanceHistory: [
    { month: 'Aug', present: 20, absent: 0, tardy: 1 },
    { month: 'Sep', present: 21, absent: 1, tardy: 0 },
    { month: 'Oct', present: 22, absent: 0, tardy: 2 },
    { month: 'Nov', present: 18, absent: 1, tardy: 0 }
  ],
  
  // Performance Trend
  performanceTrend: [
    { month: 'Aug', score: 80 },
    { month: 'Sep', score: 82 },
    { month: 'Oct', score: 84 },
    { month: 'Nov', score: 85 }
  ],
  
  // Recent Activities
  recentActivities: [
    { date: '2025-11-05', type: 'assessment', description: 'Math Quiz - Chapter 5', score: 95 },
    { date: '2025-11-04', type: 'assignment', description: 'Science Lab Report', score: 88 },
    { date: '2025-11-03', type: 'participation', description: 'Class Discussion: History' },
    { date: '2025-11-01', type: 'achievement', description: 'Perfect Attendance - October' }
  ],
  
  // Behavioral Notes
  behavioralNotes: [
    {
      date: '2025-10-28',
      type: 'positive',
      note: 'Excellent leadership during group project',
      reportedBy: 'Mrs. Smith'
    },
    {
      date: '2025-10-15',
      type: 'neutral',
      note: 'Requested additional support in reading comprehension',
      reportedBy: 'Reading Specialist'
    }
  ],
  
  // Strengths & Challenges
  strengths: ['Mathematical Reasoning', 'Problem Solving', 'Teamwork', 'Creativity'],
  challenges: ['Reading Comprehension', 'Time Management', 'Extended Writing'],
  
  // Special Programs
  specialPrograms: ['Gifted Math', 'Art Enrichment', 'IEP - Reading Support'],
  
  // Medical/Allergies
  medicalInfo: {
    allergies: ['Peanuts', 'Tree Nuts'],
    medications: [],
    emergencyContact: 'Jennifer Johnson - (555) 234-5678'
  }
};

export const StudentDetail: React.FC = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'behavior' | 'contact'>('overview');

  const student = mockStudentData; // In real app, fetch using studentId with TanStack Query
  console.log('Viewing student:', studentId); // For future API integration

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
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
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                {student.firstName[0]}{student.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                <p className="text-purple-100 mb-2">Student ID: {student.studentId} • Grade {student.grade}</p>
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
                    Age {student.age}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {student.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/students/${student.id}/ai-model`}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30"
              >
                <Brain className="w-5 h-5" />
                View AI Model
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Performance</p>
                <p className="text-2xl font-bold text-gray-900">{student.performanceMetrics.overall}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+5% this quarter</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{student.attendanceRate}%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Excellent attendance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Model Status</p>
                <p className="text-2xl font-bold text-gray-900">{student.aiModelAccuracy}%</p>
              </div>
            </div>
            <p className="text-sm text-pink-600 font-medium capitalize">{student.aiModelStatus}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${
              student.hasIEP ? 'border-orange-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                student.hasIEP ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-6 h-6 ${student.hasIEP ? 'text-orange-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">IEP Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {student.hasIEP ? 'Active IEP' : 'No IEP'}
                </p>
              </div>
            </div>
            {student.hasIEP && (
              <Link
                to={`/ieps/${student.iepId}`}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                View IEP →
              </Link>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'academic', label: 'Academic', icon: BookOpen },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'behavior', label: 'Behavior', icon: Award },
            { id: 'contact', label: 'Contact', icon: Phone }
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
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={student.performanceTrend}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#a855f7" fillOpacity={1} fill="url(#colorScore)" name="Performance Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Performance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Subject Performance</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={[
                      { subject: 'Math', score: student.performanceMetrics.mathematics },
                      { subject: 'Reading', score: student.performanceMetrics.reading },
                      { subject: 'Science', score: student.performanceMetrics.science },
                      { subject: 'Social Studies', score: student.performanceMetrics.socialStudies },
                      { subject: 'Writing', score: student.performanceMetrics.writing },
                      { subject: 'Arts', score: student.performanceMetrics.arts },
                      { subject: 'PE', score: student.performanceMetrics.physicalEducation }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="subject" stroke="#888" />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {Object.values(student.performanceMetrics).map((score, index) => (
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

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
                <div className="space-y-3">
                  {student.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'assessment' ? 'bg-purple-100' :
                        activity.type === 'assignment' ? 'bg-blue-100' :
                        activity.type === 'achievement' ? 'bg-green-100' :
                        'bg-pink-100'
                      }`}>
                        {activity.type === 'assessment' && <Target className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'assignment' && <FileText className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'achievement' && <Award className="w-5 h-5 text-green-600" />}
                        {activity.type === 'participation' && <Users className="w-5 h-5 text-pink-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                      {activity.score && (
                        <div className={`px-3 py-1 rounded-full ${getScoreBgColor(activity.score)}`}>
                          <span className={`font-bold ${getScoreColor(activity.score)}`}>{activity.score}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Grade Level</p>
                      <p className="font-semibold text-gray-900">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <School className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Homeroom</p>
                      <p className="font-semibold text-gray-900">{student.homeroom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-xs text-gray-600">Enrollment Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-green-600" />
                  Strengths
                </h2>
                <div className="flex flex-wrap gap-2">
                  {student.strengths.map((strength) => (
                    <span key={strength} className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  Growth Areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {student.challenges.map((challenge) => (
                    <span key={challenge} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-medium">
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Programs */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Special Programs</h2>
                <div className="space-y-2">
                  {student.specialPrograms.map((program, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-900 font-medium">{program}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Info */}
              {student.medicalInfo.allergies.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
                  <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Medical Alerts
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">Allergies:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.medicalInfo.allergies.map((allergy) => (
                          <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-sm font-semibold text-red-800 mb-1">Emergency Contact:</p>
                      <p className="text-sm text-red-700">{student.medicalInfo.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Message Parent</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download Report Card</span>
                  </button>
                  <Link
                    to={`/students/${student.id}/ai-model`}
                    className="w-full flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors"
                  >
                    <Brain className="w-5 h-5" />
                    <span className="font-medium">View AI Learning Model</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other tabs would go here (academic, attendance, behavior, contact) */}
        {activeTab !== 'overview' && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Academic Performance</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Current GPA</p>
                    <p className="text-3xl font-bold text-purple-600">3.8</p>
                    <p className="text-sm text-green-600 mt-1">+0.3 from last semester</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Class Rank</p>
                    <p className="text-3xl font-bold text-blue-600">12 <span className="text-lg">/156</span></p>
                    <p className="text-sm text-gray-600 mt-1">Top 8% of grade level</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Subject Grades</h4>
                <div className="space-y-3">
                  {[
                    { subject: 'Mathematics', grade: 'A', score: 95, teacher: 'Ms. Johnson' },
                    { subject: 'English Language Arts', grade: 'A-', score: 92, teacher: 'Mr. Davis' },
                    { subject: 'Science', grade: 'A', score: 94, teacher: 'Dr. Chen' },
                    { subject: 'Social Studies', grade: 'B+', score: 88, teacher: 'Mrs. Wilson' },
                    { subject: 'Physical Education', grade: 'A', score: 97, teacher: 'Coach Martinez' },
                    { subject: 'Art', grade: 'A', score: 96, teacher: 'Ms. Brown' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.subject}</p>
                        <p className="text-sm text-gray-600">{item.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{item.grade}</p>
                        <p className="text-sm text-gray-600">{item.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-gray-900 mt-6 mb-4">Assignment Completion</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">On Time</p>
                    <p className="text-2xl font-bold text-green-600">94%</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">4%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Missing</p>
                    <p className="text-2xl font-bold text-red-600">2%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Attendance Record</h3>
                
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Present</p>
                    <p className="text-2xl font-bold text-green-600">142 days</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Tardy</p>
                    <p className="text-2xl font-bold text-yellow-600">3 days</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Excused Absence</p>
                    <p className="text-2xl font-bold text-orange-600">2 days</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Unexcused</p>
                    <p className="text-2xl font-bold text-red-600">0 days</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Recent Attendance</h4>
                <div className="space-y-2">
                  {[
                    { date: '2025-11-06', status: 'Present', time: 'On time' },
                    { date: '2025-11-05', status: 'Present', time: 'On time' },
                    { date: '2025-11-04', status: 'Present', time: 'On time' },
                    { date: '2025-11-01', status: 'Present', time: 'On time' },
                    { date: '2025-10-31', status: 'Present', time: 'On time' },
                    { date: '2025-10-30', status: 'Tardy', time: '8:15 AM (15 min late)' },
                    { date: '2025-10-29', status: 'Present', time: 'On time' },
                    { date: '2025-10-28', status: 'Excused Absence', time: 'Doctor appointment' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.date}</p>
                        <p className="text-sm text-gray-600">{item.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'Present' ? 'bg-green-100 text-green-700' :
                        item.status === 'Tardy' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'Excused Absence' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Behavior Tab */}
            {activeTab === 'behavior' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Behavior & Conduct</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Positive Notes</p>
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-green-600 mt-1">This semester</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Overall Conduct</p>
                    <p className="text-2xl font-bold text-blue-600">Excellent</p>
                    <p className="text-sm text-gray-600 mt-1">Consistent behavior</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Incidents</p>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600 mt-1">This year</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Positive Recognitions</h4>
                <div className="space-y-3">
                  {[
                    { date: '2025-11-04', teacher: 'Ms. Johnson', reason: 'Helped classmate with math problem', category: 'Helpful' },
                    { date: '2025-10-28', teacher: 'Mr. Davis', reason: 'Outstanding class participation', category: 'Engagement' },
                    { date: '2025-10-22', teacher: 'Dr. Chen', reason: 'Excellent project presentation', category: 'Achievement' },
                    { date: '2025-10-15', teacher: 'Mrs. Wilson', reason: 'Demonstrated leadership in group work', category: 'Leadership' },
                    { date: '2025-10-08', teacher: 'Coach Martinez', reason: 'Great sportsmanship during game', category: 'Character' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{item.reason}</p>
                          <p className="text-sm text-gray-600">{item.teacher} • {item.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-gray-900 mt-6 mb-4">Social-Emotional Learning</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { skill: 'Self-Awareness', rating: 5 },
                    { skill: 'Self-Management', rating: 5 },
                    { skill: 'Social Awareness', rating: 4 },
                    { skill: 'Relationship Skills', rating: 5 },
                    { skill: 'Responsible Decision-Making', rating: 4 }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{item.skill}</p>
                        <span className="text-sm font-bold text-purple-600">{item.rating}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(item.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

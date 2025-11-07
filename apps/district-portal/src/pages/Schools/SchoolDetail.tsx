import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  School as SchoolIcon,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  GraduationCap,
  User,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Edit,
  Download,
  BarChart3,
  Clock,
  Target,
  CheckCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell
} from 'recharts';

// Mock school data
const mockSchoolData = {
  id: 'SCH-001',
  name: 'Lincoln Elementary',
  type: 'Elementary School',
  principal: {
    name: 'Dr. Robert Martinez',
    email: 'robert.martinez@school.edu',
    phone: '(555) 111-2222',
    yearsAtSchool: 8
  },
  address: {
    street: '456 Education Boulevard',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701'
  },
  contact: {
    phone: '(555) 100-1000',
    email: 'info@lincoln.edu',
    website: 'www.lincoln-elementary.edu'
  },
  established: 1985,
  gradeRange: 'K-5',
  enrollment: 485,
  capacity: 550,
  teachers: 42,
  staff: 18,
  classSize: 22,
  
  // Performance Metrics
  performanceMetrics: {
    overall: 87,
    academics: 89,
    attendance: 96,
    behavior: 92,
    parentSatisfaction: 94
  },
  
  // Demographics
  demographics: [
    { category: 'White', count: 180, percentage: 37 },
    { category: 'Hispanic', count: 145, percentage: 30 },
    { category: 'Black', count: 95, percentage: 20 },
    { category: 'Asian', count: 50, percentage: 10 },
    { category: 'Other', count: 15, percentage: 3 }
  ],
  
  // Grade Distribution
  gradeDistribution: [
    { grade: 'K', students: 85, teachers: 4 },
    { grade: '1st', students: 82, teachers: 4 },
    { grade: '2nd', students: 78, teachers: 4 },
    { grade: '3rd', students: 80, teachers: 4 },
    { grade: '4th', students: 82, teachers: 4 },
    { grade: '5th', students: 78, teachers: 4 }
  ],
  
  // Performance Trend
  performanceTrend: [
    { month: 'Aug', score: 84 },
    { month: 'Sep', score: 85 },
    { month: 'Oct', score: 86 },
    { month: 'Nov', score: 87 }
  ],
  
  // Attendance Trend
  attendanceTrend: [
    { month: 'Aug', rate: 95 },
    { month: 'Sep', rate: 96 },
    { month: 'Oct', rate: 97 },
    { month: 'Nov', rate: 96 }
  ],
  
  // Top Teachers
  topTeachers: [
    { id: 'TCH-001', name: 'Mrs. Sarah Smith', subject: 'Mathematics', grade: '5th', rating: 4.9, students: 24 },
    { id: 'TCH-002', name: 'Mr. John Davis', subject: 'Science', grade: '4th', rating: 4.8, students: 22 },
    { id: 'TCH-003', name: 'Ms. Emily Brown', subject: 'English', grade: '3rd', rating: 4.7, students: 23 },
    { id: 'TCH-004', name: 'Mrs. Lisa Wilson', subject: 'Reading', grade: 'K', rating: 4.9, students: 20 }
  ],
  
  // Recent Activities
  recentActivities: [
    { date: '2025-11-05', type: 'event', title: 'Fall Festival', description: 'Community event with 200+ attendees' },
    { date: '2025-11-01', type: 'achievement', title: 'State Award', description: 'Recognized for Excellence in STEM' },
    { date: '2025-10-28', type: 'meeting', title: 'Parent-Teacher Conferences', description: '95% parent participation' },
    { date: '2025-10-15', type: 'assessment', title: 'Quarterly Assessments', description: 'Average improvement of 12%' }
  ],
  
  // Programs & Services
  programs: [
    'Gifted & Talented Program',
    'Special Education Services',
    'English Language Learning (ELL)',
    'After School Care',
    'Music & Arts Program',
    'STEM Initiative',
    'Sports & Athletics',
    'School Counseling'
  ],
  
  // Facilities
  facilities: [
    'Computer Lab',
    'Science Lab',
    'Library Media Center',
    'Gymnasium',
    'Music Room',
    'Art Studio',
    'Cafeteria',
    'Playground'
  ],
  
  // Achievements
  achievements: [
    { year: 2024, award: 'Blue Ribbon School', organization: 'US Department of Education' },
    { year: 2024, award: 'STEM Excellence Award', organization: 'State Board of Education' },
    { year: 2023, award: 'Green School Certification', organization: 'Environmental Protection Agency' }
  ]
};

export const SchoolDetail: React.FC = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'performance'>('overview');

  const school = mockSchoolData; // In real app, fetch using schoolId with TanStack Query
  console.log('Viewing school:', schoolId); // For future API integration

  const COLORS = ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#c084fc'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/schools')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Schools
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-xl">
                <SchoolIcon className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
                <p className="text-purple-100 mb-2">{school.type} • Grades {school.gradeRange}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {school.enrollment} Students
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {school.teachers} Teachers
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {school.address.city}, {school.address.state}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Download className="w-5 h-5" />
                Download Report
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <Edit className="w-5 h-5" />
                Edit School
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
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
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-2xl font-bold text-gray-900">{school.performanceMetrics.overall}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+3% this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Enrollment</p>
            <p className="text-2xl font-bold text-gray-900">{school.enrollment}/{school.capacity}</p>
            <p className="text-sm text-blue-600 font-medium">{Math.round((school.enrollment / school.capacity) * 100)}% Capacity</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Attendance</p>
            <p className="text-2xl font-bold text-gray-900">{school.performanceMetrics.attendance}%</p>
            <p className="text-sm text-green-600 font-medium">Excellent</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-sm text-gray-600">Avg Class Size</p>
            <p className="text-2xl font-bold text-gray-900">{school.classSize}</p>
            <p className="text-sm text-pink-600 font-medium">Students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Teachers</p>
            <p className="text-2xl font-bold text-gray-900">{school.teachers}</p>
            <p className="text-sm text-orange-600 font-medium">+{school.staff} Staff</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: SchoolIcon },
            { id: 'teachers', label: 'Teachers', icon: User },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'performance', label: 'Performance', icon: BarChart3 }
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
              {/* School Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">School Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-900">{school.address.street}</p>
                          <p className="text-sm text-gray-600">{school.address.city}, {school.address.state} {school.address.zipCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-purple-600" />
                        <p className="text-sm text-gray-900">{school.contact.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-600" />
                        <p className="text-sm text-gray-900">{school.contact.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <a href={`https://${school.contact.website}`} className="text-sm text-purple-600 hover:text-purple-700">
                          {school.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-4">Principal</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <p className="font-bold text-gray-900 mb-1">{school.principal.name}</p>
                      <p className="text-sm text-gray-600 mb-3">{school.principal.yearsAtSchool} years at school</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">{school.principal.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">{school.principal.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Performance & Attendance Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      data={school.performanceTrend}
                      type="monotone" 
                      dataKey="score" 
                      stroke="#a855f7" 
                      strokeWidth={3}
                      name="Performance Score" 
                      dot={{ fill: '#a855f7', r: 5 }}
                    />
                    <Line 
                      data={school.attendanceTrend}
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      name="Attendance Rate" 
                      dot={{ fill: '#ec4899', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Student Distribution by Grade</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={school.gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="grade" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#a855f7" radius={[8, 8, 0, 0]} name="Students" />
                    <Bar dataKey="teachers" fill="#ec4899" radius={[8, 8, 0, 0]} name="Teachers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
                <div className="space-y-3">
                  {school.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'event' ? 'bg-purple-100' :
                        activity.type === 'achievement' ? 'bg-green-100' :
                        activity.type === 'meeting' ? 'bg-blue-100' :
                        'bg-pink-100'
                      }`}>
                        {activity.type === 'event' && <Calendar className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'achievement' && <Award className="w-5 h-5 text-green-600" />}
                        {activity.type === 'meeting' && <Users className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'assessment' && <BarChart3 className="w-5 h-5 text-pink-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Demographics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Student Demographics</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={school.demographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {school.demographics.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Programs & Services */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Programs & Services
                </h2>
                <div className="space-y-2">
                  {school.programs.map((program, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{program}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <SchoolIcon className="w-6 h-6 text-blue-600" />
                  Facilities
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {school.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs text-gray-900">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Recent Achievements
                </h2>
                <div className="space-y-3">
                  {school.achievements.map((achievement, index) => (
                    <div key={index} className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
                      <p className="font-semibold text-gray-900 text-sm">{achievement.award}</p>
                      <p className="text-xs text-gray-600">{achievement.organization}</p>
                      <p className="text-xs text-yellow-700 font-medium mt-1">{achievement.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Established:</span>
                    <span className="font-semibold text-gray-900">{school.established}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Student:Teacher Ratio:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(school.enrollment / school.teachers)}:1
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Staff:</span>
                    <span className="font-semibold text-gray-900">{school.teachers + school.staff}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Teaching Staff ({school.teachers})</h2>
              <Link
                to="/teachers"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                View All Teachers →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {school.topTeachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  to={`/teachers/${teacher.id}`}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 hover:border-purple-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-600">
                      {teacher.name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.subject} • Grade {teacher.grade}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{teacher.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">{teacher.students} students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student Enrollment ({school.enrollment})</h2>
              <Link
                to="/students"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                View All Students →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{school.enrollment}</p>
                <p className="text-sm text-gray-700">Total Students</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Target className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{school.capacity - school.enrollment}</p>
                <p className="text-sm text-gray-700">Available Spots</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{school.classSize}</p>
                <p className="text-sm text-gray-700">Avg Class Size</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={school.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#a855f7" radius={[8, 8, 0, 0]} name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                {[
                  { label: 'Academics', value: school.performanceMetrics.academics, color: 'purple' },
                  { label: 'Attendance', value: school.performanceMetrics.attendance, color: 'blue' },
                  { label: 'Behavior', value: school.performanceMetrics.behavior, color: 'green' },
                  { label: 'Parent Satisfaction', value: school.performanceMetrics.parentSatisfaction, color: 'pink' },
                  { label: 'Overall', value: school.performanceMetrics.overall, color: 'indigo' }
                ].map((metric) => (
                  <div key={metric.label} className={`p-4 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-xl text-center`}>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}%</p>
                    <p className="text-sm text-gray-700">{metric.label}</p>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={school.performanceTrend}>
                  <defs>
                    <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#a855f7" fillOpacity={1} fill="url(#colorPerformance)" name="Performance Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

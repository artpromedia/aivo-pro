import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  Edit,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  BarChart3,
  Trophy,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock teacher data - in real app, this would come from API
const mockTeacherData = {
  id: 1,
  name: 'Sarah Johnson',
  email: 'sarah.johnson@school.edu',
  phone: '(555) 123-4567',
  school: 'Lincoln Elementary',
  subjects: ['Mathematics', 'Science'],
  grades: ['3rd', '4th'],
  totalStudents: 58,
  activeStudents: 56,
  avgPerformance: 87,
  experience: 8,
  certification: 'Elementary Education, Math Specialist',
  status: 'active',
  joinDate: '2016-08-15',
  avatar: null,
  bio: 'Passionate educator with 8 years of experience in elementary mathematics and science. Committed to creating engaging, hands-on learning experiences that inspire curiosity and critical thinking.',
  achievements: [
    'Teacher of the Year 2023',
    'Math Olympiad Coach',
    'Professional Development Leader',
    'STEM Integration Specialist'
  ],
  education: [
    { degree: 'M.Ed. in Mathematics Education', institution: 'State University', year: '2015' },
    { degree: 'B.A. in Elementary Education', institution: 'City College', year: '2012' }
  ],
  performanceHistory: [
    { month: 'Jan', performance: 85, engagement: 82, attendance: 95 },
    { month: 'Feb', performance: 86, engagement: 84, attendance: 93 },
    { month: 'Mar', performance: 84, engagement: 83, attendance: 96 },
    { month: 'Apr', performance: 87, engagement: 86, attendance: 94 },
    { month: 'May', performance: 88, engagement: 88, attendance: 95 },
    { month: 'Jun', performance: 87, engagement: 87, attendance: 97 }
  ],
  classDistribution: [
    { name: 'Mathematics 3rd', students: 28, avgScore: 89 },
    { name: 'Science 3rd', students: 28, avgScore: 85 },
    { name: 'Mathematics 4th', students: 30, avgScore: 88 }
  ],
  performanceBreakdown: [
    { category: 'Excellent (90-100)', value: 35, color: '#10b981' },
    { category: 'Good (80-89)', value: 40, color: '#3b82f6' },
    { category: 'Average (70-79)', value: 20, color: '#f59e0b' },
    { category: 'Below Average (<70)', value: 5, color: '#ef4444' }
  ],
  recentActivities: [
    { date: '2025-11-05', activity: 'Submitted Q2 Progress Reports', icon: 'check' },
    { date: '2025-11-03', activity: 'Led STEM Workshop for Faculty', icon: 'award' },
    { date: '2025-11-01', activity: 'Parent-Teacher Conferences Completed', icon: 'users' },
    { date: '2025-10-28', activity: 'Updated Lesson Plans for November', icon: 'book' }
  ],
  upcomingEvents: [
    { date: '2025-11-10', event: 'Math Fair Coordination', time: '2:00 PM' },
    { date: '2025-11-15', event: 'Professional Development Session', time: '3:30 PM' },
    { date: '2025-11-20', event: 'Science Olympiad Practice', time: '4:00 PM' }
  ]
};

export const TeacherDetail: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'classes' | 'activities'>('overview');

  const teacher = mockTeacherData; // In real app, fetch by ID using: useQuery(['teacher', _id], ...)
  
  // TODO: Replace with actual API call
  // const { data: teacher, isLoading } = useQuery({
  //   queryKey: ['teacher', id],
  //   queryFn: () => fetchTeacher(id)
  // });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getActivityIcon = (icon: string) => {
    const icons = {
      check: CheckCircle,
      award: Award,
      users: Users,
      book: BookOpen
    };
    const Icon = icons[icon as keyof typeof icons] || CheckCircle;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/teachers')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teachers
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                {getInitials(teacher.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                <p className="text-purple-100 mb-2">{teacher.certification}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {teacher.school}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {teacher.experience} years experience
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {teacher.totalStudents} students
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <MessageSquare className="w-5 h-5" />
                Message
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2 flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'classes', label: 'Classes', icon: BookOpen },
            { id: 'activities', label: 'Activities', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
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
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{teacher.totalStudents}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-medium">{teacher.activeStudents} active</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{teacher.totalStudents - teacher.activeStudents} inactive</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{teacher.avgPerformance}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+3% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Classes</p>
                    <p className="text-2xl font-bold text-gray-900">{teacher.classDistribution.length}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {teacher.subjects.length} subjects
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* About Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{teacher.bio}</p>

                  <h3 className="font-semibold text-gray-900 mb-3">Teaching Areas</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {teacher.subjects.map((subject) => (
                      <span key={subject} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-3">Grade Levels</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.grades.map((grade) => (
                      <span key={grade} className="px-4 py-2 bg-gray-100 rounded-xl font-medium">
                        {grade} Grade
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                  </div>
                  <div className="space-y-3">
                    {teacher.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <span className="text-gray-900 font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Education</h2>
                  </div>
                  <div className="space-y-4">
                    {teacher.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-gray-900">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <a href={`mailto:${teacher.email}`} className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                      <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm font-medium text-purple-600">{teacher.email}</p>
                      </div>
                    </a>

                    <a href={`tel:${teacher.phone}`} className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors group">
                      <div className="w-10 h-10 bg-pink-100 group-hover:bg-pink-200 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="text-sm font-medium text-pink-600">{teacher.phone}</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">School</p>
                        <p className="text-sm font-medium text-gray-900">{teacher.school}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Join Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(teacher.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                  </div>
                  <div className="space-y-3">
                    {teacher.upcomingEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-xl">
                        <p className="font-medium text-gray-900 text-sm">{event.event}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    ))}
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
            {/* Performance Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={teacher.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#a855f7" strokeWidth={3} name="Performance" />
                  <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} name="Engagement" />
                  <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} name="Attendance" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Student Performance Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Student Performance Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={teacher.performanceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {teacher.performanceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {teacher.performanceBreakdown.map((item) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Student Engagement</span>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.round((teacher.activeStudents / teacher.totalStudents) * 100)}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(teacher.activeStudents / teacher.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Average Class Score</span>
                      <span className="text-sm font-bold text-blue-600">{teacher.avgPerformance}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${teacher.avgPerformance}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Assignment Completion</span>
                      <span className="text-sm font-bold text-green-600">94%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Parent Satisfaction</span>
                      <span className="text-sm font-bold text-yellow-600">4.8/5</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Class Performance Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teacher.classDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#a855f7" name="Students" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="avgScore" fill="#ec4899" name="Avg Score" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {teacher.classDistribution.map((classItem, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{classItem.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      classItem.avgScore >= 90 ? 'bg-green-100 text-green-700' :
                      classItem.avgScore >= 80 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {classItem.avgScore}%
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Students</span>
                      <span className="font-semibold text-gray-900">{classItem.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Score</span>
                      <span className="font-semibold text-gray-900">{classItem.avgScore}%</span>
                    </div>
                  </div>
                  <Link
                    to={`/classes/${index}`}
                    className="mt-4 block text-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm"
                  >
                    View Class Details
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {teacher.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

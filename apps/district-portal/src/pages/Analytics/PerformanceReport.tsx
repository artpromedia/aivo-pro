import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Award,
  School,
  Download,
  Filter,
  Target,
  BarChart3,
  TrendingDown,
  Minus
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area
} from 'recharts';

// Mock performance data
const mockPerformanceData = {
  summary: {
    avgStudentProgress: 87,
    teacherEffectiveness: 92,
    schoolRanking: 8,
    totalSchools: 25
  },
  studentProgress: [
    { month: 'Aug', overall: 78, math: 82, reading: 75, science: 79 },
    { month: 'Sep', overall: 81, math: 84, reading: 78, science: 82 },
    { month: 'Oct', overall: 84, math: 87, reading: 81, science: 84 },
    { month: 'Nov', overall: 87, math: 89, reading: 85, science: 87 }
  ],
  topPerformingSchools: [
    { name: 'Lincoln Elementary', score: 94, students: 485, growth: 12 },
    { name: 'Washington Middle', score: 91, students: 620, growth: 10 },
    { name: 'Roosevelt High', score: 89, students: 1240, growth: 8 },
    { name: 'Jefferson Elementary', score: 86, students: 420, growth: 15 },
    { name: 'Madison Middle', score: 84, students: 580, growth: 9 }
  ],
  teacherPerformance: [
    { name: 'Sarah Smith', rating: 4.9, students: 24, improvement: 15 },
    { name: 'John Davis', rating: 4.8, students: 22, improvement: 12 },
    { name: 'Emily Brown', rating: 4.7, students: 23, improvement: 14 },
    { name: 'Michael Chen', rating: 4.6, students: 25, improvement: 10 },
    { name: 'Lisa Wilson', rating: 4.5, students: 20, improvement: 13 }
  ],
  subjectPerformance: [
    { subject: 'Mathematics', score: 89, benchmark: 85, variance: 4 },
    { subject: 'Reading', score: 85, benchmark: 82, variance: 3 },
    { subject: 'Science', score: 87, benchmark: 84, variance: 3 },
    { subject: 'Social Studies', score: 82, benchmark: 80, variance: 2 },
    { subject: 'Writing', score: 78, benchmark: 78, variance: 0 }
  ],
  gradeComparison: [
    { grade: 'K', proficiency: 85, growth: 12 },
    { grade: '1st', proficiency: 82, growth: 10 },
    { grade: '2nd', proficiency: 84, growth: 11 },
    { grade: '3rd', proficiency: 87, growth: 13 },
    { grade: '4th', proficiency: 86, growth: 9 },
    { grade: '5th', proficiency: 89, growth: 14 }
  ],
  districtComparison: [
    { category: 'Academic Achievement', district: 87, state: 82, national: 78 },
    { category: 'Student Growth', district: 85, state: 80, national: 75 },
    { category: 'Engagement', district: 92, state: 88, national: 85 },
    { category: 'Graduation Rate', district: 94, state: 90, national: 87 },
    { category: 'College Readiness', district: 78, state: 75, national: 72 }
  ]
};

export const PerformanceReport: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('semester');

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Analytics
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
              <p className="text-purple-100">Track student progress, teacher effectiveness, and school rankings</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="quarter">This Quarter</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Student Progress</p>
                <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.summary.avgStudentProgress}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(9)}
              <span className={`text-sm font-medium ${getTrendColor(9)}`}>+9% from last period</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Teacher Effectiveness</p>
            <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.summary.teacherEffectiveness}%</p>
            <p className="text-sm text-blue-600 font-medium">Above district avg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <School className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">District Ranking</p>
            <p className="text-2xl font-bold text-gray-900">#{mockPerformanceData.summary.schoolRanking}</p>
            <p className="text-sm text-green-600 font-medium">Out of {mockPerformanceData.summary.totalSchools} schools</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-sm text-gray-600">Achievement Gap</p>
            <p className="text-2xl font-bold text-gray-900">-3.2%</p>
            <p className="text-sm text-pink-600 font-medium">Narrowing trend</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Progress Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Student Progress Trends
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={mockPerformanceData.studentProgress}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="overall" stroke="#a855f7" fill="url(#colorOverall)" name="Overall" />
                  <Line type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={2} name="Math" />
                  <Line type="monotone" dataKey="reading" stroke="#ec4899" strokeWidth={2} name="Reading" />
                  <Line type="monotone" dataKey="science" stroke="#10b981" strokeWidth={2} name="Science" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Performance vs Benchmark */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Subject Performance vs Benchmark
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockPerformanceData.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]} name="Actual Score" />
                  <Bar dataKey="benchmark" fill="#ec4899" radius={[8, 8, 0, 0]} name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {mockPerformanceData.subjectPerformance.map((subject, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-xs text-gray-600 mb-1">{subject.subject.split(' ')[0]}</p>
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(subject.variance)}
                      <span className={`text-sm font-bold ${getTrendColor(subject.variance)}`}>
                        {subject.variance > 0 ? '+' : ''}{subject.variance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* District vs State vs National Comparison */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Benchmarking</h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={mockPerformanceData.districtComparison}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="District" dataKey="district" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                  <Radar name="State Avg" dataKey="state" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name="National Avg" dataKey="national" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Grade-Level Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Grade-Level Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockPerformanceData.gradeComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="grade" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="proficiency" fill="#a855f7" radius={[8, 8, 0, 0]} name="Proficiency %" />
                  <Bar dataKey="growth" fill="#10b981" radius={[8, 8, 0, 0]} name="Growth %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column - Rankings & Lists */}
          <div className="space-y-6">
            {/* Top Performing Schools */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <School className="w-6 h-6 text-green-600" />
                Top Performing Schools
              </h2>
              <div className="space-y-3">
                {mockPerformanceData.topPerformingSchools.map((school, index) => (
                  <Link
                    key={index}
                    to={`/schools/${index + 1}`}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all border border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-purple-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{school.name}</p>
                          <p className="text-xs text-gray-600">{school.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{school.score}%</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-medium">+{school.growth}%</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Teachers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Top Performing Teachers
              </h2>
              <div className="space-y-3">
                {mockPerformanceData.teacherPerformance.map((teacher, index) => (
                  <Link
                    key={index}
                    to={`/teachers/${index + 1}`}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{teacher.name}</p>
                      <p className="text-xs text-gray-600">{teacher.students} students</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900">{teacher.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs">+{teacher.improvement}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Key Insights
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Math Excellence</p>
                  <p className="text-xs text-gray-600">89% proficiency - 4 points above benchmark</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Reading Growth</p>
                  <p className="text-xs text-gray-600">10-point improvement over last quarter</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Teacher Impact</p>
                  <p className="text-xs text-gray-600">Top 20% teachers show 15% higher student growth</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">District Standing</p>
                  <p className="text-xs text-gray-600">Ranked #8 overall with upward trajectory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

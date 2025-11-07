import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BookOpen, Award, Plus, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClassStats {
  classId: string;
  className: string;
  grade: number;
  studentCount: number;
  averageProgress: number;
  activeStudents: number;
  consentCompleted: number;
  needsAttention: number;
}

export default function TeacherDashboard() {
  const [classes] = useState<ClassStats[]>([
    {
      classId: '1',
      className: 'Period 1 - Mathematics',
      grade: 4,
      studentCount: 24,
      averageProgress: 78,
      activeStudents: 22,
      consentCompleted: 20,
      needsAttention: 3,
    },
    {
      classId: '2',
      className: 'Period 2 - Science',
      grade: 4,
      studentCount: 26,
      averageProgress: 82,
      activeStudents: 24,
      consentCompleted: 24,
      needsAttention: 1,
    },
    {
      classId: '3',
      className: 'Period 4 - Reading',
      grade: 3,
      studentCount: 22,
      averageProgress: 75,
      activeStudents: 20,
      consentCompleted: 19,
      needsAttention: 4,
    },
  ]);

  const overallStats = {
    totalStudents: classes.reduce((sum, c) => sum + c.studentCount, 0),
    avgProgress: Math.round(classes.reduce((sum, c) => sum + c.averageProgress, 0) / classes.length),
    activeToday: classes.reduce((sum, c) => sum + c.activeStudents, 0),
    pendingConsent: classes.reduce((sum, c) => sum + (c.studentCount - c.consentCompleted), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your classes and student progress.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Link
            to="/bulk-add"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Bulk Add Students</div>
              <div className="text-sm text-gray-600">CSV Upload</div>
            </div>
          </Link>

          <Link
            to="/consent-tracking"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Consent Management</div>
              <div className="text-sm text-gray-600">{overallStats.pendingConsent} pending</div>
            </div>
          </Link>

          <Link
            to="/schedule-assessment"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Schedule Assessment</div>
              <div className="text-sm text-gray-600">Baseline tests</div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="p-3 bg-orange-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Generate Reports</div>
              <div className="text-sm text-gray-600">Class & District</div>
            </div>
          </Link>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Users}
            label="Total Students"
            value={overallStats.totalStudents}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Average Progress"
            value={`${overallStats.avgProgress}%`}
            color="green"
          />
          <StatCard
            icon={BookOpen}
            label="Active Today"
            value={overallStats.activeToday}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Pending Consent"
            value={overallStats.pendingConsent}
            color="orange"
          />
        </motion.div>

        {/* Classes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Class
            </button>
          </div>

          {classes.map((classData, index) => (
            <motion.div
              key={classData.classId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <ClassCard classData={classData} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: any;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

// Class Card Component
interface ClassCardProps {
  classData: ClassStats;
}

function ClassCard({ classData }: ClassCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{classData.className}</h3>
          <p className="text-gray-600">Grade {classData.grade} • {classData.studentCount} students</p>
        </div>
        <Link
          to={`/class/${classData.classId}`}
          className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-200 transition-colors"
        >
          View Details
        </Link>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Average Progress</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gray-900">{classData.averageProgress}%</div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              style={{ width: `${classData.averageProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Active Today</div>
          <div className="text-2xl font-bold text-gray-900">{classData.activeStudents}</div>
          <div className="text-xs text-gray-500 mt-1">
            of {classData.studentCount} students
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Consent Status</div>
          <div className="text-2xl font-bold text-gray-900">{classData.consentCompleted}</div>
          <div className="text-xs text-gray-500 mt-1">
            {classData.studentCount - classData.consentCompleted} pending
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">Needs Attention</div>
          <div className={`text-2xl font-bold ${classData.needsAttention > 0 ? 'text-orange-500' : 'text-gray-900'}`}>
            {classData.needsAttention}
          </div>
          <div className="text-xs text-gray-500 mt-1">students</div>
        </div>
      </div>

      {classData.needsAttention > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center gap-2 text-orange-800">
            <Award className="w-5 h-5" />
            <span className="font-semibold">
              {classData.needsAttention} students need your attention
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

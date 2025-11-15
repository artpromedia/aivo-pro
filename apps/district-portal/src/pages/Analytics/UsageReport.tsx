import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchUsageReport } from '../../services/districtApi';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  Activity,
  Download,
  Filter,
  BarChart3,
  MousePointer,
  RefreshCw,
  AlertCircle
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#c084fc'];

export const UsageReport: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7days');
  const districtId = 'SD-12345'; // In production, get from auth context

  // Fetch usage data from API
  const { data: usageData, isLoading, error, refetch } = useQuery({
    queryKey: ['usage-report', districtId, dateRange],
    queryFn: () => fetchUsageReport(districtId, dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-coral-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading usage data...</p>
        </div>
      </div>
    );
  }

  if (error || !usageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Failed to load usage data</p>
          <p className="text-gray-600 mb-4">Using demo data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mockUsageData = usageData; // Keep variable name for backwards compatibility

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
              <h1 className="text-3xl font-bold mb-2">Usage Analytics</h1>
              <p className="text-purple-100">Track login frequency, feature adoption, and user engagement</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
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
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Logins</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsageData.summary.totalLogins.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12% vs last period</span>
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
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-gray-900">{mockUsageData.summary.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-blue-600 font-medium">Across all roles</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Avg Session</p>
            <p className="text-2xl font-bold text-gray-900">{mockUsageData.summary.avgSessionDuration}</p>
            <p className="text-sm text-green-600 font-medium">Per user session</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <Activity className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-sm text-gray-600">Feature Adoption</p>
            <p className="text-2xl font-bold text-gray-900">{mockUsageData.summary.featureAdoption}%</p>
            <p className="text-sm text-pink-600 font-medium">Using 3+ features</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Login Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Login Activity Trend
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockUsageData.loginTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="logins" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    name="Total Logins" 
                    dot={{ fill: '#a855f7', r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uniqueUsers" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    name="Unique Users" 
                    dot={{ fill: '#ec4899', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Feature Usage */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Feature Usage Statistics
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockUsageData.featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="feature" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#a855f7" radius={[8, 8, 0, 0]} name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {mockUsageData.featureUsage.slice(0, 3).map((feature: { feature: string; avgTime: string }, index: number) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">{feature.feature}</p>
                    <p className="text-lg font-bold text-gray-900">{feature.avgTime}</p>
                    <p className="text-xs text-purple-600">Avg Time</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Peak Usage Hours
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockUsageData.peakHours}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#10b981" fillOpacity={1} fill="url(#colorActivity)" name="Activity Level" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* User Activity by Role */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Active Users by Role</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mockUsageData.userActivity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, percentage }) => `${role} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mockUsageData.userActivity.map((_entry: unknown, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {mockUsageData.userActivity.map((role: { role: string; count: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm font-medium text-gray-900">{role.role}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Duration Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Session Duration</h2>
              <div className="space-y-3">
                {mockUsageData.sessionDuration.map((session: { range: string; count: number; percentage: number }, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{session.range}</span>
                      <span className="text-sm font-bold text-gray-900">{session.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{ width: `${(session.count / 3120) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Key Insights
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Peak Usage</p>
                  <p className="text-xs text-gray-600">10 AM - 12 PM shows highest activity</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Feature Adoption</p>
                  <p className="text-xs text-gray-600">AI Model feature gaining +15% monthly</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm font-semibold text-gray-900 mb-1">User Engagement</p>
                  <p className="text-xs text-gray-600">Average 3.2 logins per active user/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

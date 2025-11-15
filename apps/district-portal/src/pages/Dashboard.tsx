import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  School, 
  Users, 
  CreditCard, 
  Award,
  AlertCircle,
  Download,
  BarChart3,
  FileText,
  Shield,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  Settings,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDistrictOverview, type DistrictData } from '../services/districtApi';
import {
  Line,
  BarChart,
  Bar,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

// Chart colors for AIVO branding
const COLORS = {
  primary: '#a855f7', // purple-500
  secondary: '#ec4899', // pink-500
  tertiary: '#8b5cf6', // violet-500
  info: '#3b82f6', // blue-500
  success: '#10b981', // green-500
};

export const Dashboard: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState<'students' | 'engagement' | 'performance' | 'licenses'>('engagement');
  const [showInsights, setShowInsights] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedTab, setSelectedTab] = useState('overview');
  const districtId = 'SD-12345'; // In production, get from auth context

  // Fetch district data from API with real-time updates
  const { data: districtData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['district-overview', districtId],
    queryFn: async () => {
      const data = await fetchDistrictOverview(districtId);
      setLastRefresh(new Date());
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for live updates
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-coral-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading district data...</p>
        </div>
      </div>
    );
  }

  if (error || !districtData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Failed to load district data</p>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Using demo/cached data'}</p>
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

  // Use districtData from API
  const mockDistrictData = districtData; // Keep variable name for backwards compatibility

  const pieColors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.info, COLORS.success];

  // Helper function to get trend icon and color
  const getTrendIndicator = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' };
    if (trend === 'down') return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' };
    return { icon: Minus, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  // Helper function to format export
  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting dashboard data as ${format.toUpperCase()}`);
    // In production, this would trigger actual export
    const data = {
      district: districtData?.districtName,
      exportDate: new Date().toISOString(),
      timeRange: selectedTimeRange,
      format,
      stats: {
        schools: districtData?.totalSchools,
        teachers: districtData?.activeTeachers,
        students: districtData?.totalStudents,
        licenseUtilization: districtData?.licenseUtilization,
      }
    };
    
    // Simulate download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${format}-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Dashboard data exported as ${format.toUpperCase()}`);
  };

  // Helper to get priority badge
  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  const stats = [
    {
      label: 'Total Schools',
      value: districtData?.totalSchools || 0,
      icon: School,
      color: 'blue',
      change: '+2 this year',
      trend: (districtData?.keyMetricsTrends?.studentGrowth?.trend || 'stable') as 'up' | 'down' | 'stable',
      changeValue: '+13.3%',
      link: '/schools'
    },
    {
      label: 'Active Teachers',
      value: districtData?.activeTeachers || 0,
      icon: Users,
      color: 'green',
      change: '+15% this semester',
      trend: (districtData?.keyMetricsTrends?.teacherRetention?.trend || 'up') as 'up' | 'down' | 'stable',
      changeValue: '+15%',
      link: '/teachers'
    },
    {
      label: 'Students Enrolled',
      value: districtData?.totalStudents?.toLocaleString() || 0,
      icon: Award,
      color: 'purple',
      change: '+523 this month',
      trend: 'up' as const,
      changeValue: '+12.2%',
      link: '/analytics'
    },
    {
      label: 'License Utilization',
      value: `${districtData?.licenseUtilization || 0}%`,
      icon: CreditCard,
      color: 'orange',
      change: districtData?.licensesRemaining + ' seats available',
      trend: (districtData?.keyMetricsTrends?.licenseEfficiency?.trend || 'stable') as 'up' | 'down' | 'stable',
      changeValue: '87%',
      link: '/licenses'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with AIVO Branding */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {districtData?.districtName}
                </h1>
                <div className="flex items-center gap-3 text-purple-100">
                  <p>
                    District ID: {districtData?.districtId}
                  </p>
                  <span>•</span>
                  <p>{new Date().toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>Updated {lastRefresh.toLocaleTimeString()}</span>
                    {isFetching && (
                      <RefreshCw className="w-3 h-3 animate-spin ml-1" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-1">
                {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeRange === range
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => void refetch()}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white rounded-xl transition-all disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Export Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <Link
                to="/licenses/purchase"
                className="flex items-center gap-2 px-6 py-2 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Purchase Licenses</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Critical Alerts */}
        {districtData?.criticalAlerts && districtData.criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">System Alerts</h3>
                  <div className="space-y-2">
                    {districtData.criticalAlerts.map((alert: any, index: number) => (
                      <div key={index} className="text-sm text-yellow-800">
                        <span className="font-medium">[{alert.severity.toUpperCase()}]</span> {alert.message}
                        <span className="text-yellow-600 ml-2">• {alert.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid with AIVO Branding & Trends */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const gradients = [
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600',
              'from-purple-600 to-pink-600',
              'from-pink-600 to-purple-600',
            ];
            const TrendIcon = getTrendIndicator(stat.trend).icon;
            const trendColor = getTrendIndicator(stat.trend).color;
            const trendBg = getTrendIndicator(stat.trend).bg;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={stat.link}>
                  <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-200 relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 ${trendBg} rounded-lg`}>
                          <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                          <span className={`text-xs font-semibold ${trendColor}`}>
                            {stat.changeValue}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          {stat.change}
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Teacher & Student Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Teacher Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Teacher Overview</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Active</p>
                <p className="text-2xl font-bold text-gray-900">{districtData?.teacherMetrics?.totalActive}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                <p className="text-2xl font-bold text-green-600">{districtData?.teacherMetrics?.retention}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Prof. Development</p>
                <p className="text-2xl font-bold text-blue-600">{districtData?.teacherMetrics?.professionalDevelopment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Class Size</p>
                <p className="text-2xl font-bold text-gray-900">{districtData?.teacherMetrics?.averageClassSize}</p>
              </div>
            </div>
          </motion.div>

          {/* Student Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Student Insights</h2>
              <GraduationCap className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{districtData?.studentInsights?.totalEnrolled.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">IEP Students</p>
                <p className="text-2xl font-bold text-purple-600">{districtData?.studentInsights?.iepStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Grade Levels</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(districtData?.studentInsights?.gradeLevels || {}).length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Demographics</p>
                <p className="text-sm text-gray-700">
                  {districtData?.studentInsights?.demographics?.hispanic}% Hisp • {districtData?.studentInsights?.demographics?.black}% Black
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI-Powered Insights */}
        {showInsights && districtData?.predictiveInsights && districtData.predictiveInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
                      <p className="text-purple-100 text-sm">Predictive analytics and recommendations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInsights(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {districtData.predictiveInsights.slice(0, 3).map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityBadge(insight.priority)}`}>
                          {insight.priority.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-purple-100">
                          <Target className="w-3 h-3" />
                          {insight.confidence}% confidence
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 text-white">{insight.title}</h3>
                      <p className="text-sm text-purple-100 mb-3">{insight.message}</p>
                      <div className="pt-3 border-t border-white/20">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-purple-200 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-purple-100">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Benchmarking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Performance Benchmarks</h2>
              <p className="text-sm text-gray-600">Compare your district against state and national averages</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium">
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{districtData?.benchmarks?.districtAverage}</span>
              </div>
              <p className="font-semibold text-gray-900">Your District</p>
              <p className="text-xs text-gray-500">Average Score</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{districtData?.benchmarks?.stateAverage}</span>
              </div>
              <p className="font-semibold text-gray-900">State Avg</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +8.5%
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">{districtData?.benchmarks?.nationalAverage}</span>
              </div>
              <p className="font-semibold text-gray-900">National Avg</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +14.1%
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">{districtData?.benchmarks?.topPerformer}</span>
              </div>
              <p className="font-semibold text-gray-900">Top Performer</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Target className="w-3 h-3" />
                Goal
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* License Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  License Distribution
                </h2>
                <Link to="/licenses" className="text-primary-500 hover:underline text-sm flex items-center gap-1">
                  Manage Licenses <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {districtData?.licenseDistribution?.map((school: any) => (
                  <div key={school.school} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{school.school}</span>
                        <span className="text-sm text-gray-500">{school.used} / {school.allocated}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (school.used / school.allocated) > 0.9 ? 'bg-red-500' :
                            (school.used / school.allocated) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(school.used / school.allocated) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Critical Alert */}
              {districtData?.licensesRemaining && districtData.licensesRemaining < 150 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Low License Availability</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Only {districtData.licensesRemaining} licenses remaining. Consider purchasing additional seats.
                      </p>
                      <Link to="/licenses/purchase">
                        <button className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors">
                          Purchase More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* School Performance with Real Charts */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Performance Trends</h2>
                  <p className="text-sm text-gray-600">Track key metrics over time</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as typeof selectedMetric)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="performance">Performance</option>
                    <option value="students">Students</option>
                    <option value="licenses">Licenses</option>
                  </select>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={districtData?.performanceTrends}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    fill="url(#colorMetric)"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={COLORS.secondary}
                    strokeWidth={2}
                    dot={{ fill: COLORS.secondary, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {(['students', 'engagement', 'performance', 'licenses'] as const).map((metric) => {
                  const current = districtData?.performanceTrends?.[districtData.performanceTrends.length - 1]?.[metric] || 0;
                  const previous = districtData?.performanceTrends?.[districtData.performanceTrends.length - 2]?.[metric] || 0;
                  const change = previous ? (((current - previous) / previous) * 100).toFixed(1) : '0';
                  const isPositive = Number(change) >= 0;
                  
                  return (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`p-3 rounded-xl transition-all ${
                        selectedMetric === metric
                          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
                          : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </p>
                      <p className="text-lg font-bold text-gray-900">{current?.toLocaleString()}</p>
                      <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(Number(change))}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Engagement by School - Horizontal Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">School Engagement</h2>
                  <p className="text-sm text-gray-600">Comparative performance across schools</p>
                </div>
                <Link to="/schools" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={districtData?.engagementBySchool}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120}
                    stroke="#9ca3af"
                    style={{ fontSize: '11px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Engagement']}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 8, 8, 0]}
                  >
                    {districtData?.engagementBySchool?.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Breakdown - Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Budget Allocation</h2>
                  <p className="text-sm text-gray-600">${districtData?.budget?.total?.toLocaleString()} annual budget</p>
                </div>
                <Link to="/billing" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                  View Billing <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={districtData?.budgetBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {districtData?.budgetBreakdown?.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {districtData?.budgetBreakdown?.map((item, index) => {
                    const total = districtData.budgetBreakdown?.reduce((sum, i) => sum + i.value, 0) || 1;
                    const percent = ((item.value / total) * 100).toFixed(1);
                    return (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                          />
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${(item.value / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-gray-500">{percent}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Schools */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Top Performing Schools
                </h2>
                <Link to="/schools" className="text-primary-500 hover:underline text-sm flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {districtData?.topSchools?.map((school: any, index: number) => (
                  <Link 
                    key={school.id}
                    to={`/schools/${school.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                          ${index === 0 ? 'bg-yellow-500' : ''}
                          ${index === 1 ? 'bg-gray-400' : ''}
                          ${index === 2 ? 'bg-orange-600' : ''}
                          ${index > 2 ? 'bg-primary-500' : ''}
                        `}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{school.name}</p>
                          <p className="text-sm text-gray-500">
                            {school.studentCount} students • {school.teacherCount} teachers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{school.avgProgress}%</p>
                        <p className="text-sm text-gray-500">Avg. Progress</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {districtData?.recentActivity?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${activity.type === 'enrollment' ? 'bg-green-100' : ''}
                      ${activity.type === 'license' ? 'bg-blue-100' : ''}
                      ${activity.type === 'compliance' ? 'bg-purple-100' : ''}
                    `}>
                      {activity.type === 'enrollment' && <Users className="w-4 h-4 text-green-600" />}
                      {activity.type === 'license' && <CreditCard className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'compliance' && <Shield className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
              </div>
              <div className="text-center py-4 mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-3">
                  <span className="text-2xl font-bold text-green-600">{districtData?.compliance?.score}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">{districtData?.compliance?.status}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Last audit: {new Date(districtData?.compliance?.lastAudit || '').toLocaleDateString()}
                </p>
              </div>
              
              {/* Detailed Compliance Checks */}
              <div className="space-y-3 mb-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {districtData?.compliance?.ferpa?.status === 'compliant' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">FERPA</span>
                  </div>
                  <span className="text-xs text-gray-500">{districtData?.compliance?.ferpa?.lastCheck}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {districtData?.compliance?.coppa?.status === 'compliant' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">COPPA</span>
                  </div>
                  <span className="text-xs text-gray-500">{districtData?.compliance?.coppa?.lastCheck}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {districtData?.compliance?.statePrivacy?.status === 'compliant' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">State Privacy</span>
                  </div>
                  <span className="text-xs text-gray-500">{districtData?.compliance?.statePrivacy?.lastCheck}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Data Encryption</span>
                  </div>
                  <span className="text-xs text-gray-500">{districtData?.compliance?.dataEncryption}%</span>
                </div>
              </div>
              
              <Link to="/analytics/compliance">
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                  View Full Report
                </button>
              </Link>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Budget Overview
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Annual Budget</span>
                    <span className="font-medium">${districtData?.budget?.total?.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-medium">${districtData?.budget?.spent?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${((districtData?.budget?.spent ?? 0) / (districtData?.budget?.total ?? 1)) * 100}%` }} 
                    />
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-bold text-green-600">
                      ${((districtData?.budget?.total ?? 0) - (districtData?.budget?.spent ?? 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/billing">
                <button className="w-full px-4 py-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                  View Billing Details
                </button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/schools/add">
                  <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl text-left transition-all">
                    <div className="flex items-center gap-3">
                      <School className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-800">Add School</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/analytics/usage">
                  <button className="w-full p-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl text-left transition-all">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-800">View Analytics</span>
                    </div>
                  </button>
                </Link>
                
                <Link to="/analytics/compliance">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl text-left transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">Compliance Report</span>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Enterprise Support
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Direct line to your dedicated success manager
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <strong>Manager:</strong> {districtData?.supportManager?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {districtData?.supportManager?.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {districtData?.supportManager?.phone}
                </p>
              </div>
              <button 
                onClick={() => window.open('https://calendly.com/aivo-support', '_blank')}
                className="w-full px-4 py-2 mt-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

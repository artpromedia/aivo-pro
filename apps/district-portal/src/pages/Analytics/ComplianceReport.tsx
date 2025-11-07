import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Clock,
  User,
  FileCheck
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
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock compliance data
const mockComplianceData = {
  summary: {
    complianceScore: 96,
    totalAudits: 1247,
    violations: 3,
    pendingConsents: 12
  },
  auditLog: [
    { id: 1, date: '2024-01-15 10:23 AM', user: 'Sarah Johnson', action: 'Viewed Student Record', resource: 'Emma Johnson - IEP', status: 'Approved' },
    { id: 2, date: '2024-01-15 09:45 AM', user: 'Michael Chen', action: 'Downloaded Report', resource: 'School Performance Data', status: 'Approved' },
    { id: 3, date: '2024-01-15 09:12 AM', user: 'Lisa Brown', action: 'Modified IEP', resource: 'Jacob Smith - IEP', status: 'Approved' },
    { id: 4, date: '2024-01-14 03:34 PM', user: 'Admin User', action: 'Exported Data', resource: 'Student Database', status: 'Flagged' },
    { id: 5, date: '2024-01-14 02:15 PM', user: 'John Davis', action: 'Viewed Student Record', resource: 'Multiple Students', status: 'Approved' },
    { id: 6, date: '2024-01-14 01:22 PM', user: 'Emily Wilson', action: 'Updated Grades', resource: 'Grade 5 Class', status: 'Approved' },
    { id: 7, date: '2024-01-14 11:45 AM', user: 'Robert Martinez', action: 'Accessed Medical Records', resource: 'Student Health Data', status: 'Flagged' },
    { id: 8, date: '2024-01-13 04:12 PM', user: 'Sarah Johnson', action: 'Viewed Attendance', resource: 'Lincoln Elementary', status: 'Approved' }
  ],
  accessTrend: [
    { date: 'Jan 9', total: 145, authorized: 142, flagged: 3 },
    { date: 'Jan 10', total: 167, authorized: 164, flagged: 3 },
    { date: 'Jan 11', total: 189, authorized: 187, flagged: 2 },
    { date: 'Jan 12', total: 156, authorized: 153, flagged: 3 },
    { date: 'Jan 13', total: 178, authorized: 176, flagged: 2 },
    { date: 'Jan 14', total: 203, authorized: 199, flagged: 4 },
    { date: 'Jan 15', total: 209, authorized: 208, flagged: 1 }
  ],
  consentStatus: [
    { name: 'Approved', value: 1847, color: '#10b981' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Expired', value: 8, color: '#ef4444' },
    { name: 'Revoked', value: 3, color: '#6b7280' }
  ],
  violationTypes: [
    { type: 'Unauthorized Access', count: 2, severity: 'High' },
    { type: 'Missing Consent', count: 8, severity: 'Medium' },
    { type: 'Data Export Without Approval', count: 1, severity: 'High' },
    { type: 'Expired Permissions', count: 5, severity: 'Low' }
  ],
  complianceMetrics: [
    { category: 'FERPA', score: 98 },
    { category: 'COPPA', score: 96 },
    { category: 'IDEA', score: 94 },
    { category: 'ADA', score: 97 },
    { category: 'HIPAA', score: 95 }
  ]
};

export const ComplianceReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAuditLog = mockComplianceData.auditLog.filter(entry => {
    const matchesSearch = 
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Approved') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">Approved</span>;
    }
    return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg">Flagged</span>;
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-orange-100 text-orange-700',
      Low: 'bg-yellow-100 text-yellow-700'
    };
    return <span className={`px-2 py-1 ${colors[severity as keyof typeof colors]} text-xs font-medium rounded-lg`}>{severity}</span>;
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
              <h1 className="text-3xl font-bold mb-2">Compliance Analytics</h1>
              <p className="text-purple-100">FERPA audits, data access logs, and consent management</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <Download className="w-5 h-5" />
                Export Audit Log
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
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">{mockComplianceData.summary.complianceScore}%</p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium">Excellent standing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Access Logs</p>
            <p className="text-2xl font-bold text-gray-900">{mockComplianceData.summary.totalAudits.toLocaleString()}</p>
            <p className="text-sm text-blue-600 font-medium">Last 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Active Violations</p>
            <p className="text-2xl font-bold text-gray-900">{mockComplianceData.summary.violations}</p>
            <p className="text-sm text-orange-600 font-medium">Requires attention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-600">Pending Consents</p>
            <p className="text-2xl font-bold text-gray-900">{mockComplianceData.summary.pendingConsents}</p>
            <p className="text-sm text-yellow-600 font-medium">Awaiting approval</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Access Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                Data Access Activity Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockComplianceData.accessTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2} name="Total Access" />
                  <Line type="monotone" dataKey="authorized" stroke="#10b981" strokeWidth={2} name="Authorized" />
                  <Line type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} name="Flagged" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Compliance Metrics by Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Compliance Metrics by Regulation
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockComplianceData.complianceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]} name="Compliance Score %" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {mockComplianceData.complianceMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-xs text-gray-600 mb-1">{metric.category}</p>
                    <p className="text-lg font-bold text-purple-600">{metric.score}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-gray-700" />
                  Recent Audit Log
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search audit log..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Resource</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLog.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">{entry.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{entry.user}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{entry.action}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{entry.resource}</td>
                        <td className="py-3 px-4">{getStatusBadge(entry.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                Showing {filteredAuditLog.length} of {mockComplianceData.auditLog.length} entries
              </div>
            </div>
          </div>

          {/* Right Column - Status & Violations */}
          <div className="space-y-6">
            {/* Consent Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-green-600" />
                Consent Status
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={mockComplianceData.consentStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockComplianceData.consentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {mockComplianceData.consentStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Violations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Active Violations
              </h2>
              <div className="space-y-3">
                {mockComplianceData.violationTypes.map((violation, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{violation.type}</p>
                      {getSeverityBadge(violation.severity)}
                    </div>
                    <p className="text-sm text-gray-600">{violation.count} occurrence{violation.count > 1 ? 's' : ''}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Actions */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Recommended Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Review Flagged Access</p>
                  <p className="text-xs text-gray-600">4 entries need review</p>
                </button>
                <button className="w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Update Expired Consents</p>
                  <p className="text-xs text-gray-600">8 consents have expired</p>
                </button>
                <button className="w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Generate Compliance Report</p>
                  <p className="text-xs text-gray-600">For board review</p>
                </button>
                <button className="w-full p-3 bg-white rounded-xl hover:shadow-md transition-all text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Schedule FERPA Training</p>
                  <p className="text-xs text-gray-600">For new staff members</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

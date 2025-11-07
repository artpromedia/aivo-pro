import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Edit,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

interface IEPDocument {
  id: string;
  studentId: string;
  studentName: string;
  school: string;
  grade: number;
  status: 'active' | 'due-review' | 'draft' | 'expired';
  createdDate: string;
  reviewDate: string;
  nextReviewDate: string;
  goalsTotal: number;
  goalsMet: number;
  compliance: 'compliant' | 'needs-attention' | 'at-risk';
  caseManager: string;
}

// Mock IEP data
const mockIEPs: IEPDocument[] = [
  {
    id: 'IEP-001',
    studentId: 'STU-001',
    studentName: 'Emma Johnson',
    school: 'Lincoln Elementary',
    grade: 5,
    status: 'active',
    createdDate: '2024-01-15',
    reviewDate: '2024-10-15',
    nextReviewDate: '2025-04-15',
    goalsTotal: 6,
    goalsMet: 5,
    compliance: 'compliant',
    caseManager: 'Dr. Sarah Williams'
  },
  {
    id: 'IEP-003',
    studentId: 'STU-003',
    studentName: 'Sophia Rodriguez',
    school: 'Roosevelt High',
    grade: 11,
    status: 'due-review',
    createdDate: '2023-08-20',
    reviewDate: '2024-08-20',
    nextReviewDate: '2024-11-20',
    goalsTotal: 8,
    goalsMet: 6,
    compliance: 'needs-attention',
    caseManager: 'Ms. Jennifer Davis'
  },
  {
    id: 'IEP-005',
    studentId: 'STU-005',
    studentName: 'Olivia Martinez',
    school: 'Washington Middle',
    grade: 7,
    status: 'active',
    createdDate: '2023-09-10',
    reviewDate: '2024-09-10',
    nextReviewDate: '2025-03-10',
    goalsTotal: 7,
    goalsMet: 5,
    compliance: 'compliant',
    caseManager: 'Mr. Robert Johnson'
  }
];

export const IEPs: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCompliance, setFilterCompliance] = useState<string>('all');

  const { data: iepsData, isLoading } = useQuery({
    queryKey: ['district-ieps', searchQuery, filterStatus, filterCompliance],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = mockIEPs;
      
      if (searchQuery) {
        filtered = filtered.filter(iep => 
          iep.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          iep.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (filterStatus !== 'all') {
        filtered = filtered.filter(iep => iep.status === filterStatus);
      }
      
      if (filterCompliance !== 'all') {
        filtered = filtered.filter(iep => iep.compliance === filterCompliance);
      }
      
      return {
        ieps: filtered,
        stats: {
          totalActive: mockIEPs.filter(i => i.status === 'active').length,
          dueForReview: mockIEPs.filter(i => i.status === 'due-review').length,
          avgGoalsMet: 78,
          complianceRate: 95
        }
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'due-review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'text-green-600';
      case 'needs-attention': return 'text-yellow-600';
      case 'at-risk': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'needs-attention': return <Clock className="w-4 h-4" />;
      case 'at-risk': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-7 h-7 text-purple-600" />
                IEP Management
              </h1>
              <p className="text-gray-600">
                Manage and track all Individualized Education Programs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => void alert('Exporting IEP data...')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <Link
                to="/ieps/create"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New IEP
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{iepsData?.stats.totalActive || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Active IEPs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">{iepsData?.stats.dueForReview || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Due for Review</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{iepsData?.stats.avgGoalsMet || 0}%</span>
            </div>
            <p className="text-sm text-gray-600">Avg. Goals Met</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{iepsData?.stats.complianceRate || 0}%</span>
            </div>
            <p className="text-sm text-gray-600">Compliance Rate</p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name or IEP ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="due-review">Due for Review</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Compliance Filter */}
            <div>
              <select
                value={filterCompliance}
                onChange={(e) => setFilterCompliance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Compliance</option>
                <option value="compliant">Compliant</option>
                <option value="needs-attention">Needs Attention</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* IEP Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IEP ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goals Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : iepsData?.ieps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No IEPs found matching your criteria
                    </td>
                  </tr>
                ) : (
                  iepsData?.ieps.map((iep: IEPDocument) => (
                    <tr key={iep.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{iep.studentName}</div>
                          <div className="text-sm text-gray-500">{iep.school} • Grade {iep.grade}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{iep.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(iep.status)}`}>
                          {iep.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(iep.goalsMet / iep.goalsTotal) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{iep.goalsMet}/{iep.goalsTotal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(iep.nextReviewDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil((new Date(iep.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 ${getComplianceColor(iep.compliance)}`}>
                          {getComplianceIcon(iep.compliance)}
                          <span className="text-sm capitalize">{iep.compliance.replace('-', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{iep.caseManager}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/ieps/${iep.id}`)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View IEP"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/ieps/${iep.id}/edit`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit IEP"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Upcoming Reviews (Next 30 Days)
          </h2>
          <div className="space-y-3">
            {iepsData?.ieps
              .filter(iep => {
                const daysUntilReview = Math.ceil((new Date(iep.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return daysUntilReview <= 30 && daysUntilReview >= 0;
              })
              .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
              .map(iep => {
                const daysUntil = Math.ceil((new Date(iep.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={iep.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        daysUntil <= 7 ? 'bg-red-100' : 
                        daysUntil <= 14 ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <span className={`text-lg font-bold ${
                          daysUntil <= 7 ? 'text-red-700' :
                          daysUntil <= 14 ? 'text-yellow-700' : 'text-blue-700'
                        }`}>
                          {daysUntil}d
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{iep.studentName}</p>
                        <p className="text-sm text-gray-500">{iep.school} • {iep.caseManager}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(iep.nextReviewDate).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => navigate(`/ieps/${iep.id}`)}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            {(!iepsData?.ieps || iepsData.ieps.filter(iep => {
              const daysUntilReview = Math.ceil((new Date(iep.nextReviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return daysUntilReview <= 30 && daysUntilReview >= 0;
            }).length === 0) && (
              <p className="text-center text-gray-500 py-4">No reviews scheduled in the next 30 days</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

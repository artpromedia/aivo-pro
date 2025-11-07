import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  School,
  GraduationCap,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  MoreVertical,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Mock seats data
const mockSeatsData = [
  {
    id: 'SEAT-001',
    licenseType: 'AIVO Learning Pro',
    assignedTo: 'Emma Johnson',
    role: 'Student',
    email: 'emma.j@student.school.edu',
    school: 'Lincoln Elementary',
    grade: '5th',
    assignedDate: '2024-09-15',
    lastActive: '2025-11-05',
    status: 'Active',
    usage: 92
  },
  {
    id: 'SEAT-002',
    licenseType: 'AIVO Learning Pro',
    assignedTo: 'Sarah Smith',
    role: 'Teacher',
    email: 'sarah.smith@school.edu',
    school: 'Lincoln Elementary',
    grade: 'Multiple',
    assignedDate: '2024-08-10',
    lastActive: '2025-11-06',
    status: 'Active',
    usage: 88
  },
  {
    id: 'SEAT-003',
    licenseType: 'AIVO Learning Pro',
    assignedTo: 'Michael Chen',
    role: 'Student',
    email: 'michael.c@student.school.edu',
    school: 'Washington Middle School',
    grade: '7th',
    assignedDate: '2024-09-01',
    lastActive: '2025-11-04',
    status: 'Active',
    usage: 76
  },
  {
    id: 'SEAT-004',
    licenseType: 'AIVO Teacher Edition',
    assignedTo: 'John Davis',
    role: 'Teacher',
    email: 'john.davis@school.edu',
    school: 'Roosevelt High School',
    grade: 'Multiple',
    assignedDate: '2024-07-15',
    lastActive: '2025-10-30',
    status: 'Inactive',
    usage: 12
  },
  {
    id: 'SEAT-005',
    licenseType: 'AIVO Learning Pro',
    assignedTo: null,
    role: null,
    email: null,
    school: null,
    grade: null,
    assignedDate: null,
    lastActive: null,
    status: 'Available',
    usage: 0
  }
];

const mockLicenseSummary = {
  total: 150,
  assigned: 145,
  available: 5,
  active: 138,
  inactive: 7,
  utilization: 95
};

export const ManageSeats: React.FC = () => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(mockSeatsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'available'>('all');
  const [showFilters, setShowFilters] = useState(false);
  // @ts-expect-error - Modal to be implemented
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<typeof mockSeatsData[0] | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Filter seats
  const filteredSeats = seats.filter(seat => {
    const matchesSearch = !searchQuery || 
      seat.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seat.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seat.school?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || 
      seat.role?.toLowerCase() === filterRole;
    
    const matchesStatus = filterStatus === 'all' || 
      seat.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAssignSeat = (seat: typeof mockSeatsData[0]) => {
    setSelectedSeat(seat);
    setShowAssignModal(true);
  };

  const handleUnassignSeat = (seat: typeof mockSeatsData[0]) => {
    setSelectedSeat(seat);
    setShowUnassignModal(true);
  };

  const confirmUnassign = () => {
    if (selectedSeat) {
      setSeats(seats.map(s => 
        s.id === selectedSeat.id 
          ? { ...s, assignedTo: null, role: null, email: null, school: null, grade: null, assignedDate: null, lastActive: null, status: 'Available', usage: 0 }
          : s
      ));
      setShowUnassignModal(false);
      setSelectedSeat(null);
    }
  };

  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-yellow-100 text-yellow-700';
      case 'available': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-green-600';
    if (usage >= 50) return 'text-yellow-600';
    if (usage > 0) return 'text-orange-600';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/licenses')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Licenses
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage License Seats</h1>
              <p className="text-purple-100">Allocate and track individual license assignments</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBulkMode(!bulkMode)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold ${
                  bulkMode 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
                }`}
              >
                <Users className="w-5 h-5" />
                {bulkMode ? 'Exit Bulk Mode' : 'Bulk Actions'}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Upload className="w-5 h-5" />
                Import
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg">
                <UserPlus className="w-5 h-5" />
                Assign Seat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Seats</p>
                <p className="text-2xl font-bold text-gray-900">{mockLicenseSummary.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{mockLicenseSummary.assigned}</p>
            <p className="text-sm text-blue-600 font-medium">{Math.round((mockLicenseSummary.assigned / mockLicenseSummary.total) * 100)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-gray-900">{mockLicenseSummary.active}</p>
            <p className="text-sm text-green-600 font-medium">{mockLicenseSummary.utilization}% Utilization</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-gray-900">{mockLicenseSummary.inactive}</p>
            <p className="text-sm text-yellow-600 font-medium">Need Attention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <UserPlus className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold text-gray-900">{mockLicenseSummary.available}</p>
            <p className="text-sm text-pink-600 font-medium">Ready to Assign</p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filterRole !== 'all' || filterStatus !== 'all') && (
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              )}
            </button>

            <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="available">Available</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {bulkMode && selectedSeats.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="flex items-center gap-6">
                <p className="font-semibold">{selectedSeats.length} seats selected</p>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  Bulk Unassign
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  Send Notification
                </button>
                <button 
                  onClick={() => setSelectedSeats([])}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seats Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  {bulkMode && (
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-purple-600 rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSeats(filteredSeats.map(s => s.id));
                          } else {
                            setSelectedSeats([]);
                          }
                        }}
                      />
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">School</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">License Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSeats.map((seat) => (
                  <tr key={seat.id} className="hover:bg-gray-50 transition-colors">
                    {bulkMode && (
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          checked={selectedSeats.includes(seat.id)}
                          onChange={() => toggleSeatSelection(seat.id)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {seat.assignedTo ? (
                        <div>
                          <p className="font-semibold text-gray-900">{seat.assignedTo}</p>
                          <p className="text-sm text-gray-600">{seat.email}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Unassigned</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {seat.role ? (
                        <div className="flex items-center gap-2">
                          {seat.role === 'Teacher' ? (
                            <GraduationCap className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Users className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-gray-900">{seat.role}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {seat.school ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{seat.school}</span>
                          </div>
                          {seat.grade && <p className="text-sm text-gray-600 ml-6">Grade {seat.grade}</p>}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{seat.licenseType}</span>
                    </td>
                    <td className="px-6 py-4">
                      {seat.assignedDate ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(seat.assignedDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {seat.lastActive ? (
                        <span className="text-sm text-gray-600">{new Date(seat.lastActive).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              seat.usage >= 80 ? 'bg-green-500' :
                              seat.usage >= 50 ? 'bg-yellow-500' :
                              seat.usage > 0 ? 'bg-orange-500' :
                              'bg-gray-300'
                            }`}
                            style={{ width: `${seat.usage}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getUsageColor(seat.usage)}`}>
                          {seat.usage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(seat.status)}`}>
                        {seat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {seat.status === 'Available' ? (
                          <button 
                            onClick={() => handleAssignSeat(seat)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Assign Seat"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Send Email">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUnassignSeat(seat)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Unassign"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSeats.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No seats found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <p>Showing {filteredSeats.length} of {seats.length} seats</p>
          <p>{mockLicenseSummary.utilization}% overall utilization</p>
        </div>
      </div>

      {/* Unassign Confirmation Modal */}
      <AnimatePresence>
        {showUnassignModal && selectedSeat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowUnassignModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-50"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Unassign Seat?</h2>
                <p className="text-gray-600">
                  Are you sure you want to unassign this seat from <strong>{selectedSeat.assignedTo}</strong>? 
                  They will lose access to their AIVO license immediately.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnassignModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnassign}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Unassign
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

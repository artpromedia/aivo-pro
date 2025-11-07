import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Brain, 
  FileText,
  ChevronDown,
  Activity,
  Calendar,
  BookOpen,
  Target,
  X,
  Users
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

interface StudentFilters {
  schoolId?: string;
  gradeLevel?: number[];
  hasIEP?: boolean;
  performanceRange?: [number, number];
  enrollmentStatus?: 'active' | 'inactive' | 'all';
  specialPrograms?: string[];
  searchQuery?: string;
}

interface Student {
  id: string;
  name: string;
  grade: number;
  school: string;
  schoolId: string;
  hasIEP: boolean;
  iepId?: string;
  performanceScore: number;
  lastActive: string;
  aiModelStatus: 'active' | 'training' | 'inactive';
  parentEmail: string;
  teacherName: string;
  enrollmentDate: string;
  specialPrograms: string[];
  averageGrade: number;
  attendanceRate: number;
  avatar?: string;
}

// Mock data for development
const mockStudentsData = {
  total: 4823,
  currentPage: 0,
  totalPages: 97,
  startIndex: 1,
  endIndex: 50,
  students: [
    {
      id: 'STU-001',
      name: 'Emma Johnson',
      grade: 5,
      school: 'Lincoln Elementary',
      schoolId: 'SCH-001',
      hasIEP: true,
      iepId: 'IEP-001',
      performanceScore: 85,
      lastActive: '2 hours ago',
      aiModelStatus: 'active' as const,
      parentEmail: 'parent@example.com',
      teacherName: 'Mrs. Smith',
      enrollmentDate: '2023-08-15',
      specialPrograms: ['Gifted', 'ESL'],
      averageGrade: 88,
      attendanceRate: 96
    },
    {
      id: 'STU-002',
      name: 'Michael Chen',
      grade: 8,
      school: 'Washington Middle',
      schoolId: 'SCH-002',
      hasIEP: false,
      performanceScore: 92,
      lastActive: '1 day ago',
      aiModelStatus: 'active' as const,
      parentEmail: 'chen@example.com',
      teacherName: 'Mr. Johnson',
      enrollmentDate: '2020-08-20',
      specialPrograms: ['Advanced Math'],
      averageGrade: 94,
      attendanceRate: 98
    },
    {
      id: 'STU-003',
      name: 'Sophia Rodriguez',
      grade: 11,
      school: 'Roosevelt High',
      schoolId: 'SCH-003',
      hasIEP: true,
      iepId: 'IEP-003',
      performanceScore: 78,
      lastActive: '3 hours ago',
      aiModelStatus: 'training' as const,
      parentEmail: 'rodriguez@example.com',
      teacherName: 'Dr. Williams',
      enrollmentDate: '2021-08-18',
      specialPrograms: ['IEP'],
      averageGrade: 81,
      attendanceRate: 92
    },
    {
      id: 'STU-004',
      name: 'James Anderson',
      grade: 3,
      school: 'Lincoln Elementary',
      schoolId: 'SCH-001',
      hasIEP: false,
      performanceScore: 88,
      lastActive: '5 hours ago',
      aiModelStatus: 'active' as const,
      parentEmail: 'anderson@example.com',
      teacherName: 'Ms. Davis',
      enrollmentDate: '2022-08-16',
      specialPrograms: [],
      averageGrade: 87,
      attendanceRate: 95
    },
    {
      id: 'STU-005',
      name: 'Olivia Martinez',
      grade: 7,
      school: 'Washington Middle',
      schoolId: 'SCH-002',
      hasIEP: true,
      iepId: 'IEP-005',
      performanceScore: 82,
      lastActive: '1 hour ago',
      aiModelStatus: 'active' as const,
      parentEmail: 'martinez@example.com',
      teacherName: 'Mrs. Brown',
      enrollmentDate: '2019-08-19',
      specialPrograms: ['IEP', 'Reading Support'],
      averageGrade: 84,
      attendanceRate: 94
    }
  ]
};

const mockSchools = [
  { id: 'SCH-001', name: 'Lincoln Elementary' },
  { id: 'SCH-002', name: 'Washington Middle' },
  { id: 'SCH-003', name: 'Roosevelt High' },
  { id: 'SCH-004', name: 'Jefferson Elementary' }
];

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StudentFilters>({
    enrollmentStatus: 'active'
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const debouncedSearch = useDebounce(searchInput, 300);

  // Fetch schools for filter dropdown
  const { data: schools } = useQuery({
    queryKey: ['district-schools'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSchools;
    },
  });

  // Fetch students with filters
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['district-students', { ...filters, searchQuery: debouncedSearch }],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Filter mock data based on search and filters
      let filtered = mockStudentsData.students;
      
      if (debouncedSearch) {
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.id.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      
      if (filters.schoolId) {
        filtered = filtered.filter(s => s.schoolId === filters.schoolId);
      }
      
      if (filters.hasIEP !== undefined) {
        filtered = filtered.filter(s => s.hasIEP === filters.hasIEP);
      }
      
      return {
        ...mockStudentsData,
        students: filtered,
        total: filtered.length
      };
    },
  });

  const handleFilterChange = (key: keyof StudentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ enrollmentStatus: 'active' });
    setSearchInput('');
  };

  const exportData = () => {
    void alert('Exporting student data...');
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== undefined && v !== 'active').length + 
           (searchInput ? 1 : 0);
  }, [filters, searchInput]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-600" />
                Student Directory
              </h1>
              <p className="text-gray-600">
                Search and manage all students across the district
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Bar and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6 mt-6 border-t">
                  {/* School Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                    <select
                      value={filters.schoolId || ''}
                      onChange={(e) => handleFilterChange('schoolId', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Schools</option>
                      {schools?.map((school: any) => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Grades</option>
                      {[...Array(13)].map((_, i) => (
                        <option key={i} value={i}>{i === 0 ? 'K' : i}</option>
                      ))}
                    </select>
                  </div>

                  {/* IEP Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IEP Status</label>
                    <select
                      value={filters.hasIEP === undefined ? '' : filters.hasIEP.toString()}
                      onChange={(e) => handleFilterChange('hasIEP', e.target.value === '' ? undefined : e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Students</option>
                      <option value="true">Has IEP</option>
                      <option value="false">No IEP</option>
                    </select>
                  </div>

                  {/* Enrollment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.enrollmentStatus || 'active'}
                      onChange={(e) => handleFilterChange('enrollmentStatus', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{studentsData?.total || 0}</span> students
          {activeFilterCount > 0 && ' with applied filters'}
        </div>

        {/* Student Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : studentsData?.students?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No students found matching your criteria
                    </td>
                  </tr>
                ) : (
                  studentsData?.students?.map((student: Student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                            alt={student.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.school}</div>
                        <div className="text-sm text-gray-500">{student.teacherName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">Grade {student.grade}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                student.performanceScore >= 80 ? 'bg-green-500' :
                                student.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.performanceScore}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{student.performanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.aiModelStatus === 'active' ? 'bg-green-100 text-green-800' :
                          student.aiModelStatus === 'training' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.aiModelStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {student.hasIEP && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">IEP</span>
                          )}
                          {student.specialPrograms?.map(program => (
                            <span key={program} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {program}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {student.hasIEP && (
                            <button
                              onClick={() => navigate(`/ieps/${student.iepId}`)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View IEP"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/students/${student.id}/ai-model`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View AI Model"
                          >
                            <Brain className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {studentsData && studentsData.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{studentsData.startIndex}</span> to{' '}
                <span className="font-medium">{studentsData.endIndex}</span> of{' '}
                <span className="font-medium">{studentsData.total}</span> results
              </div>
              <div className="flex gap-2">
                {[...Array(Math.min(studentsData.totalPages, 5))].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      i === studentsData.currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Student Detail Modal Component
const StudentDetailModal: React.FC<{ student: Student; onClose: () => void }> = ({ student, onClose }) => {
  const { data: detailedInfo, isLoading } = useQuery({
    queryKey: ['student-details', student.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        goalsMet: 8,
        totalGoals: 10,
        aiAccuracy: 94,
        subjects: [
          { name: 'Math', progress: 85, grade: 'A-' },
          { name: 'Reading', progress: 92, grade: 'A' },
          { name: 'Science', progress: 78, grade: 'B+' },
          { name: 'Social Studies', progress: 88, grade: 'A-' }
        ],
        recentActivities: [
          { date: '2024-11-05', activity: 'Completed Math Assessment', score: 90 },
          { date: '2024-11-04', activity: 'Reading Comprehension Exercise', score: 95 },
          { date: '2024-11-03', activity: 'Science Lab Report', score: 85 }
        ]
      };
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-600">Student ID: {student.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <Activity className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-xl font-bold text-gray-900">{student.performanceScore}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <Target className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Goals Met</p>
                <p className="text-xl font-bold text-gray-900">{detailedInfo?.goalsMet || 0}/{detailedInfo?.totalGoals || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <Brain className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">AI Accuracy</p>
                <p className="text-xl font-bold text-gray-900">{detailedInfo?.aiAccuracy || 0}%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-xl font-bold text-gray-900">{student.attendanceRate}%</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p className="text-sm font-medium text-gray-900">{student.school}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="text-sm font-medium text-gray-900">Grade {student.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teacher</p>
                  <p className="text-sm font-medium text-gray-900">{student.teacherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrollment Date</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Progress</h3>
              <div className="space-y-3">
                {detailedInfo?.subjects?.map((subject: any) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 w-32">{subject.name}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.progress >= 90 ? 'bg-green-500' :
                            subject.progress >= 80 ? 'bg-blue-500' :
                            subject.progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${subject.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{subject.grade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activities</h3>
              <div className="space-y-2">
                {detailedInfo?.recentActivities?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.score >= 90 ? 'bg-green-100 text-green-800' :
                      activity.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      Score: {activity.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

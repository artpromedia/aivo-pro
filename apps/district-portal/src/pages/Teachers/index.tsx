import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  X,
  MoreVertical,
  Save,
  Building2,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';

// Mock teacher data
const mockTeachersData = [
  {
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
    avatar: null
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'm.chen@school.edu',
    phone: '(555) 234-5678',
    school: 'Washington Middle',
    subjects: ['English', 'Literature'],
    grades: ['6th', '7th', '8th'],
    totalStudents: 124,
    activeStudents: 119,
    avgPerformance: 82,
    experience: 12,
    certification: 'Secondary Education, English',
    status: 'active',
    joinDate: '2012-09-01',
    avatar: null
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@school.edu',
    phone: '(555) 345-6789',
    school: 'Roosevelt High',
    subjects: ['Chemistry', 'Biology'],
    grades: ['9th', '10th', '11th', '12th'],
    totalStudents: 95,
    activeStudents: 92,
    avgPerformance: 89,
    experience: 6,
    certification: 'Science Education, AP Certified',
    status: 'active',
    joinDate: '2018-08-20',
    avatar: null
  },
  {
    id: 4,
    name: 'David Thompson',
    email: 'd.thompson@school.edu',
    phone: '(555) 456-7890',
    school: 'Jefferson Elementary',
    subjects: ['Physical Education', 'Health'],
    grades: ['K', '1st', '2nd', '3rd', '4th', '5th'],
    totalStudents: 245,
    activeStudents: 238,
    avgPerformance: 91,
    experience: 15,
    certification: 'Physical Education, CPR Certified',
    status: 'active',
    joinDate: '2009-08-10',
    avatar: null
  },
  {
    id: 5,
    name: 'Jennifer Lee',
    email: 'j.lee@school.edu',
    phone: '(555) 567-8901',
    school: 'Lincoln Elementary',
    subjects: ['Art', 'Music'],
    grades: ['K', '1st', '2nd', '3rd', '4th', '5th'],
    totalStudents: 180,
    activeStudents: 175,
    avgPerformance: 93,
    experience: 10,
    certification: 'Arts Education, Music Therapy',
    status: 'active',
    joinDate: '2014-09-02',
    avatar: null
  }
];

export const Teachers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<typeof mockTeachersData[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<typeof mockTeachersData[0] | null>(null);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    subjects: [] as string[],
    grades: [] as string[],
    certification: '',
    experience: 0,
    status: 'active' as 'active' | 'inactive',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Mutations
  const addTeacherMutation = useMutation({
    mutationFn: async (teacher: typeof formData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        ...teacher,
        id: Date.now(),
        totalStudents: 0,
        activeStudents: 0,
        avgPerformance: 0,
        avatar: null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setShowAddModal(false);
      resetForm();
      alert('Teacher added successfully!');
    },
  });

  const updateTeacherMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...data, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setEditingTeacher(null);
      resetForm();
      alert('Teacher updated successfully!');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      school: '',
      subjects: [],
      grades: [],
      certification: '',
      experience: 0,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (teacher: typeof mockTeachersData[0]) => {
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      school: teacher.school,
      subjects: teacher.subjects,
      grades: teacher.grades,
      certification: teacher.certification,
      experience: teacher.experience,
      status: teacher.status as 'active' | 'inactive',
      joinDate: teacher.joinDate,
    });
    setEditingTeacher(teacher);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.school) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingTeacher) {
      updateTeacherMutation.mutate({ id: editingTeacher.id, data: formData });
    } else {
      addTeacherMutation.mutate(formData);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleGradeToggle = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers', debouncedSearch, selectedSchool, selectedSubject],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockTeachersData.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            teacher.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            teacher.school.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesSchool = selectedSchool === 'all' || teacher.school === selectedSchool;
        const matchesSubject = selectedSubject === 'all' || teacher.subjects.includes(selectedSubject);
        
        return matchesSearch && matchesSchool && matchesSubject;
      });
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold">Teacher Management</h1>
              </div>
              <p className="text-purple-100">
                {teachers?.length || 0} teachers across your district
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Teacher
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500"
          >
            <Users className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
            <p className="text-3xl font-bold text-gray-900">{mockTeachersData.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-pink-500"
          >
            <BookOpen className="w-10 h-10 text-pink-600 mb-3" />
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">
              {mockTeachersData.reduce((sum, t) => sum + t.totalStudents, 0)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-600"
          >
            <Award className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(mockTeachersData.reduce((sum, t) => sum + t.avgPerformance, 0) / mockTeachersData.length)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-coral-500"
          >
            <TrendingUp className="w-10 h-10 text-coral-500 mb-3" />
            <p className="text-sm text-gray-600 mb-1">Avg Experience</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(mockTeachersData.reduce((sum, t) => sum + t.experience, 0) / mockTeachersData.length)} years
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              {(selectedSchool !== 'all' || selectedSubject !== 'all') && (
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Schools</option>
                      <option value="Lincoln Elementary">Lincoln Elementary</option>
                      <option value="Washington Middle">Washington Middle</option>
                      <option value="Roosevelt High">Roosevelt High</option>
                      <option value="Jefferson Elementary">Jefferson Elementary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                      <option value="Art">Art</option>
                      <option value="Physical Education">Physical Education</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Teachers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {teachers?.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 cursor-pointer border-2 border-transparent hover:border-purple-200"
                onClick={() => setSelectedTeacher(teacher)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {getInitials(teacher.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.school}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPerformanceColor(teacher.avgPerformance)}`}>
                          {teacher.avgPerformance}% Performance
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(teacher);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit teacher"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Students</p>
                    <p className="font-semibold text-gray-900">{teacher.activeStudents}/{teacher.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="font-semibold text-gray-900">{teacher.experience} years</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.subjects.map((subject) => (
                    <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {teacher.grades.map((grade) => (
                    <span key={grade} className="px-2 py-1 bg-gray-100 rounded-lg">
                      {grade}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <a href={`mailto:${teacher.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                  <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                  <Link to={`/teachers/${teacher.id}`} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium ml-auto">
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && teachers?.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSchool('all');
                setSelectedSubject('all');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Teacher Detail Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTeacher(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {getInitials(selectedTeacher.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTeacher.name}</h2>
                      <p className="text-purple-100">{selectedTeacher.school}</p>
                      <p className="text-sm text-purple-100 mt-1">{selectedTeacher.certification}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <Users className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedTeacher.totalStudents}</p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4">
                    <Award className="w-6 h-6 text-pink-600 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedTeacher.avgPerformance}%</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedTeacher.experience} years</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a href={`mailto:${selectedTeacher.email}`} className="text-purple-600 hover:text-purple-700">
                          {selectedTeacher.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a href={`tel:${selectedTeacher.phone}`} className="text-purple-600 hover:text-purple-700">
                          {selectedTeacher.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{selectedTeacher.school}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Teaching Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.subjects.map((subject) => (
                        <span key={subject} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Grade Levels</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.grades.map((grade) => (
                        <span key={grade} className="px-4 py-2 bg-gray-100 rounded-xl font-medium">
                          {grade} Grade
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Performance Overview</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Student Engagement</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round((selectedTeacher.activeStudents / selectedTeacher.totalStudents) * 100)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(selectedTeacher.activeStudents / selectedTeacher.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to={`/teachers/${selectedTeacher.id}`}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-center font-medium"
                  >
                    View Full Profile
                  </Link>
                  <button className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium">
                    Message Teacher
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Teacher Modal */}
      <AnimatePresence>
        {(showAddModal || editingTeacher) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingTeacher(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                    </h2>
                    <p className="text-gray-600">
                      {editingTeacher ? 'Update teacher information' : 'Enter teacher details to add to your district'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTeacher(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="teacher@school.edu"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* School & Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    School & Professional Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a school</option>
                        <option value="Lincoln Elementary">Lincoln Elementary</option>
                        <option value="Washington Middle">Washington Middle</option>
                        <option value="Roosevelt High">Roosevelt High</option>
                        <option value="Jefferson Elementary">Jefferson Elementary</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="5"
                        min="0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.certification}
                        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Elementary Education, Math Specialist"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Join Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Subjects Taught <span className="text-red-500">*</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Mathematics', 'Science', 'English', 'Literature', 'History', 'Geography', 'Art', 'Music', 'Physical Education', 'Chemistry', 'Biology', 'Physics'].map((subject) => (
                      <label
                        key={subject}
                        className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.subjects.includes(subject)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Grade Levels */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Grade Levels <span className="text-red-500">*</span>
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((grade) => (
                      <label
                        key={grade}
                        className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.grades.includes(grade)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.grades.includes(grade)}
                          onChange={() => handleGradeToggle(grade)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{grade}</span>
                        {formData.grades.includes(grade) && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTeacher(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addTeacherMutation.isPending || updateTeacherMutation.isPending}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {(addTeacherMutation.isPending || updateTeacherMutation.isPending) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {editingTeacher ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

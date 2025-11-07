import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Edit,
  Download,
  CheckCircle,
  Target,
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  School,
  Mail,
  Phone,
  Printer
} from 'lucide-react';

// Mock IEP data
const mockIEPData = {
  id: 'IEP-001',
  studentId: 'STU-001',
  studentName: 'Emma Johnson',
  grade: 5,
  school: 'Lincoln Elementary',
  status: 'Active',
  createdDate: '2024-09-15',
  effectiveDate: '2024-09-20',
  reviewDate: '2025-12-15',
  expirationDate: '2025-09-19',
  
  // Student Information
  dateOfBirth: '2014-05-15',
  age: 10,
  parentGuardian: 'Jennifer Johnson',
  parentEmail: 'jennifer.j@email.com',
  parentPhone: '(555) 234-5678',
  
  // Eligibility
  eligibility: {
    category: 'Specific Learning Disability',
    evaluationDate: '2024-08-15',
    reevaluationDue: '2027-08-15',
    primaryDisability: 'Reading Comprehension Deficit',
    secondaryDisability: null
  },
  
  // Present Levels of Performance
  presentLevels: {
    strengths: [
      'Strong mathematical reasoning skills',
      'Excellent verbal communication',
      'Creative problem-solving abilities',
      'Positive attitude toward learning'
    ],
    challenges: [
      'Reading comprehension below grade level',
      'Difficulty with extended writing tasks',
      'Time management for multi-step assignments'
    ],
    currentPerformance: 'Emma is currently performing at a 3rd-grade level in reading comprehension and a 4th-grade level in writing, while maintaining grade-level performance in mathematics and science. She benefits from additional time and breaks during reading-intensive tasks.'
  },
  
  // Annual Goals
  goals: [
    {
      id: 1,
      area: 'Reading Comprehension',
      goal: 'Emma will improve her reading comprehension skills from a 3rd-grade level to a 4.5-grade level as measured by standardized assessments.',
      baseline: '3rd grade level (Lexile 450)',
      target: '4.5 grade level (Lexile 700)',
      measurementMethod: 'DIBELS assessments, teacher observations, weekly comprehension quizzes',
      progressReports: [
        { date: '2024-11-01', progress: 'Making expected progress - Lexile 550', status: 'on-track' },
        { date: '2024-10-01', progress: 'Slow progress - Lexile 475', status: 'needs-attention' }
      ]
    },
    {
      id: 2,
      area: 'Written Expression',
      goal: 'Emma will compose organized paragraphs with topic sentences, supporting details, and conclusions with 80% accuracy.',
      baseline: '40% accuracy in paragraph structure',
      target: '80% accuracy',
      measurementMethod: 'Writing samples, rubric-based assessments',
      progressReports: [
        { date: '2024-11-01', progress: '65% accuracy achieved', status: 'on-track' },
        { date: '2024-10-01', progress: '55% accuracy achieved', status: 'on-track' }
      ]
    },
    {
      id: 3,
      area: 'Executive Functioning',
      goal: 'Emma will independently use a planner to organize assignments and complete homework with 90% accuracy.',
      baseline: '50% task completion without prompts',
      target: '90% task completion',
      measurementMethod: 'Daily planner checks, homework completion logs',
      progressReports: [
        { date: '2024-11-01', progress: '75% completion rate', status: 'on-track' }
      ]
    }
  ],
  
  // Accommodations
  accommodations: [
    {
      category: 'Presentation',
      items: [
        'Extended time (1.5x) on reading assignments',
        'Text-to-speech technology for lengthy passages',
        'Visual aids and graphic organizers',
        'Chunking of information into smaller segments'
      ]
    },
    {
      category: 'Response',
      items: [
        'Speech-to-text for extended writing',
        'Use of word processor with spell-check',
        'Option to respond orally to comprehension questions'
      ]
    },
    {
      category: 'Setting',
      items: [
        'Small group or quiet testing environment',
        'Preferential seating near instruction',
        'Minimal distractions during independent work'
      ]
    },
    {
      category: 'Timing/Scheduling',
      items: [
        'Frequent breaks during long tasks',
        'Extended time for assignments (not tests)',
        'Assignment modifications for length'
      ]
    }
  ],
  
  // Special Education Services
  services: [
    {
      service: 'Special Education - Reading',
      provider: 'Special Education Teacher',
      frequency: '5 times per week',
      duration: '45 minutes',
      location: 'Resource Room',
      startDate: '2024-09-20',
      endDate: '2025-09-19'
    },
    {
      service: 'Speech-Language Therapy',
      provider: 'Speech-Language Pathologist',
      frequency: '2 times per week',
      duration: '30 minutes',
      location: 'Speech Room',
      startDate: '2024-09-20',
      endDate: '2025-09-19'
    },
    {
      service: 'Counseling Services',
      provider: 'School Counselor',
      frequency: '1 time per week',
      duration: '30 minutes',
      location: 'Counseling Office',
      startDate: '2024-09-20',
      endDate: '2025-09-19'
    }
  ],
  
  // IEP Team Members
  team: [
    { role: 'Parent/Guardian', name: 'Jennifer Johnson', email: 'jennifer.j@email.com', phone: '(555) 234-5678' },
    { role: 'General Education Teacher', name: 'Mrs. Sarah Smith', email: 'sarah.smith@school.edu', phone: '(555) 111-2222' },
    { role: 'Special Education Teacher', name: 'Ms. Rachel Green', email: 'rachel.green@school.edu', phone: '(555) 111-3333' },
    { role: 'School Psychologist', name: 'Dr. Michael Chen', email: 'michael.chen@school.edu', phone: '(555) 111-4444' },
    { role: 'Speech-Language Pathologist', name: 'Ms. Lisa Anderson', email: 'lisa.anderson@school.edu', phone: '(555) 111-5555' },
    { role: 'Principal', name: 'Dr. Robert Martinez', email: 'robert.martinez@school.edu', phone: '(555) 111-2222' }
  ],
  
  // Meeting History
  meetings: [
    { date: '2024-09-15', type: 'Annual IEP Review', attendees: 6, notes: 'Initial IEP development meeting. All goals and services established.' },
    { date: '2024-10-15', type: 'Progress Review', attendees: 4, notes: 'Reviewed progress on reading goals. Adjusted text-to-speech accommodations.' }
  ]
};

export const IEPDetail: React.FC = () => {
  const { iepId } = useParams();
  const navigate = useNavigate();

  const iep = mockIEPData; // In real app, fetch using iepId with TanStack Query
  console.log('Viewing IEP:', iepId); // For future API integration

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not-making-progress': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/ieps')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to IEPs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-xl">
                <FileText className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">IEP - {iep.studentName}</h1>
                <p className="text-purple-100 mb-2">IEP ID: {iep.id} • Grade {iep.grade}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4" />
                    {iep.school}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Effective: {new Date(iep.effectiveDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Review Due: {new Date(iep.reviewDate).toLocaleDateString()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    iep.status === 'Active' ? 'bg-green-500' : 
                    iep.status === 'Draft' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {iep.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30">
                <Printer className="w-5 h-5" />
                Print
              </button>
              <Link
                to={`/ieps/${iep.id}/edit`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg"
              >
                <Edit className="w-5 h-5" />
                Edit IEP
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Info Cards */}
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
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{iep.goals.length}</p>
              </div>
            </div>
            <p className="text-sm text-purple-600 font-medium">
              {iep.goals.filter(g => g.progressReports[0]?.status === 'on-track').length} On Track
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Services</p>
                <p className="text-2xl font-bold text-gray-900">{iep.services.length}</p>
              </div>
            </div>
            <p className="text-sm text-blue-600 font-medium">Active Services</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accommodations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {iep.accommodations.reduce((sum, cat) => sum + cat.items.length, 0)}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium">Total Items</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-pink-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{iep.team.length}</p>
              </div>
            </div>
            <p className="text-sm text-pink-600 font-medium">Active Participants</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Student Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Student Name</p>
                  <Link to={`/students/${iep.studentId}`} className="text-purple-600 hover:text-purple-700 font-semibold">
                    {iep.studentName}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Grade</p>
                  <p className="font-semibold text-gray-900">Grade {iep.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.dateOfBirth).toLocaleDateString()} (Age {iep.age})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">School</p>
                  <p className="font-semibold text-gray-900">{iep.school}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Parent/Guardian</p>
                  <p className="font-semibold text-gray-900">{iep.parentGuardian}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact</p>
                  <p className="text-sm text-gray-900">{iep.parentEmail}</p>
                  <p className="text-sm text-gray-900">{iep.parentPhone}</p>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Eligibility Information</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Disability Category</p>
                  <p className="font-bold text-gray-900">{iep.eligibility.category}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Primary Disability</p>
                    <p className="font-semibold text-gray-900">{iep.eligibility.primaryDisability}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Evaluation Date</p>
                    <p className="font-semibold text-gray-900">{new Date(iep.eligibility.evaluationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reevaluation Due</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.eligibility.reevaluationDue).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Present Levels */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Present Levels of Performance</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {iep.presentLevels.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Areas of Challenge
                </h3>
                <div className="space-y-2">
                  {iep.presentLevels.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Current Performance</h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-900 leading-relaxed">{iep.presentLevels.currentPerformance}</p>
                </div>
              </div>
            </div>

            {/* Annual Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Annual Goals & Progress
              </h2>
              <div className="space-y-6">
                {iep.goals.map((goal) => (
                  <div key={goal.id} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                            Goal {goal.id}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">{goal.area}</span>
                        </div>
                        <p className="text-gray-900 font-medium mb-3">{goal.goal}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Baseline</p>
                        <p className="text-sm font-semibold text-gray-900">{goal.baseline}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Target</p>
                        <p className="text-sm font-semibold text-gray-900">{goal.target}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Measurement Method</p>
                      <p className="text-sm text-gray-900">{goal.measurementMethod}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">Progress Reports</p>
                      <div className="space-y-2">
                        {goal.progressReports.map((report, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${getProgressColor(report.status)}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold">{new Date(report.date).toLocaleDateString()}</span>
                              <span className="text-xs font-semibold capitalize">{report.status.replace('-', ' ')}</span>
                            </div>
                            <p className="text-sm">{report.progress}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Accommodations & Modifications
              </h2>
              <div className="space-y-6">
                {iep.accommodations.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Special Education Services
              </h2>
              <div className="space-y-4">
                {iep.services.map((service, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.service}</h3>
                        <p className="text-sm text-gray-600">{service.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">{service.frequency}</p>
                        <p className="text-xs text-gray-600">{service.duration}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{service.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Service Period</p>
                        <p className="font-medium text-gray-900">
                          {new Date(service.startDate).toLocaleDateString()} - {new Date(service.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* IEP Dates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Important Dates
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Created</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.createdDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Effective Date</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.effectiveDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Next Review</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.reviewDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Expiration</p>
                  <p className="font-semibold text-gray-900">{new Date(iep.expirationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* IEP Team */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-pink-600" />
                IEP Team
              </h2>
              <div className="space-y-3">
                {iep.team.map((member, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-purple-600 font-semibold mb-1">{member.role}</p>
                    <p className="font-semibold text-gray-900 mb-2">{member.name}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Meeting History</h2>
              <div className="space-y-3">
                {iep.meetings.map((meeting, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{meeting.type}</p>
                      <span className="text-xs text-gray-600">{new Date(meeting.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{meeting.attendees} attendees</p>
                    <p className="text-sm text-gray-700">{meeting.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to={`/ieps/${iep.id}/edit`}
                  className="w-full flex items-center gap-2 p-3 bg-white hover:bg-purple-50 text-purple-700 rounded-xl transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit IEP
                </Link>
                <button className="w-full flex items-center gap-2 p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full flex items-center gap-2 p-3 bg-white hover:bg-green-50 text-green-700 rounded-xl transition-colors font-medium">
                  <Printer className="w-4 h-4" />
                  Print IEP
                </button>
                <Link
                  to={`/students/${iep.studentId}`}
                  className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pink-50 text-pink-700 rounded-xl transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  View Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

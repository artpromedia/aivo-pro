import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  User, 
  FileText, 
  Target, 
  BookOpen, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  area: string;
  description: string;
  measurable: string;
  timeline: string;
}

interface Accommodation {
  id: string;
  type: string;
  description: string;
}

interface Service {
  id: string;
  type: string;
  frequency: string;
  duration: string;
  provider: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export function CreateIEP() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Student Information
    studentId: '',
    studentName: '',
    grade: '',
    dateOfBirth: '',
    disability: '',
    
    // Step 2: IEP Details
    iepType: 'initial',
    startDate: '',
    endDate: '',
    meetingDate: '',
    
    // Step 3: Goals & Objectives
    goals: [] as Goal[],
    
    // Step 4: Accommodations & Modifications
    accommodations: [] as Accommodation[],
    
    // Step 5: Services
    services: [] as Service[],
    
    // Step 6: Team Members
    teamMembers: [] as TeamMember[],
    
    // Step 7: Additional Information
    parentalConcerns: '',
    studentStrengths: '',
    additionalNotes: '',
  });

  // Mock student data
  const mockStudents = [
    { id: '1', name: 'Emma Johnson', grade: '5th', dob: '2014-03-15', disability: 'Learning Disability' },
    { id: '2', name: 'Liam Chen', grade: '3rd', dob: '2016-07-22', disability: 'ADHD' },
    { id: '3', name: 'Sophia Martinez', grade: '7th', dob: '2012-11-08', disability: 'Autism Spectrum' },
    { id: '4', name: 'Noah Williams', grade: '4th', dob: '2015-01-30', disability: 'Speech Impairment' },
  ];

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const steps = [
    { number: 1, name: 'Student Info', icon: User },
    { number: 2, name: 'IEP Details', icon: FileText },
    { number: 3, name: 'Goals', icon: Target },
    { number: 4, name: 'Accommodations', icon: BookOpen },
    { number: 5, name: 'Services', icon: Calendar },
    { number: 6, name: 'Team', icon: Users },
    { number: 7, name: 'Review', icon: CheckCircle },
  ];

  const handleStudentSelect = (student: typeof mockStudents[0]) => {
    setFormData({
      ...formData,
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      dateOfBirth: student.dob,
      disability: student.disability,
    });
    setShowStudentSearch(false);
    setSearchQuery('');
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      area: '',
      description: '',
      measurable: '',
      timeline: '',
    };
    setFormData({ ...formData, goals: [...formData.goals, newGoal] });
  };

  const removeGoal = (id: string) => {
    setFormData({ ...formData, goals: formData.goals.filter(g => g.id !== id) });
  };

  const updateGoal = (id: string, field: keyof Goal, value: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.map(g => g.id === id ? { ...g, [field]: value } : g)
    });
  };

  const addAccommodation = () => {
    const newAccommodation: Accommodation = {
      id: Date.now().toString(),
      type: 'instructional',
      description: '',
    };
    setFormData({ ...formData, accommodations: [...formData.accommodations, newAccommodation] });
  };

  const removeAccommodation = (id: string) => {
    setFormData({ ...formData, accommodations: formData.accommodations.filter(a => a.id !== id) });
  };

  const updateAccommodation = (id: string, field: keyof Accommodation, value: string) => {
    setFormData({
      ...formData,
      accommodations: formData.accommodations.map(a => a.id === id ? { ...a, [field]: value } : a)
    });
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      type: '',
      frequency: '',
      duration: '',
      provider: '',
    };
    setFormData({ ...formData, services: [...formData.services, newService] });
  };

  const removeService = (id: string) => {
    setFormData({ ...formData, services: formData.services.filter(s => s.id !== id) });
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setFormData({
      ...formData,
      services: formData.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      email: '',
    };
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, newMember] });
  };

  const removeTeamMember = (id: string) => {
    setFormData({ ...formData, teamMembers: formData.teamMembers.filter(t => t.id !== id) });
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // TODO: API call to save draft
    alert('IEP draft saved successfully!');
  };

  const handleSubmit = () => {
    console.log('Submitting IEP:', formData);
    // TODO: API call to submit IEP
    alert('IEP submitted successfully!');
    navigate('/ieps');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.studentId && formData.disability;
      case 2:
        return formData.iepType && formData.startDate && formData.endDate && formData.meetingDate;
      case 3:
        return formData.goals.length > 0 && formData.goals.every(g => g.area && g.description);
      case 4:
        return formData.accommodations.length > 0;
      case 5:
        return formData.services.length > 0;
      case 6:
        return formData.teamMembers.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/ieps')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create New IEP
                  </h1>
                  <p className="text-sm text-gray-600">
                    {formData.studentName || 'Select a student to begin'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={currentStep !== 7}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit IEP
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex flex-col items-center gap-2 group ${
                    step.number === currentStep ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.number === currentStep
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                      : step.number < currentStep
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${
                    step.number === currentStep
                      ? 'text-purple-600'
                      : step.number < currentStep
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    step.number < currentStep ? 'bg-purple-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Step 1: Student Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Information</h2>
                <p className="text-gray-600">Select or search for the student this IEP is for</p>
              </div>

              {!formData.studentId ? (
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students by name or grade..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowStudentSearch(true);
                      }}
                      onFocus={() => setShowStudentSearch(true)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {showStudentSearch && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => handleStudentSelect(student)}
                              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600">
                                Grade {student.grade} • {student.disability}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            No students found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {formData.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{formData.studentName}</h3>
                        <p className="text-gray-600">Grade {formData.grade}</p>
                        <p className="text-sm text-gray-500">DOB: {formData.dateOfBirth}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, studentId: '', studentName: '', grade: '', dateOfBirth: '', disability: '' })}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {formData.studentId && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Disability <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.disability}
                      onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select disability...</option>
                      <option value="Learning Disability">Learning Disability</option>
                      <option value="ADHD">ADHD</option>
                      <option value="Autism Spectrum">Autism Spectrum Disorder</option>
                      <option value="Speech Impairment">Speech or Language Impairment</option>
                      <option value="Intellectual Disability">Intellectual Disability</option>
                      <option value="Emotional Disturbance">Emotional Disturbance</option>
                      <option value="Other Health Impairment">Other Health Impairment</option>
                      <option value="Visual Impairment">Visual Impairment</option>
                      <option value="Hearing Impairment">Hearing Impairment</option>
                      <option value="Multiple Disabilities">Multiple Disabilities</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: IEP Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">IEP Details</h2>
                <p className="text-gray-600">Provide basic information about this IEP</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IEP Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.iepType}
                    onChange={(e) => setFormData({ ...formData, iepType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="initial">Initial IEP</option>
                    <option value="annual">Annual Review</option>
                    <option value="triennial">Triennial Review</option>
                    <option value="amendment">Amendment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IEP Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IEP End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> An IEP must be reviewed at least annually. The end date should typically be one year from the start date.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Objectives */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Goals & Objectives</h2>
                  <p className="text-gray-600">Define measurable annual goals for the student</p>
                </div>
                <button
                  onClick={addGoal}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Goal
                </button>
              </div>

              {formData.goals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No goals added yet</p>
                  <button
                    onClick={addGoal}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add First Goal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.goals.map((goal, index) => (
                    <div key={goal.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Goal {index + 1}</h3>
                        <button
                          onClick={() => removeGoal(goal.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Area <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={goal.area}
                            onChange={(e) => updateGoal(goal.id, 'area', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select area...</option>
                            <option value="Reading">Reading</option>
                            <option value="Writing">Writing</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Communication">Communication</option>
                            <option value="Social/Emotional">Social/Emotional</option>
                            <option value="Behavior">Behavior</option>
                            <option value="Motor Skills">Motor Skills</option>
                            <option value="Adaptive Skills">Adaptive Skills</option>
                            <option value="Vocational">Vocational</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Goal Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={goal.description}
                            onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                            rows={3}
                            placeholder="Describe what the student will accomplish..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Measurable Criteria
                          </label>
                          <input
                            type="text"
                            value={goal.measurable}
                            onChange={(e) => updateGoal(goal.id, 'measurable', e.target.value)}
                            placeholder="e.g., 80% accuracy over 3 consecutive trials"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline
                          </label>
                          <input
                            type="text"
                            value={goal.timeline}
                            onChange={(e) => updateGoal(goal.id, 'timeline', e.target.value)}
                            placeholder="e.g., By end of IEP period"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Accommodations & Modifications */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Accommodations & Modifications</h2>
                  <p className="text-gray-600">Specify supports the student needs to access curriculum</p>
                </div>
                <button
                  onClick={addAccommodation}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Accommodation
                </button>
              </div>

              {formData.accommodations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No accommodations added yet</p>
                  <button
                    onClick={addAccommodation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add First Accommodation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.accommodations.map((accommodation, index) => (
                    <div key={accommodation.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Accommodation {index + 1}</h3>
                        <button
                          onClick={() => removeAccommodation(accommodation.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                          </label>
                          <select
                            value={accommodation.type}
                            onChange={(e) => updateAccommodation(accommodation.id, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          >
                            <option value="instructional">Instructional</option>
                            <option value="environmental">Environmental</option>
                            <option value="assessment">Assessment</option>
                            <option value="behavioral">Behavioral</option>
                            <option value="technology">Technology</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={accommodation.description}
                            onChange={(e) => updateAccommodation(accommodation.id, 'description', e.target.value)}
                            rows={2}
                            placeholder="Describe the accommodation..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Services */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Related Services</h2>
                  <p className="text-gray-600">Define special education and related services</p>
                </div>
                <button
                  onClick={addService}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              {formData.services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No services added yet</p>
                  <button
                    onClick={addService}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add First Service
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={service.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Service {index + 1}</h3>
                        <button
                          onClick={() => removeService(service.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={service.type}
                            onChange={(e) => updateService(service.id, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select service...</option>
                            <option value="Speech Therapy">Speech Therapy</option>
                            <option value="Occupational Therapy">Occupational Therapy</option>
                            <option value="Physical Therapy">Physical Therapy</option>
                            <option value="Counseling">Counseling</option>
                            <option value="Resource Room">Resource Room</option>
                            <option value="Special Education">Special Education</option>
                            <option value="Assistive Technology">Assistive Technology</option>
                            <option value="Transportation">Transportation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={service.frequency}
                            onChange={(e) => updateService(service.id, 'frequency', e.target.value)}
                            placeholder="e.g., 2x per week"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={service.duration}
                            onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                            placeholder="e.g., 30 minutes"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Provider
                          </label>
                          <input
                            type="text"
                            value={service.provider}
                            onChange={(e) => updateService(service.id, 'provider', e.target.value)}
                            placeholder="e.g., School SLP"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Team Members */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">IEP Team Members</h2>
                  <p className="text-gray-600">Add all team members who will participate in this IEP</p>
                </div>
                <button
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Team Member
                </button>
              </div>

              {formData.teamMembers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No team members added yet</p>
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add First Team Member
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.teamMembers.map((member, index) => (
                    <div key={member.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Team Member {index + 1}</h3>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select role...</option>
                            <option value="Parent/Guardian">Parent/Guardian</option>
                            <option value="General Education Teacher">General Education Teacher</option>
                            <option value="Special Education Teacher">Special Education Teacher</option>
                            <option value="School Psychologist">School Psychologist</option>
                            <option value="Speech Therapist">Speech Therapist</option>
                            <option value="Occupational Therapist">Occupational Therapist</option>
                            <option value="Physical Therapist">Physical Therapist</option>
                            <option value="School Counselor">School Counselor</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                            placeholder="email@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Review & Submit */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h2>
                <p className="text-gray-600">Review all information before submitting</p>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parental Concerns
                  </label>
                  <textarea
                    value={formData.parentalConcerns}
                    onChange={(e) => setFormData({ ...formData, parentalConcerns: e.target.value })}
                    rows={3}
                    placeholder="Document any concerns raised by parents/guardians..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Strengths
                  </label>
                  <textarea
                    value={formData.studentStrengths}
                    onChange={(e) => setFormData({ ...formData, studentStrengths: e.target.value })}
                    rows={3}
                    placeholder="Describe the student's strengths and preferences..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    rows={3}
                    placeholder="Any additional information..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Goals</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.goals.length}</p>
                  <p className="text-sm text-gray-600">Annual goals defined</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Accommodations</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.accommodations.length}</p>
                  <p className="text-sm text-gray-600">Support strategies</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Services</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.services.length}</p>
                  <p className="text-sm text-gray-600">Related services</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Team Members</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.teamMembers.length}</p>
                  <p className="text-sm text-gray-600">IEP team participants</p>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Compliance Checklist
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" defaultChecked />
                    <span className="text-sm text-gray-700">
                      Student's present levels of academic achievement and functional performance are documented
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" defaultChecked />
                    <span className="text-sm text-gray-700">
                      All goals are measurable and include baseline data
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" defaultChecked />
                    <span className="text-sm text-gray-700">
                      Services are clearly defined with frequency, duration, and location
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" defaultChecked />
                    <span className="text-sm text-gray-700">
                      Parent participation has been documented
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
                disabled={!canProceed()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                Next
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit IEP
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

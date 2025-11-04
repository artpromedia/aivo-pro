import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  Filter,
  Download,
  Upload,
  BookOpen,
  Clock,
  Users,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { Accommodation } from '../../types/iep.types';

interface IEPAccommodationsPageProps {
  studentId: string;
  onClose: () => void;
}

interface AccommodationFormData {
  type: 'instructional' | 'assessment' | 'behavioral' | 'environmental';
  category: string;
  description: string;
  implementation: string;
  frequency: 'always' | 'as-needed' | 'specific-subjects';
  subjects?: string[];
  notes: string;
}

const ACCOMMODATION_TYPES = [
  { value: 'instructional', label: 'Instructional', icon: BookOpen, color: 'blue' },
  { value: 'assessment', label: 'Assessment', icon: BarChart3, color: 'green' },
  { value: 'behavioral', label: 'Behavioral', icon: Users, color: 'purple' },
  { value: 'environmental', label: 'Environmental', icon: Settings, color: 'orange' }
];

const ACCOMMODATION_CATEGORIES = {
  instructional: [
    'Extended Time',
    'Reduced Assignments',
    'Visual Supports',
    'Audio Support',
    'Chunking/Breaking Down Tasks',
    'Peer Support',
    'Modified Materials',
    'Alternative Formats'
  ],
  assessment: [
    'Extended Time',
    'Alternative Testing Location',
    'Read Aloud',
    'Scribe Services',
    'Multiple Choice Instead of Essay',
    'Calculator Use',
    'Reference Materials',
    'Frequent Breaks'
  ],
  behavioral: [
    'Movement Breaks',
    'Fidget Tools',
    'Positive Reinforcement',
    'Clear Expectations',
    'Visual Schedule',
    'Social Stories',
    'Self-Monitoring Tools',
    'Calming Strategies'
  ],
  environmental: [
    'Preferential Seating',
    'Reduced Distractions',
    'Noise-Canceling Headphones',
    'Lighting Adjustments',
    'Flexible Seating',
    'Quiet Space Access',
    'Temperature Control',
    'Organization Systems'
  ]
};

export const IEPAccommodationsPage: React.FC<IEPAccommodationsPageProps> = ({ studentId, onClose }) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      id: '1',
      type: 'instructional',
      category: 'Extended Time',
      description: 'Additional time for completing assignments and assessments',
      implementation: 'Provide 1.5x the standard time allocation for all assignments and tests',
      frequency: 'always',
      effectiveness: 'highly-effective',
      notes: 'Student shows significant improvement in work quality when given adequate time. Reduces anxiety and allows for better demonstration of knowledge.'
    },
    {
      id: '2',
      type: 'assessment',
      category: 'Alternative Testing Location',
      description: 'Quiet, distraction-free environment for assessments',
      implementation: 'Test in resource room or quiet corner of classroom with minimal distractions',
      frequency: 'always',
      effectiveness: 'effective',
      notes: 'Helps maintain focus during testing. Monitor for any signs of isolation concerns.'
    },
    {
      id: '3',
      type: 'behavioral',
      category: 'Movement Breaks',
      description: 'Scheduled breaks for physical movement',
      implementation: 'Allow 2-minute movement breaks every 15 minutes during instruction',
      frequency: 'as-needed',
      subjects: ['Math', 'Language Arts'],
      effectiveness: 'effective',
      notes: 'Particularly helpful during longer instructional periods. Use timer to help student self-monitor.'
    },
    {
      id: '4',
      type: 'environmental',
      category: 'Preferential Seating',
      description: 'Strategic classroom seating placement',
      implementation: 'Seat near teacher, away from high-traffic areas, with good view of board',
      frequency: 'always',
      effectiveness: 'highly-effective',
      notes: 'Significant reduction in off-task behavior when seated appropriately.'
    }
  ]);

  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEffectiveness, setFilterEffectiveness] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [accommodationForm, setAccommodationForm] = useState<AccommodationFormData>({
    type: 'instructional',
    category: '',
    description: '',
    implementation: '',
    frequency: 'always',
    subjects: [],
    notes: ''
  });

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesType = filterType === 'all' || accommodation.type === filterType;
    const matchesEffectiveness = filterEffectiveness === 'all' || accommodation.effectiveness === filterEffectiveness;
    const matchesSearch = accommodation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesEffectiveness && matchesSearch;
  });

  const handleSaveAccommodation = () => {
    const newAccommodation: Accommodation = {
      id: editingAccommodation?.id || Date.now().toString(),
      ...accommodationForm,
      effectiveness: editingAccommodation?.effectiveness || 'not-assessed'
    };

    if (editingAccommodation) {
      setAccommodations(accommodations.map(a => a.id === editingAccommodation.id ? newAccommodation : a));
    } else {
      setAccommodations([...accommodations, newAccommodation]);
    }

    setShowAccommodationForm(false);
    setEditingAccommodation(null);
    setAccommodationForm({
      type: 'instructional',
      category: '',
      description: '',
      implementation: '',
      frequency: 'always',
      subjects: [],
      notes: ''
    });
  };

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setAccommodationForm({
      type: accommodation.type,
      category: accommodation.category,
      description: accommodation.description,
      implementation: accommodation.implementation,
      frequency: accommodation.frequency,
      subjects: accommodation.subjects || [],
      notes: accommodation.notes
    });
    setShowAccommodationForm(true);
  };

  const handleDeleteAccommodation = (accommodationId: string) => {
    if (confirm('Are you sure you want to delete this accommodation?')) {
      setAccommodations(accommodations.filter(a => a.id !== accommodationId));
    }
  };

  const updateEffectiveness = (accommodationId: string, effectiveness: string) => {
    setAccommodations(accommodations.map(a => 
      a.id === accommodationId ? { ...a, effectiveness: effectiveness as any } : a
    ));
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'highly-effective': return 'bg-green-100 text-green-800 border-green-200';
      case 'effective': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'somewhat-effective': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-effective': return 'bg-red-100 text-red-800 border-red-200';
      case 'not-assessed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffectivenessIcon = (effectiveness: string) => {
    switch (effectiveness) {
      case 'highly-effective': return <Star className="w-4 h-4 text-green-600" />;
      case 'effective': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'somewhat-effective': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'not-effective': return <X className="w-4 h-4 text-red-600" />;
      case 'not-assessed': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeConfig = (type: string) => {
    return ACCOMMODATION_TYPES.find(t => t.value === type) || ACCOMMODATION_TYPES[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">IEP Accommodations</h1>
                <p className="text-white/90">Manage support strategies and track effectiveness</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <TrendingUp className="w-5 h-5 mr-2" />
                Effectiveness Report
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Accommodations</p>
                  <p className="text-2xl font-bold text-gray-900">{accommodations.length}</p>
                </div>
                <Settings className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Highly Effective</p>
                  <p className="text-2xl font-bold text-green-600">
                    {accommodations.filter(a => a.effectiveness === 'highly-effective').length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Always Used</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {accommodations.filter(a => a.frequency === 'always').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Need Assessment</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {accommodations.filter(a => a.effectiveness === 'not-assessed').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="gradient"
                onClick={() => setShowAccommodationForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Accommodation
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export List
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accommodations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {ACCOMMODATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterEffectiveness}
              onChange={(e) => setFilterEffectiveness(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Effectiveness</option>
              <option value="highly-effective">Highly Effective</option>
              <option value="effective">Effective</option>
              <option value="somewhat-effective">Somewhat Effective</option>
              <option value="not-effective">Not Effective</option>
              <option value="not-assessed">Not Assessed</option>
            </select>
          </div>
        </div>

        {/* Accommodations List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAccommodations.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accommodations Found</h3>
              <p className="text-gray-600 mb-6">
                {accommodations.length === 0 ? "Start by adding your first accommodation." : "No accommodations match your current filters."}
              </p>
              {accommodations.length === 0 && (
                <Button variant="gradient" onClick={() => setShowAccommodationForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Accommodation
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredAccommodations.map((accommodation, index) => {
                const typeConfig = getTypeConfig(accommodation.type);
                const IconComponent = typeConfig.icon;
                
                return (
                  <motion.div
                    key={accommodation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 bg-${typeConfig.color}-100 rounded-xl flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${typeConfig.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{accommodation.category}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}>
                              {typeConfig.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEffectivenessColor(accommodation.effectiveness)} flex items-center gap-1`}>
                              {getEffectivenessIcon(accommodation.effectiveness)}
                              {accommodation.effectiveness.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{accommodation.description}</p>
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">Implementation:</p>
                            <p className="text-sm text-gray-700">{accommodation.implementation}</p>
                          </div>
                          {accommodation.subjects && accommodation.subjects.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium text-gray-700">Subjects:</span>
                              <div className="flex gap-1">
                                {accommodation.subjects.map(subject => (
                                  <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {accommodation.notes && (
                            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-300">
                              <p className="text-sm font-medium text-blue-900 mb-1">Notes:</p>
                              <p className="text-sm text-blue-800">{accommodation.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={accommodation.effectiveness}
                          onChange={(e) => updateEffectiveness(accommodation.id, e.target.value)}
                          className="px-3 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="not-assessed">Not Assessed</option>
                          <option value="highly-effective">Highly Effective</option>
                          <option value="effective">Effective</option>
                          <option value="somewhat-effective">Somewhat Effective</option>
                          <option value="not-effective">Not Effective</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAccommodation(accommodation)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAccommodation(accommodation)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAccommodation(accommodation.id)}
                          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                      <div>
                        <span className="font-medium text-gray-700">Frequency: </span>
                        <span className="text-gray-900 capitalize">{accommodation.frequency.replace('-', ' ')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Type: </span>
                        <span className="text-gray-900 capitalize">{accommodation.type}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Accommodation Form Modal */}
      <AnimatePresence>
        {showAccommodationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAccommodation ? 'Edit Accommodation' : 'Add New Accommodation'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAccommodationForm(false);
                    setEditingAccommodation(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      value={accommodationForm.type}
                      onChange={(e) => setAccommodationForm({...accommodationForm, type: e.target.value as any, category: ''})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      {ACCOMMODATION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={accommodationForm.category}
                      onChange={(e) => setAccommodationForm({...accommodationForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {(ACCOMMODATION_CATEGORIES[accommodationForm.type] || []).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={accommodationForm.description}
                    onChange={(e) => setAccommodationForm({...accommodationForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief description of the accommodation..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Details *</label>
                  <textarea
                    value={accommodationForm.implementation}
                    onChange={(e) => setAccommodationForm({...accommodationForm, implementation: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Specific steps for implementing this accommodation..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                  <select
                    value={accommodationForm.frequency}
                    onChange={(e) => setAccommodationForm({...accommodationForm, frequency: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="always">Always</option>
                    <option value="as-needed">As Needed</option>
                    <option value="specific-subjects">Specific Subjects Only</option>
                  </select>
                </div>

                {accommodationForm.frequency === 'specific-subjects' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Math', 'Reading', 'Writing', 'Science', 'Social Studies', 'Art', 'Music', 'PE'].map(subject => (
                        <label key={subject} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={accommodationForm.subjects?.includes(subject) || false}
                            onChange={(e) => {
                              const subjects = accommodationForm.subjects || [];
                              if (e.target.checked) {
                                setAccommodationForm({...accommodationForm, subjects: [...subjects, subject]});
                              } else {
                                setAccommodationForm({...accommodationForm, subjects: subjects.filter(s => s !== subject)});
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={accommodationForm.notes}
                    onChange={(e) => setAccommodationForm({...accommodationForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Additional notes about this accommodation..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <Button
                  variant="gradient"
                  onClick={handleSaveAccommodation}
                  disabled={!accommodationForm.category || !accommodationForm.description || !accommodationForm.implementation}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingAccommodation ? 'Update Accommodation' : 'Add Accommodation'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAccommodationForm(false);
                    setEditingAccommodation(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
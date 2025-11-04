import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Filter,
  Search,
  Download,
  Upload,
  BookOpen,
  Brain,
  Users,
  MessageSquare,
  Star,
  Award,
  Eye,
  Save,
  X
} from 'lucide-react';
import { Button } from '@aivo/ui';
import { IEPGoal } from '../../types/iep.types';

interface IEPGoalsPageProps {
  studentId: string;
  onClose: () => void;
}

interface GoalFormData {
  domain: 'academic' | 'behavioral' | 'social' | 'communication' | 'motor' | 'adaptive';
  category: string;
  description: string;
  measurableObjective: string;
  targetCriteria: string;
  evaluationMethod: string;
  frequency: string;
  targetDate: string;
}

const GOAL_DOMAINS = [
  { value: 'academic', label: 'Academic', icon: BookOpen, color: 'blue' },
  { value: 'behavioral', label: 'Behavioral', icon: Brain, color: 'purple' },
  { value: 'social', label: 'Social', icon: Users, color: 'green' },
  { value: 'communication', label: 'Communication', icon: MessageSquare, color: 'coral' },
  { value: 'motor', label: 'Motor Skills', icon: Target, color: 'orange' },
  { value: 'adaptive', label: 'Adaptive', icon: Star, color: 'pink' }
];

const GOAL_CATEGORIES = {
  academic: ['Reading Comprehension', 'Math Problem Solving', 'Writing Skills', 'Science Concepts'],
  behavioral: ['Attention/Focus', 'Self-Regulation', 'Impulse Control', 'Task Completion'],
  social: ['Peer Interaction', 'Social Cues', 'Friendship Skills', 'Group Participation'],
  communication: ['Expressive Language', 'Receptive Language', 'Speech Articulation', 'Alternative Communication'],
  motor: ['Fine Motor', 'Gross Motor', 'Handwriting', 'Coordination'],
  adaptive: ['Daily Living Skills', 'Independence', 'Problem Solving', 'Self-Care']
};

export const IEPGoalsPage: React.FC<IEPGoalsPageProps> = ({ studentId, onClose }) => {
  const [goals, setGoals] = useState<IEPGoal[]>([
    {
      id: '1',
      domain: 'academic',
      category: 'Reading Comprehension',
      description: 'Improve reading comprehension skills',
      measurableObjective: 'When given grade-level reading passages, student will answer comprehension questions with 80% accuracy',
      targetCriteria: '80% accuracy over 3 consecutive trials',
      evaluationMethod: 'Weekly reading assessments and work samples',
      frequency: 'Daily',
      startDate: new Date().toISOString(),
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      currentProgress: 65,
      status: 'in-progress',
      notes: ['Good progress in main idea identification', 'Needs support with inference questions'],
      dataPoints: [
        { date: '2025-10-01', score: 45, notes: 'Baseline assessment' },
        { date: '2025-10-15', score: 55, notes: 'Showing improvement with guided practice' },
        { date: '2025-11-01', score: 65, notes: 'Consistent progress with comprehension strategies' }
      ]
    },
    {
      id: '2',
      domain: 'behavioral',
      category: 'Attention/Focus',
      description: 'Increase sustained attention during instruction',
      measurableObjective: 'Student will maintain attention to task for 15 minutes with no more than 2 redirections',
      targetCriteria: '15 minutes sustained attention with ≤2 redirections for 4 out of 5 days',
      evaluationMethod: 'Direct observation and data collection',
      frequency: 'Daily',
      startDate: new Date().toISOString(),
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      currentProgress: 40,
      status: 'in-progress',
      notes: ['Uses fidget tools effectively', 'Responds well to movement breaks'],
      dataPoints: [
        { date: '2025-10-01', score: 20, notes: 'Required frequent redirections' },
        { date: '2025-10-15', score: 30, notes: 'Improved with visual schedule' },
        { date: '2025-11-01', score: 40, notes: 'Better focus with sensory breaks' }
      ]
    }
  ]);

  const [selectedGoal, setSelectedGoal] = useState<IEPGoal | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IEPGoal | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);

  const [goalForm, setGoalForm] = useState<GoalFormData>({
    domain: 'academic',
    category: '',
    description: '',
    measurableObjective: '',
    targetCriteria: '',
    evaluationMethod: '',
    frequency: 'Daily',
    targetDate: ''
  });

  const filteredGoals = goals.filter(goal => {
    const matchesDomain = filterDomain === 'all' || goal.domain === filterDomain;
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    const matchesSearch = goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesStatus && matchesSearch;
  });

  const handleSaveGoal = () => {
    const newGoal: IEPGoal = {
      id: editingGoal?.id || Date.now().toString(),
      ...goalForm,
      startDate: editingGoal?.startDate || new Date().toISOString(),
      currentProgress: editingGoal?.currentProgress || 0,
      status: editingGoal?.status || 'not-started',
      notes: editingGoal?.notes || [],
      dataPoints: editingGoal?.dataPoints || []
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
    } else {
      setGoals([...goals, newGoal]);
    }

    setShowGoalForm(false);
    setEditingGoal(null);
    setGoalForm({
      domain: 'academic',
      category: '',
      description: '',
      measurableObjective: '',
      targetCriteria: '',
      evaluationMethod: '',
      frequency: 'Daily',
      targetDate: ''
    });
  };

  const handleEditGoal = (goal: IEPGoal) => {
    setEditingGoal(goal);
    setGoalForm({
      domain: goal.domain,
      category: goal.category,
      description: goal.description,
      measurableObjective: goal.measurableObjective,
      targetCriteria: goal.targetCriteria,
      evaluationMethod: goal.evaluationMethod,
      frequency: goal.frequency,
      targetDate: goal.targetDate
    });
    setShowGoalForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== goalId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'not-started': return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      case 'discontinued': return <X className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'discontinued': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDomainConfig = (domain: string) => {
    return GOAL_DOMAINS.find(d => d.value === domain) || GOAL_DOMAINS[0];
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">IEP Goals Management</h1>
                <p className="text-white/90">Track progress and manage educational objectives</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setShowProgressModal(true)} className="text-white hover:bg-white/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                Progress Overview
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
                  <p className="text-sm text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{goals.filter(g => g.status === 'in-progress').length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mastered</p>
                  <p className="text-2xl font-bold text-green-600">{goals.filter(g => g.status === 'mastered').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(goals.reduce((sum, g) => sum + g.currentProgress, 0) / goals.length)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
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
                onClick={() => setShowGoalForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Goal
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Goals
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
                placeholder="Search goals..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Domains</option>
              {GOAL_DOMAINS.map(domain => (
                <option key={domain.value} value={domain.value}>{domain.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="mastered">Mastered</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>

        {/* Goals List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Found</h3>
              <p className="text-gray-600 mb-6">
                {goals.length === 0 ? "Start by creating your first IEP goal." : "No goals match your current filters."}
              </p>
              {goals.length === 0 && (
                <Button variant="gradient" onClick={() => setShowGoalForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredGoals.map((goal, index) => {
                const domainConfig = getDomainConfig(goal.domain);
                const IconComponent = domainConfig.icon;
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 bg-${domainConfig.color}-100 rounded-xl flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${domainConfig.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{goal.category}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(goal.status)}`}>
                              {goal.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${domainConfig.color}-100 text-${domainConfig.color}-800`}>
                              {domainConfig.label}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{goal.description}</p>
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">Measurable Objective:</p>
                            <p className="text-sm text-gray-700">{goal.measurableObjective}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedGoal(goal)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-gray-900">{goal.currentProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 bg-gradient-to-r from-${domainConfig.color}-500 to-${domainConfig.color}-600 rounded-full transition-all duration-500`}
                          style={{ width: `${goal.currentProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{goal.dataPoints.length}</p>
                        <p className="text-gray-600">Data Points</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{goal.frequency}</p>
                        <p className="text-gray-600">Frequency</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                        <p className="text-gray-600">Until Target</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain *</label>
                    <select
                      value={goalForm.domain}
                      onChange={(e) => setGoalForm({...goalForm, domain: e.target.value as any, category: ''})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {GOAL_DOMAINS.map(domain => (
                        <option key={domain.value} value={domain.value}>{domain.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={goalForm.category}
                      onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {(GOAL_CATEGORIES[goalForm.domain] || []).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Description *</label>
                  <textarea
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the goal..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurable Objective *</label>
                  <textarea
                    value={goalForm.measurableObjective}
                    onChange={(e) => setGoalForm({...goalForm, measurableObjective: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specific, measurable objective (e.g., 'When given..., student will...')"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Success Criteria *</label>
                  <input
                    type="text"
                    value={goalForm.targetCriteria}
                    onChange={(e) => setGoalForm({...goalForm, targetCriteria: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., '80% accuracy over 3 consecutive trials'"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Method *</label>
                    <input
                      type="text"
                      value={goalForm.evaluationMethod}
                      onChange={(e) => setGoalForm({...goalForm, evaluationMethod: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="How progress will be measured"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <select
                      value={goalForm.frequency}
                      onChange={(e) => setGoalForm({...goalForm, frequency: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date *</label>
                  <input
                    type="date"
                    value={goalForm.targetDate.split('T')[0]}
                    onChange={(e) => setGoalForm({...goalForm, targetDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <Button
                  variant="gradient"
                  onClick={handleSaveGoal}
                  disabled={!goalForm.category || !goalForm.description || !goalForm.measurableObjective}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoalForm(false);
                    setEditingGoal(null);
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
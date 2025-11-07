import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award, Clock, Plus, Filter, Download } from 'lucide-react';

interface IEPGoal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'behavioral' | 'social' | 'communication' | 'motor';
  targetDate: string;
  status: 'on-track' | 'at-risk' | 'ahead' | 'completed';
  currentProgress: number;
  targetProgress: number;
  milestones: Milestone[];
  dataPoints: ProgressDataPoint[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

interface ProgressDataPoint {
  id: string;
  date: string;
  value: number;
  notes: string;
  enteredBy: string;
  type: 'observation' | 'assessment' | 'milestone';
}

interface IEPProgressTrackingProps {
  childId: string;
}

const IEPProgressTracking: React.FC<IEPProgressTrackingProps> = ({ childId }) => {
  const [goals, setGoals] = useState<IEPGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<IEPGoal | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showProgressEntry, setShowProgressEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIEPGoals();
  }, [childId]);

  const loadIEPGoals = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockGoals: IEPGoal[] = [
        {
          id: '1',
          title: 'Reading Comprehension',
          description: 'Student will improve reading comprehension skills to grade level',
          category: 'academic',
          targetDate: '2025-06-01',
          status: 'on-track',
          currentProgress: 75,
          targetProgress: 100,
          milestones: [
            {
              id: '1',
              title: 'Read 3rd grade level books',
              description: 'Demonstrate comprehension of 3rd grade level texts',
              targetDate: '2025-03-01',
              completed: true,
              completedDate: '2025-02-28'
            },
            {
              id: '2',
              title: 'Answer comprehension questions',
              description: 'Answer 80% of comprehension questions correctly',
              targetDate: '2025-05-01',
              completed: false
            }
          ],
          dataPoints: [
            {
              id: '1',
              date: '2025-01-15',
              value: 45,
              notes: 'Baseline assessment',
              enteredBy: 'Ms. Johnson',
              type: 'assessment'
            },
            {
              id: '2',
              date: '2025-02-15',
              value: 60,
              notes: 'Showing improvement in phonics',
              enteredBy: 'Ms. Johnson',
              type: 'observation'
            },
            {
              id: '3',
              date: '2025-03-15',
              value: 75,
              notes: 'Met milestone for 3rd grade reading',
              enteredBy: 'Ms. Johnson',
              type: 'milestone'
            }
          ]
        },
        {
          id: '2',
          title: 'Social Interaction Skills',
          description: 'Student will demonstrate appropriate social skills with peers',
          category: 'social',
          targetDate: '2025-06-01',
          status: 'at-risk',
          currentProgress: 45,
          targetProgress: 100,
          milestones: [
            {
              id: '3',
              title: 'Initiate peer interactions',
              description: 'Initiate conversations with peers 3 times per day',
              targetDate: '2025-04-01',
              completed: false
            }
          ],
          dataPoints: [
            {
              id: '4',
              date: '2025-01-15',
              value: 25,
              notes: 'Baseline observation',
              enteredBy: 'Ms. Smith',
              type: 'observation'
            },
            {
              id: '5',
              date: '2025-03-15',
              value: 45,
              notes: 'Some improvement noted',
              enteredBy: 'Ms. Smith',
              type: 'observation'
            }
          ]
        }
      ];
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error loading IEP goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'ahead': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return '📚';
      case 'behavioral': return '🎯';
      case 'social': return '👥';
      case 'communication': return '💬';
      case 'motor': return '🏃';
      default: return '📋';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filterCategory !== 'all' && goal.category !== filterCategory) return false;
    if (filterStatus !== 'all' && goal.status !== filterStatus) return false;
    return true;
  });

  const handleProgressEntry = (goalId: string, value: number, notes: string) => {
    const newDataPoint: ProgressDataPoint = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      value,
      notes,
      enteredBy: 'Parent',
      type: 'observation'
    };

    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentProgress: value,
          dataPoints: [...goal.dataPoints, newDataPoint]
        };
      }
      return goal;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">IEP Progress Tracking</h2>
          <p className="text-gray-600">Monitor your child's progress towards IEP goals</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Progress report export - Feature coming soon!')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button 
            onClick={() => setShowProgressEntry(true)}
            className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg text-sm font-medium hover:bg-coral-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Progress Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center p-4 bg-white rounded-lg border border-gray-200">
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="behavioral">Behavioral</option>
            <option value="social">Social</option>
            <option value="communication">Communication</option>
            <option value="motor">Motor Skills</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Statuses</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="ahead">Ahead</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map(goal => (
          <div
            key={goal.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedGoal(goal)}
          >
            {/* Goal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                {goal.status.replace('-', ' ')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{goal.currentProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-coral-500 h-2 rounded-full transition-all"
                  style={{ width: `${goal.currentProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Goal Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{goal.milestones.length} milestones</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{goal.dataPoints.length} data points</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600">No IEP goals match your current filters.</p>
        </div>
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onUpdateProgress={handleProgressEntry}
        />
      )}

      {/* Progress Entry Modal */}
      {showProgressEntry && (
        <ProgressEntryModal
          goals={goals}
          onClose={() => setShowProgressEntry(false)}
          onSubmit={handleProgressEntry}
        />
      )}
    </div>
  );
};

// Goal Detail Modal Component
interface GoalDetailModalProps {
  goal: IEPGoal;
  onClose: () => void;
  onUpdateProgress: (goalId: string, value: number, notes: string) => void;
}

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'data'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
              <p className="text-gray-600 mt-1">{goal.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'milestones', label: 'Milestones' },
              { id: 'data', label: 'Progress Data' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-coral-500 text-coral-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Progress Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress</span>
                    <span className="font-medium">{goal.currentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-coral-500 h-3 rounded-full transition-all"
                      style={{ width: `${goal.currentProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Recent Data Points */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Recent Progress Entries</h3>
                <div className="space-y-3">
                  {goal.dataPoints.slice(-3).map(point => (
                    <div key={point.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{point.value}%</div>
                        <div className="text-sm text-gray-600">{point.notes}</div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{new Date(point.date).toLocaleDateString()}</div>
                        <div>{point.enteredBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {goal.milestones.map(milestone => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 ${
                      milestone.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {milestone.completed && (
                        <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                        {milestone.completed && milestone.completedDate && (
                          <span className="text-green-600">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              {goal.dataPoints.map(point => (
                <div key={point.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{point.value}%</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          point.type === 'assessment' ? 'bg-blue-100 text-blue-800' :
                          point.type === 'milestone' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {point.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{point.notes}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{new Date(point.date).toLocaleDateString()}</div>
                      <div>{point.enteredBy}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Entry Modal Component
interface ProgressEntryModalProps {
  goals: IEPGoal[];
  onClose: () => void;
  onSubmit: (goalId: string, value: number, notes: string) => void;
}

const ProgressEntryModal: React.FC<ProgressEntryModalProps> = ({ goals, onClose, onSubmit }) => {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoalId && value && notes) {
      onSubmit(selectedGoalId, parseInt(value), notes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Progress Entry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Goal
              </label>
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                required
              >
                <option value="">Choose a goal...</option>
                {goals.map(goal => (
                  <option key={goal.id} value={goal.id}>{goal.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Value (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                placeholder="Add notes about this progress entry..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                Add Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IEPProgressTracking;
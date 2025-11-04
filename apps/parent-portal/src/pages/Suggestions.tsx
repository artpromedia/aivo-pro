import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Brain,
  Target,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowLeft,
  Filter,
  Calendar,
  User,
  Zap,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@aivo/ui';

interface AISuggestion {
  id: string;
  type: 'learning_path' | 'break_recommendation' | 'content_adjustment' | 'goal_modification' | 'behavioral_support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  reasoning: string;
  child: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  createdAt: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  confidence: number;
  category: string;
  evidence: string[];
  recommendedActions: string[];
}

export const Suggestions: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChild, setFilterChild] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [feedbackModal, setFeedbackModal] = useState<{open: boolean, suggestionId: string, type: 'approve' | 'reject' | 'adjust'}>({open: false, suggestionId: '', type: 'approve'});
  const [feedbackText, setFeedbackText] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const suggestions: AISuggestion[] = [
    {
      id: '1',
      type: 'learning_path',
      priority: 'high',
      title: 'Advance Emma to Grade 5 Mathematics',
      description: 'Emma consistently scores above 90% on Grade 4 math assessments and shows mastery of key concepts.',
      reasoning: 'Based on 15 consecutive high-scoring sessions and pattern recognition abilities',
      child: { id: 'emma-id', name: 'Emma' },
      status: 'pending',
      createdAt: '2024-11-03',
      estimatedImpact: 'high',
      confidence: 94,
      category: 'Academic Advancement',
      evidence: [
        'Scored 95% on fraction assessments for 3 weeks',
        'Completed multiplication tables 2 weeks ahead of schedule',
        'Shows excitement when given challenging problems'
      ],
      recommendedActions: [
        'Start with Grade 5 number theory concepts',
        'Introduce basic algebra concepts',
        'Maintain current learning pace with increased complexity'
      ]
    },
    {
      id: '2',
      type: 'break_recommendation',
      priority: 'medium',
      title: 'Implement 10-minute Activity Breaks',
      description: 'Attention metrics suggest Emma would benefit from shorter learning sessions with movement breaks.',
      reasoning: 'Attention span decreases after 20 minutes, but recovers quickly with brief breaks',
      child: { id: 'emma-id', name: 'Emma' },
      status: 'pending',
      createdAt: '2024-11-02',
      estimatedImpact: 'medium',
      confidence: 87,
      category: 'Learning Optimization',
      evidence: [
        'Focus decreases by 40% after 20 minutes',
        'Restlessness indicators increase in longer sessions',
        'Performance improves significantly after breaks'
      ],
      recommendedActions: [
        'Schedule 10-minute breaks every 20 minutes',
        'Include physical movement activities',
        'Use transition activities between subjects'
      ]
    },
    {
      id: '3',
      type: 'content_adjustment',
      priority: 'medium',
      title: 'Add Visual Elements to Reading Comprehension',
      description: 'Emma responds better to text with visual aids and graphic organizers.',
      reasoning: 'Reading comprehension scores increase 25% when visual supports are provided',
      child: { id: 'emma-id', name: 'Emma' },
      status: 'approved',
      createdAt: '2024-11-01',
      estimatedImpact: 'medium',
      confidence: 91,
      category: 'Content Adaptation',
      evidence: [
        'Visual learner profile confirmed through assessments',
        'Higher engagement with illustrated texts',
        'Better retention with graphic organizers'
      ],
      recommendedActions: [
        'Use books with illustrations and diagrams',
        'Incorporate mind maps for story analysis',
        'Add visual vocabulary cards'
      ]
    },
    {
      id: '4',
      type: 'behavioral_support',
      priority: 'high',
      title: 'Social Skills Practice Sessions',
      description: 'Emma would benefit from structured peer interaction opportunities to build confidence.',
      reasoning: 'Shows hesitation in group activities but excels in one-on-one interactions',
      child: { id: 'emma-id', name: 'Emma' },
      status: 'pending',
      createdAt: '2024-10-31',
      estimatedImpact: 'high',
      confidence: 78,
      category: 'Social Development',
      evidence: [
        'Prefers individual activities over group work',
        'Shows leadership qualities in paired activities',
        'Needs encouragement to share ideas with class'
      ],
      recommendedActions: [
        'Start with small group activities (2-3 children)',
        'Assign leadership roles in structured activities',
        'Practice presentation skills with family first'
      ]
    },
    {
      id: '5',
      type: 'goal_modification',
      priority: 'low',
      title: 'Extend Creative Writing Goals',
      description: 'Emma exceeds current writing goals and shows creative storytelling ability.',
      reasoning: 'Consistently writes above grade level with rich vocabulary and imagination',
      child: { id: 'emma-id', name: 'Emma' },
      status: 'rejected',
      createdAt: '2024-10-30',
      estimatedImpact: 'medium',
      confidence: 85,
      category: 'Goal Adjustment',
      evidence: [
        'Stories average 50% longer than target length',
        'Uses advanced vocabulary appropriately',
        'Shows original plot development skills'
      ],
      recommendedActions: [
        'Introduce poetry writing exercises',
        'Explore different narrative styles',
        'Add character development techniques'
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'learning_path': return TrendingUp;
      case 'break_recommendation': return Clock;
      case 'content_adjustment': return BookOpen;
      case 'goal_modification': return Target;
      case 'behavioral_support': return Brain;
      default: return Sparkles;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'implemented': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSuggestionAction = (suggestionId: string, action: 'approve' | 'reject' | 'adjust') => {
    setFeedbackModal({open: true, suggestionId, type: action});
  };

  const handleSubmitFeedback = () => {
    console.log(`${feedbackModal.type} suggestion ${feedbackModal.suggestionId}`, {
      feedback: feedbackText,
      adjustment: adjustmentReason
    });
    // API call would go here
    setFeedbackModal({open: false, suggestionId: '', type: 'approve'});
    setFeedbackText('');
    setAdjustmentReason('');
  };

  const toggleMenu = (suggestionId: string) => {
    const newSet = new Set(expandedMenus);
    if (newSet.has(suggestionId)) {
      newSet.delete(suggestionId);
    } else {
      newSet.add(suggestionId);
    }
    setExpandedMenus(newSet);
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterStatus !== 'all' && suggestion.status !== filterStatus) return false;
    if (filterChild !== 'all' && suggestion.child.id !== filterChild) return false;
    if (filterType !== 'all' && suggestion.type !== filterType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-coral-50 p-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/dashboard"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-coral-600" />
                <span className="text-sm font-medium text-coral-600">AI Recommendations</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
                Learning Suggestions
              </h1>
              <p className="text-gray-600 mt-1">
                AI-powered recommendations to optimize your child's learning experience
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Review', value: suggestions.filter(s => s.status === 'pending').length, color: 'from-yellow-400 to-orange-500' },
            { label: 'Approved', value: suggestions.filter(s => s.status === 'approved').length, color: 'from-green-400 to-green-600' },
            { label: 'High Priority', value: suggestions.filter(s => s.priority === 'high').length, color: 'from-red-400 to-red-600' },
            { label: 'High Impact', value: suggestions.filter(s => s.estimatedImpact === 'high').length, color: 'from-purple-400 to-purple-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/20">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="implemented">Implemented</option>
            </select>

            <select
              value={filterChild}
              onChange={(e) => setFilterChild(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              <option value="all">All Children</option>
              <option value="emma-id">Emma</option>
              <option value="noah-id">Noah</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="learning_path">Learning Path</option>
              <option value="break_recommendation">Break Schedule</option>
              <option value="content_adjustment">Content</option>
              <option value="goal_modification">Goals</option>
              <option value="behavioral_support">Behavioral</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              {filteredSuggestions.length} of {suggestions.length} suggestions
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const TypeIcon = getTypeIcon(suggestion.type);
            
            return (
              <motion.div
                key={suggestion.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-coral-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-coral-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{suggestion.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                            {suggestion.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{suggestion.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{suggestion.child.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            <span>{suggestion.confidence}% confidence</span>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                            {suggestion.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {suggestion.status === 'pending' && (
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSuggestionAction(suggestion.id, 'reject')}
                            className="inline-flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleSuggestionAction(suggestion.id, 'approve')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 border border-white/20"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(suggestion.id)}
                              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white border-2 border-gray-200 hover:border-gray-300"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {expandedMenus.has(suggestion.id) && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 py-3 min-w-[220px] z-50"
                              >
                                <button
                                  onClick={() => {
                                    handleSuggestionAction(suggestion.id, 'adjust');
                                    toggleMenu(suggestion.id);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-purple-700"
                                >
                                  <Target className="w-4 h-4" />
                                  Request Adjustment
                                </button>
                                <button
                                  onClick={() => {
                                    setFeedbackModal({open: true, suggestionId: suggestion.id, type: 'approve'});
                                    toggleMenu(suggestion.id);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-coral-50 transition-colors flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-coral-700"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Provide Feedback
                                </button>
                                <button
                                  onClick={() => toggleMenu(suggestion.id)}
                                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-blue-700"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Full Details
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">AI Reasoning:</span> {suggestion.reasoning}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Evidence:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {suggestion.evidence.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-coral-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {suggestion.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">→</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Impact & Confidence */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Expected Impact:</span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          suggestion.estimatedImpact === 'high' ? 'bg-green-100 text-green-700' :
                          suggestion.estimatedImpact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {suggestion.estimatedImpact}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">AI Confidence:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-coral-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${suggestion.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{suggestion.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comment
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new AI recommendations.</p>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal.open && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setFeedbackModal({open: false, suggestionId: '', type: 'approve'})}
          >
            <motion.div 
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  feedbackModal.type === 'approve' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  feedbackModal.type === 'reject' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  {feedbackModal.type === 'approve' ? <CheckCircle className="w-8 h-8 text-white" /> :
                   feedbackModal.type === 'reject' ? <XCircle className="w-8 h-8 text-white" /> :
                   <Target className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feedbackModal.type === 'approve' ? 'Approve Suggestion' :
                   feedbackModal.type === 'reject' ? 'Reject Suggestion' :
                   'Request Adjustment'}
                </h3>
                <p className="text-gray-600">
                  {feedbackModal.type === 'approve' ? 'Add any comments about this approval' :
                   feedbackModal.type === 'reject' ? 'Help us understand why you\'re rejecting this suggestion' :
                   'What changes would you like to see in this recommendation?'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {feedbackModal.type === 'adjust' ? 'Adjustment Request' : 'Your Feedback'}
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={feedbackModal.type === 'adjust' ? 
                      'Describe what changes you\'d like to see...' :
                      'Share your thoughts or concerns...'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent resize-none h-24 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                
                {feedbackModal.type === 'adjust' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Adjustment
                    </label>
                    <select
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                    >
                      <option value="">Select a reason</option>
                      <option value="timing">Timing is not right</option>
                      <option value="difficulty">Difficulty level needs adjustment</option>
                      <option value="method">Different approach needed</option>
                      <option value="goals">Doesn't align with our goals</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setFeedbackModal({open: false, suggestionId: '', type: 'approve'})}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className={`flex-1 px-6 py-3 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg ${
                    feedbackModal.type === 'approve' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                    feedbackModal.type === 'reject' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                    'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                  }`}
                >
                  {feedbackModal.type === 'approve' ? 'Approve' :
                   feedbackModal.type === 'reject' ? 'Reject' :
                   'Submit Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle,
  Calendar, 
  ChevronDown,
  ChevronUp,
  Clock, 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  X,
  Play,
  User,
  Phone,
  Mail,
  Download,
  Bell,
  Send
} from 'lucide-react';
import { Button } from '@aivo/ui';

interface EvaluationRequest {
  id: string;
  childId: string;
  type: 'psychological' | 'speech-language' | 'occupational' | 'physical' | 'educational' | 'behavioral';
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'scheduled' | 'in-progress' | 'completed' | 'declined' | 'pending' | 'responded' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  dueDate: string;
  scheduledDate?: string;
  completedDate?: string;
  requestedBy: string;
  assignedTo?: string;
  reason: string;
  consentRequired: boolean;
  consentGiven?: boolean;
  consentDate?: string;
  evaluationAreas: string[];
  estimatedDuration?: string;
  additionalNotes?: string;
  parentResponse?: {
    response: 'consent' | 'decline';
    responseDate: string;
    comments?: string;
  };
  timeline: EvaluationTimeline[];
  documents: EvaluationDocument[];
  notifications: EvaluationNotification[];
}

interface EvaluationTimeline {
  id: string;
  date: string;
  event: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  responsible: string;
}

interface EvaluationDocument {
  id: string;
  name: string;
  type: 'consent' | 'report' | 'assessment' | 'notes';
  uploadDate: string;
  url: string;
  status: 'pending' | 'available';
}

interface EvaluationNotification {
  id: string;
  type: 'reminder' | 'update' | 'action-required';
  message: string;
  date: string;
  read: boolean;
}

interface EvaluationRequestCardProps {
  request: EvaluationRequest;
  onResponseSubmit: (response: 'consent' | 'decline', comment?: string) => void;
  onViewDetails: () => void;
}

const EvaluationRequestCard: React.FC<EvaluationRequestCardProps> = ({ 
  request, 
  onResponseSubmit, 
  onViewDetails 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseType, setResponseType] = useState<'consent' | 'decline' | null>(null);
  const [parentComment, setParentComment] = useState('');

  const handleResponse = () => {
    if (responseType) {
      onResponseSubmit(responseType, parentComment.trim() || undefined);
      setShowResponseModal(false);
      setParentComment('');
      setResponseType(null);
    }
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'responded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = new Date(request.dueDate) < new Date() && request.status === 'pending';
  const daysUntilDue = Math.ceil((new Date(request.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
          isOverdue ? 'border-red-200' : 'border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon()}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Overdue
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
              <p className="text-gray-600 mb-4">{request.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Requested by: {request.requestedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                    Due: {new Date(request.dueDate).toLocaleDateString()}
                    {daysUntilDue > 0 && !isOverdue && (
                      <span className="ml-1 text-amber-600">({daysUntilDue} days left)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100"
            >
              <div className="p-6 space-y-4">
                {/* Evaluation Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Evaluation Areas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.evaluationAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                {request.additionalNotes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Information:</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{request.additionalNotes}</p>
                  </div>
                )}

                {/* Parent Response */}
                {request.parentResponse && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Response:</h4>
                    <div className={`p-3 rounded-lg ${
                      request.parentResponse.response === 'consent' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {request.parentResponse.response === 'consent' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          request.parentResponse.response === 'consent' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {request.parentResponse.response === 'consent' ? 'Consent Given' : 'Consent Declined'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          on {new Date(request.parentResponse.responseDate).toLocaleDateString()}
                        </span>
                      </div>
                      {request.parentResponse.comments && (
                        <p className="text-gray-700 text-sm">{request.parentResponse.comments}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
            
            {request.status === 'pending' && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResponseType('decline');
                    setShowResponseModal(true);
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Decline
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => {
                    setResponseType('consent');
                    setShowResponseModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Give Consent
                </Button>
              </div>
            )}

            {request.status === 'responded' && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Response
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {responseType === 'consent' ? 'Give Consent' : 'Decline Consent'}
              </h3>
              
              <div className={`p-4 rounded-lg mb-4 ${
                responseType === 'consent' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {responseType === 'consent' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    responseType === 'consent' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {responseType === 'consent' ? 'Providing Consent' : 'Declining Consent'}
                  </span>
                </div>
                <p className={`text-sm ${
                  responseType === 'consent' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {responseType === 'consent' 
                    ? 'You are giving permission for the requested evaluation to proceed.'
                    : 'You are declining permission for the requested evaluation.'
                  }
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={parentComment}
                  onChange={(e) => setParentComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any comments or questions..."
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResponseModal(false);
                    setParentComment('');
                    setResponseType(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResponse}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    responseType === 'consent' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Response
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface EvaluationRequestSystemProps {
  childId: string;
}

const EvaluationRequestSystem: React.FC<EvaluationRequestSystemProps> = ({ childId }) => {
  // Mock data - replace with actual API calls
  const [evaluationRequests, setEvaluationRequests] = useState<EvaluationRequest[]>([
    {
      id: '1',
      childId,
      type: 'educational',
      title: 'Comprehensive Educational Evaluation',
      description: 'A comprehensive evaluation to assess your child\'s academic and behavioral needs.',
      requestedBy: 'Ms. Sarah Thompson - Special Education Coordinator',
      requestDate: '2025-10-15',
      dueDate: '2025-11-30',
      status: 'pending',
      priority: 'high',
      reason: 'Annual review to determine continued eligibility and service needs.',
      consentRequired: true,
      consentGiven: false,
      evaluationAreas: [
        'Academic Achievement',
        'Cognitive Abilities',
        'Behavioral Assessment',
        'Social-Emotional Development'
      ],
      estimatedDuration: '4-6 weeks',
      additionalNotes: 'This evaluation will help determine appropriate educational services and supports.',
      timeline: [],
      documents: [],
      notifications: []
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<EvaluationRequest | null>(null);
  const [actionToast, setActionToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!actionToast) return;
    const timeout = window.setTimeout(() => setActionToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [actionToast]);

  const handleResponseSubmit = (requestId: string, response: 'consent' | 'decline', comment?: string) => {
    let updatedRequest: EvaluationRequest | null = null;
    const responseDate = new Date().toISOString();

    setEvaluationRequests((prev) =>
      prev.map((request) => {
        if (request.id !== requestId) {
          return request;
        }

        updatedRequest = {
          ...request,
          status: response === 'consent' ? 'responded' : 'declined',
          parentResponse: {
            response,
            responseDate,
            comments: comment,
          },
          timeline: [
            ...request.timeline,
            {
              id: `response-${Date.now()}`,
              date: responseDate,
              event: response === 'consent' ? 'Parent provided consent' : 'Parent declined evaluation',
              description: comment || (response === 'consent' ? 'Consent confirmed via parent portal.' : 'Declined evaluation via parent portal.'),
              status: 'completed',
              responsible: 'Parent/Guardian',
            },
          ],
          notifications: [
            ...request.notifications,
            {
              id: `notify-${Date.now()}`,
              type: 'update',
              message: response === 'consent' ? 'You granted consent. The team has been notified.' : 'You declined the evaluation request. A coordinator will follow up.',
              date: responseDate,
              read: false,
            },
          ],
        };

        return updatedRequest;
      })
    );

    if (updatedRequest) {
      setSelectedRequest((current) => (current && current.id === updatedRequest?.id ? updatedRequest : current));
      setActionToast({
        type: response === 'consent' ? 'success' : 'info',
        message:
          response === 'consent'
            ? 'Thanks! Consent has been shared with the school team.'
            : 'Your response has been recorded. We will follow up with next steps.',
      });
    }
  };

  const handleViewDetails = (requestId: string) => {
    const request = evaluationRequests.find((item) => item.id === requestId) || null;
    if (!request) return;

    setEvaluationRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? {
              ...item,
              notifications: item.notifications.map((note) => ({ ...note, read: true })),
            }
          : item
      )
    );

    setSelectedRequest({
      ...request,
      notifications: request.notifications.map((note) => ({ ...note, read: true })),
    });
  };

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'responded' | 'expired'>('all');

  const filteredRequests = evaluationRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const pendingCount = evaluationRequests.filter(r => r.status === 'pending').length;
  const overdueCount = evaluationRequests.filter(r => 
    r.status === 'pending' && new Date(r.dueDate) < new Date()
  ).length;

  const selectedRequestContact = useMemo(() => {
    if (!selectedRequest) return null;
    return {
      coordinator: selectedRequest.requestedBy,
      phone: '(555) 123-4567',
      email: 'specialed@aivoschools.org',
    };
  }, [selectedRequest]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Requests</p>
              <p className="text-2xl font-bold">{evaluationRequests.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Pending Response</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <p className="text-2xl font-bold">{overdueCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {[
          { key: 'all', label: 'All Requests', count: evaluationRequests.length },
          { key: 'pending', label: 'Pending', count: pendingCount },
          { key: 'responded', label: 'Responded', count: evaluationRequests.filter(r => r.status === 'responded').length },
          { key: 'expired', label: 'Expired', count: evaluationRequests.filter(r => r.status === 'expired').length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key as 'all' | 'pending' | 'scheduled' | 'completed')}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              filterStatus === key
                ? 'text-coral-600 border-b-2 border-coral-600 bg-coral-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Evaluation Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No evaluation requests</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? "You don't have any evaluation requests at this time."
                : `No ${filterStatus} evaluation requests found.`
              }
            </p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <EvaluationRequestCard
              key={request.id}
              request={request}
              onResponseSubmit={(response, comment) => handleResponseSubmit(request.id, response, comment)}
              onViewDetails={() => handleViewDetails(request.id)}
            />
          ))
        )}
      </div>

      <AnimatePresence>
        {actionToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-6 right-6 z-40 rounded-xl px-4 py-3 shadow-lg text-sm font-medium ${
              actionToast.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : actionToast.type === 'info'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {actionToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Evaluation Request</p>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRequest.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">Requested by {selectedRequest.requestedBy}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid md:grid-cols-[2fr_1fr] gap-6 p-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-6">
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Purpose</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                        <Calendar className="w-3.5 h-3.5" /> Requested {new Date(selectedRequest.requestDate).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                        selectedRequest.status === 'responded'
                          ? 'bg-green-50 text-green-700'
                          : selectedRequest.status === 'declined'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5" /> Status: {selectedRequest.status.replace('-', ' ')}
                      </span>
                    </div>
                  </section>

                  {selectedRequest.parentResponse && (
                    <section className="rounded-2xl border border-green-200 bg-green-50 p-4">
                      <h3 className="text-sm font-semibold text-green-900 uppercase tracking-wide mb-2">Parent Response</h3>
                      <p className="text-sm text-green-800 mb-2">
                        You {selectedRequest.parentResponse.response === 'consent' ? 'granted consent' : 'declined this request'} on{' '}
                        {new Date(selectedRequest.parentResponse.responseDate).toLocaleDateString()}.
                      </p>
                      {selectedRequest.parentResponse.comments && (
                        <p className="text-sm text-green-900 italic">“{selectedRequest.parentResponse.comments}”</p>
                      )}
                    </section>
                  )}

                  <section>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Evaluation Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.evaluationAreas.map((area) => (
                        <span key={area} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-coral-500" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Reason for Referral</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.reason}</p>
                  </section>

                  {selectedRequest.timeline.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Timeline</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedRequest.timeline.map((event) => (
                          <div key={event.id} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                            <div className={`mt-1 h-2 w-2 rounded-full ${
                              event.status === 'completed'
                                ? 'bg-green-500'
                                : event.status === 'current'
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{event.event}</p>
                              <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} • {event.responsible}</p>
                              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedRequest.documents.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Documents</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedRequest.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            </div>
                            <button
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                              onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                            >
                              <Download className="w-4 h-4" /> View
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <aside className="space-y-6">
                  <section className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">How to Respond</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Let the school know if you consent to this evaluation, or share any concerns below.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="gradient" onClick={() => handleResponseSubmit(selectedRequest.id, 'consent')}>
                        Provide Consent
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleResponseSubmit(selectedRequest.id, 'decline')}>
                        Decline Request
                      </Button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Support Team</h3>
                    {selectedRequestContact && (
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-coral-500" />
                          {selectedRequestContact.coordinator}
                        </div>
                        <a href={`tel:${selectedRequestContact.phone}`} className="flex items-center gap-2 text-coral-600 hover:text-coral-700">
                          <Phone className="w-4 h-4" /> {selectedRequestContact.phone}
                        </a>
                        <a href={`mailto:${selectedRequestContact.email}`} className="flex items-center gap-2 text-coral-600 hover:text-coral-700">
                          <Mail className="w-4 h-4" /> {selectedRequestContact.email}
                        </a>
                      </div>
                    )}
                  </section>

                  {selectedRequest.notifications.length > 0 && (
                    <section className="rounded-2xl border border-coral-200 bg-coral-50/60 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="w-4 h-4 text-coral-500" />
                        <h3 className="text-sm font-semibold text-coral-700 uppercase tracking-wide">Updates</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedRequest.notifications.map((note) => (
                          <li key={note.id} className="text-xs text-coral-800 flex items-start gap-2">
                            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-coral-400" />
                            <div>
                              <p>{note.message}</p>
                              <p className="text-[11px] text-coral-600 mt-0.5">
                                {new Date(note.date).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </aside>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvaluationRequestSystem;
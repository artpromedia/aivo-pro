import React from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  FileText, 
  Video, 
  Edit, 
  Trash2, 
  Copy,
  Bell
} from 'lucide-react';

interface MeetingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    id: string;
    date: string;
    type: string;
    participants: string[];
    location?: string;
    duration?: number;
    agenda?: string[];
    notes?: string;
    isVirtual?: boolean;
    meetingLink?: string;
  };
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ isOpen, onClose, meeting }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleCopyMeetingLink = () => {
    if (meeting.meetingLink) {
      navigator.clipboard.writeText(meeting.meetingLink);
      alert('Meeting link copied to clipboard!');
    }
  };

  const handleReschedule = () => {
    alert('Reschedule meeting functionality would be implemented here');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      alert('Meeting cancelled. Notifications will be sent to all participants.');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-coral-100 rounded-lg">
              <Calendar className="w-6 h-6 text-coral-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{meeting.type}</h2>
              <p className="text-sm text-gray-600">Meeting Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date & Time</p>
                    <p className="text-gray-900">{formatDate(meeting.date)}</p>
                  </div>
                </div>

                {meeting.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-gray-900">{meeting.duration} minutes</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meeting Type</p>
                    <p className="text-gray-900">{meeting.type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {meeting.isVirtual ? (
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Virtual Meeting</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">Online</span>
                        {meeting.meetingLink && (
                          <button
                            onClick={handleCopyMeetingLink}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{meeting.location || 'TBD'}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Participants</p>
                    <p className="text-gray-900">{meeting.participants.length} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meeting.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-coral-500 rounded-full"></div>
                      <span className="text-gray-700">{participant}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agenda */}
            {meeting.agenda && meeting.agenda.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Agenda</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-2">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Virtual Meeting Link */}
            {meeting.isVirtual && meeting.meetingLink && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Meeting Link</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-blue-800 break-all">{meeting.meetingLink}</code>
                    <button
                      onClick={handleCopyMeetingLink}
                      className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {meeting.notes && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{meeting.notes}</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => alert('Add to calendar functionality would be implemented here')}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </button>
                <button
                  onClick={() => alert('Send reminder functionality would be implemented here')}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Send Reminder
                </button>
                {meeting.isVirtual && meeting.meetingLink && (
                  <button
                    onClick={() => window.open(meeting.meetingLink, '_blank')}
                    className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handleReschedule}
              className="inline-flex items-center px-4 py-2 text-coral-700 border border-coral-300 rounded-lg hover:bg-coral-50 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Reschedule
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
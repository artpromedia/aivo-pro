import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Video,
  Plus, 
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface IEPMeeting {
  id: string;
  title: string;
  type: 'initial' | 'annual' | 'review' | 'amendment' | '3-year' | 'transition' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  dateTime: string;
  duration: number; // in minutes
  location: {
    type: 'in-person' | 'virtual' | 'hybrid';
    address?: string;
    room?: string;
    virtualLink?: string;
    dialIn?: string;
  };
  organizer: {
    name: string;
    email: string;
    role: string;
  };
  attendees: MeetingAttendee[];
  agenda: AgendaItem[];
  documents: MeetingDocument[];
  notes?: string;
  followUpActions: FollowUpAction[];
  notifications: MeetingNotification[];
  createdDate: string;
  lastModified: string;
}

interface MeetingAttendee {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'teacher' | 'specialist' | 'administrator' | 'student' | 'advocate' | 'other';
  status: 'invited' | 'accepted' | 'declined' | 'tentative' | 'no-response';
  required: boolean;
  notifications: boolean;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  presenter: string;
  documents?: string[];
  completed?: boolean;
  notes?: string;
}

interface MeetingDocument {
  id: string;
  name: string;
  type: 'agenda' | 'iep' | 'evaluation' | 'progress-report' | 'other';
  url: string;
  uploadedBy: string;
  uploadDate: string;
}

interface FollowUpAction {
  id: string;
  task: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

interface MeetingNotification {
  id: string;
  type: 'reminder' | 'update' | 'cancellation' | 'rescheduled';
  message: string;
  sentDate: string;
  recipients: string[];
}

interface IEPMeetingSchedulerProps {
  childId: string;
}

const IEPMeetingScheduler: React.FC<IEPMeetingSchedulerProps> = ({ childId }) => {
  const [meetings, setMeetings] = useState<IEPMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<IEPMeeting | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, [childId]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMeetings: IEPMeeting[] = [
        {
          id: '1',
          title: 'Annual IEP Review Meeting',
          type: 'annual',
          status: 'scheduled',
          dateTime: '2025-11-15T10:00:00Z',
          duration: 90,
          location: {
            type: 'hybrid',
            address: 'Lincoln Elementary School',
            room: 'Conference Room A',
            virtualLink: 'https://meet.school.edu/iep-meeting-123',
            dialIn: '+1-555-0123, Code: 456789'
          },
          organizer: {
            name: 'Ms. Sarah Thompson',
            email: 's.thompson@school.edu',
            role: 'Special Education Coordinator'
          },
          attendees: [
            {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@email.com',
              role: 'parent',
              status: 'accepted',
              required: true,
              notifications: true
            },
            {
              id: '2',
              name: 'Ms. Jennifer Roberts',
              email: 'j.roberts@school.edu',
              role: 'teacher',
              status: 'accepted',
              required: true,
              notifications: true
            },
            {
              id: '3',
              name: 'Dr. Emily Rodriguez',
              email: 'e.rodriguez@district.edu',
              role: 'specialist',
              status: 'tentative',
              required: true,
              notifications: true
            },
            {
              id: '4',
              name: 'Alex Johnson',
              email: '',
              role: 'student',
              status: 'invited',
              required: false,
              notifications: false
            },
            {
              id: '5',
              name: 'Principal Mark Davis',
              email: 'm.davis@school.edu',
              role: 'administrator',
              status: 'accepted',
              required: false,
              notifications: true
            }
          ],
          agenda: [
            {
              id: '1',
              title: 'Welcome and Introductions',
              description: 'Team introductions and meeting overview',
              duration: 10,
              presenter: 'Ms. Sarah Thompson'
            },
            {
              id: '2',
              title: 'Review Current IEP Goals',
              description: 'Assessment of progress on current IEP goals and objectives',
              duration: 30,
              presenter: 'Ms. Jennifer Roberts',
              documents: ['current-iep.pdf', 'progress-report.pdf']
            },
            {
              id: '3',
              title: 'Assessment Results',
              description: 'Review of recent psychological and academic assessments',
              duration: 20,
              presenter: 'Dr. Emily Rodriguez',
              documents: ['psych-eval.pdf']
            },
            {
              id: '4',
              title: 'Parent Input and Concerns',
              description: 'Parent perspectives and concerns about student progress',
              duration: 15,
              presenter: 'Sarah Johnson'
            },
            {
              id: '5',
              title: 'New Goals Development',
              description: 'Development of new IEP goals and objectives for next year',
              duration: 25,
              presenter: 'IEP Team'
            },
            {
              id: '6',
              title: 'Service Provisions',
              description: 'Review and update special education services',
              duration: 15,
              presenter: 'Ms. Sarah Thompson'
            },
            {
              id: '7',
              title: 'Meeting Summary and Next Steps',
              description: 'Summary of decisions and follow-up actions',
              duration: 10,
              presenter: 'Ms. Sarah Thompson'
            }
          ],
          documents: [
            {
              id: '1',
              name: 'Meeting Agenda',
              type: 'agenda',
              url: '/documents/meeting-agenda.pdf',
              uploadedBy: 'Ms. Sarah Thompson',
              uploadDate: '2025-11-01'
            },
            {
              id: '2',
              name: 'Current IEP Document',
              type: 'iep',
              url: '/documents/current-iep.pdf',
              uploadedBy: 'Ms. Sarah Thompson',
              uploadDate: '2025-11-01'
            },
            {
              id: '3',
              name: 'Progress Report',
              type: 'progress-report',
              url: '/documents/progress-report.pdf',
              uploadedBy: 'Ms. Jennifer Roberts',
              uploadDate: '2025-11-05'
            }
          ],
          followUpActions: [],
          notifications: [
            {
              id: '1',
              type: 'reminder',
              message: 'IEP meeting reminder - 24 hours',
              sentDate: '2025-11-14T10:00:00Z',
              recipients: ['sarah.johnson@email.com', 'j.roberts@school.edu']
            }
          ],
          createdDate: '2025-10-15',
          lastModified: '2025-11-05'
        },
        {
          id: '2',
          title: 'IEP Progress Review',
          type: 'review',
          status: 'completed',
          dateTime: '2025-09-15T14:00:00Z',
          duration: 60,
          location: {
            type: 'in-person',
            address: 'Lincoln Elementary School',
            room: 'Room 205'
          },
          organizer: {
            name: 'Ms. Sarah Thompson',
            email: 's.thompson@school.edu',
            role: 'Special Education Coordinator'
          },
          attendees: [
            {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah.johnson@email.com',
              role: 'parent',
              status: 'accepted',
              required: true,
              notifications: true
            },
            {
              id: '2',
              name: 'Ms. Jennifer Roberts',
              email: 'j.roberts@school.edu',
              role: 'teacher',
              status: 'accepted',
              required: true,
              notifications: true
            }
          ],
          agenda: [
            {
              id: '1',
              title: 'Progress Review',
              description: 'Review progress on reading and math goals',
              duration: 45,
              presenter: 'Ms. Jennifer Roberts',
              completed: true,
              notes: 'Alex is making good progress in reading, needs more support in math'
            },
            {
              id: '2',
              title: 'Service Adjustments',
              description: 'Discuss potential service modifications',
              duration: 15,
              presenter: 'Ms. Sarah Thompson',
              completed: true,
              notes: 'Agreed to increase math support from 2x to 3x per week'
            }
          ],
          documents: [],
          followUpActions: [
            {
              id: '1',
              task: 'Increase math support frequency',
              assignedTo: 'Ms. Jennifer Roberts',
              dueDate: '2025-10-01',
              status: 'completed',
              notes: 'Math support increased to 3x per week starting October 1st'
            },
            {
              id: '2',
              task: 'Schedule next progress review',
              assignedTo: 'Ms. Sarah Thompson',
              dueDate: '2025-10-15',
              status: 'completed',
              notes: 'Annual review scheduled for November 15th'
            }
          ],
          notifications: [],
          createdDate: '2025-08-20',
          lastModified: '2025-09-16'
        }
      ];
      setMeetings(mockMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'initial': return '🆕';
      case 'annual': return '📅';
      case 'review': return '🔍';
      case 'amendment': return '✏️';
      case '3-year': return '🔄';
      case 'transition': return '🎓';
      default: return '📋';
    }
  };

  const getAttendeeStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600';
      case 'declined': return 'text-red-600';
      case 'tentative': return 'text-yellow-600';
      case 'no-response': return 'text-gray-500';
      default: return 'text-blue-600';
    }
  };

  const upcomingMeetings = meetings.filter(m => 
    new Date(m.dateTime) > new Date() && (m.status === 'scheduled' || m.status === 'confirmed')
  );

  const pastMeetings = meetings.filter(m => 
    new Date(m.dateTime) < new Date() || m.status === 'completed'
  );

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
          <h2 className="text-2xl font-bold text-gray-900">IEP Meeting Scheduler</h2>
          <p className="text-gray-600">Schedule and manage IEP team meetings</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-xl font-semibold text-gray-900">{upcomingMeetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">
                {meetings.filter(m => m.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-semibold text-gray-900">
                {meetings.filter(m => {
                  const meetingDate = new Date(m.dateTime);
                  const now = new Date();
                  return meetingDate.getMonth() === now.getMonth() && 
                         meetingDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-xl font-semibold text-gray-900">
                {meetings.reduce((sum, meeting) => sum + meeting.attendees.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {currentView === 'list' && (
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Meetings</h3>
              <div className="space-y-4">
                {upcomingMeetings.map(meeting => (
                  <div
                    key={meeting.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    {/* Meeting Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(meeting.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">{meeting.type.replace('-', ' ')} meeting</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>

                    {/* Meeting Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(meeting.dateTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(meeting.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                          ({meeting.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {meeting.location.type === 'virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        <span>
                          {meeting.location.type === 'virtual' ? 'Virtual Meeting' : 
                           meeting.location.type === 'hybrid' ? 'Hybrid Meeting' :
                           meeting.location.address}
                        </span>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {meeting.attendees.length} attendees •{' '}
                        {meeting.attendees.filter(a => a.status === 'accepted').length} confirmed
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        {meeting.attendees.slice(0, 4).map(attendee => (
                          <div
                            key={attendee.id}
                            className={`w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white ${getAttendeeStatusColor(attendee.status)}`}
                            title={`${attendee.name} - ${attendee.status}`}
                          >
                            {attendee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                        ))}
                        {meeting.attendees.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            +{meeting.attendees.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      {meeting.location.virtualLink && (
                        <button className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Video className="w-3 h-3" />
                          Join Meeting
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Meetings */}
          {pastMeetings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Meetings</h3>
              <div className="space-y-4">
                {pastMeetings.slice(0, 3).map(meeting => (
                  <div
                    key={meeting.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer opacity-75"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(meeting.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(meeting.dateTime).toLocaleDateString()} • {meeting.duration} minutes
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText className="w-3 h-3" />
                        Meeting Notes
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-3 h-3" />
                        Download Summary
                      </button>
                      {meeting.followUpActions.length > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3" />
                          {meeting.followUpActions.filter(a => a.status === 'completed').length}/{meeting.followUpActions.length} actions completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}

      {meetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
          <p className="text-gray-600 mb-4">Get started by scheduling your first IEP meeting.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule First Meeting
          </button>
        </div>
      )}
    </div>
  );
};

// Meeting Detail Modal Component
interface MeetingDetailModalProps {
  meeting: IEPMeeting;
  onClose: () => void;
}

const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ meeting, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'attendees' | 'documents' | 'notes'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{meeting.title}</h2>
              <p className="text-gray-600 mt-1 capitalize">{meeting.type.replace('-', ' ')} meeting</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  meeting.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                  meeting.status === 'completed' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {meeting.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(meeting.dateTime).toLocaleDateString()} at {new Date(meeting.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
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
              { id: 'agenda', label: 'Agenda' },
              { id: 'attendees', label: 'Attendees' },
              { id: 'documents', label: 'Documents' },
              { id: 'notes', label: 'Notes & Actions' }
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Meeting Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(meeting.dateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>
                        {new Date(meeting.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({meeting.duration} minutes)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.location.type === 'virtual' ? 
                        <Video className="w-4 h-4 text-gray-500" /> : 
                        <MapPin className="w-4 h-4 text-gray-500" />
                      }
                      <div>
                        <p>{meeting.location.type === 'virtual' ? 'Virtual Meeting' : meeting.location.address}</p>
                        {meeting.location.room && <p className="text-gray-500">{meeting.location.room}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{meeting.organizer.name} ({meeting.organizer.role})</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Connection Info</h3>
                  {meeting.location.virtualLink && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Video Conference</p>
                        <a 
                          href={meeting.location.virtualLink}
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {meeting.location.virtualLink}
                        </a>
                      </div>
                      {meeting.location.dialIn && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">Dial-in Option</p>
                          <p className="text-gray-700 text-sm">{meeting.location.dialIn}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-4">
              {meeting.agenda.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{item.duration} min</p>
                      <p>{item.presenter}</p>
                    </div>
                  </div>
                  {item.documents && item.documents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Related Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.documents.map(doc => (
                          <span key={doc} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.completed && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-700 mt-1">{item.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attendees' && (
            <div className="space-y-4">
              {meeting.attendees.map(attendee => (
                <div key={attendee.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attendee.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{attendee.role.replace('-', ' ')}</p>
                      {attendee.email && (
                        <p className="text-sm text-gray-500">{attendee.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {attendee.required && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Required</span>
                    )}
                    <span className={`text-sm font-medium capitalize ${
                      attendee.status === 'accepted' ? 'text-green-600' :
                      attendee.status === 'declined' ? 'text-red-600' :
                      attendee.status === 'tentative' ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {attendee.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {meeting.documents.length > 0 ? (
                meeting.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {doc.type.replace('-', ' ')} • Uploaded by {doc.uploadedBy} on {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No documents uploaded</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {meeting.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Meeting Notes</h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700">{meeting.notes}</p>
                  </div>
                </div>
              )}

              {meeting.followUpActions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Follow-up Actions</h3>
                  <div className="space-y-3">
                    {meeting.followUpActions.map(action => (
                      <div key={action.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              action.status === 'completed' ? 'bg-green-500' :
                              action.status === 'in-progress' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`} />
                            <p className="font-medium text-gray-900">{action.task}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded capitalize ${
                            action.status === 'completed' ? 'bg-green-100 text-green-800' :
                            action.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {action.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Assigned to: {action.assignedTo}</span>
                          <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                        </div>
                        {action.notes && (
                          <p className="text-sm text-gray-700 mt-2">{action.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IEPMeetingScheduler;
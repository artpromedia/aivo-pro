import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchIntegrations } from '../../services/districtApi';
import { 
  Link2, 
  X, 
  RefreshCw,
  Settings,
  AlertCircle,
  Clock,
  Users,
  BookOpen,
  Activity,
  Calendar,
  CheckCircle,
  Zap
} from 'lucide-react';

interface LMSIntegration {
  id: string;
  name: string;
  provider: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync: string;
  coursesCount: number;
  studentsCount: number;
  syncFrequency: string;
  apiKey?: string;
  features: string[];
}

// Mock LMS and Learning App data
const mockLMSIntegrations: LMSIntegration[] = [
  // Learning Management Systems
  {
    id: 'lms-001',
    name: 'Google Classroom',
    provider: 'Google',
    icon: '/icons/google-classroom.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T10:30:00',
    coursesCount: 156,
    studentsCount: 3241,
    syncFrequency: 'Every 4 hours',
    features: ['Roster Sync', 'Grade Sync', 'Assignment Sync', 'Auto-enrollment']
  },
  {
    id: 'lms-002',
    name: 'Canvas LMS',
    provider: 'Instructure',
    icon: '/icons/canvas.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T09:15:00',
    coursesCount: 89,
    studentsCount: 1582,
    syncFrequency: 'Every 6 hours',
    features: ['Roster Sync', 'Grade Sync', 'Content Integration']
  },
  {
    id: 'lms-003',
    name: 'Schoology',
    provider: 'PowerSchool',
    icon: '/icons/schoology.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Roster Sync', 'Grade Sync', 'Analytics']
  },
  {
    id: 'lms-004',
    name: 'Blackboard Learn',
    provider: 'Anthology',
    icon: '/icons/blackboard.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Roster Sync', 'Assessment Integration']
  },
  
  // K-12 Learning Apps
  {
    id: 'app-001',
    name: 'Seesaw',
    provider: 'Seesaw Learning',
    icon: '/icons/seesaw.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T11:00:00',
    coursesCount: 87,
    studentsCount: 1856,
    syncFrequency: 'Every 2 hours',
    features: ['Portfolio Sync', 'Student Work', 'Parent Communication', 'Activity Library']
  },
  {
    id: 'app-002',
    name: 'Amplify',
    provider: 'Amplify Education',
    icon: '/icons/amplify.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T10:45:00',
    coursesCount: 124,
    studentsCount: 2643,
    syncFrequency: 'Every 6 hours',
    features: ['ELA Curriculum', 'Assessment Data', 'Progress Tracking', 'Standards Alignment']
  },
  {
    id: 'app-003',
    name: 'Clever',
    provider: 'Clever Inc.',
    icon: '/icons/clever.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T12:00:00',
    coursesCount: 245,
    studentsCount: 4823,
    syncFrequency: 'Daily at 3 AM',
    features: ['SSO Integration', 'Roster Automation', 'App Portal', 'Data Security']
  },
  {
    id: 'app-004',
    name: 'Khan Academy',
    provider: 'Khan Academy',
    icon: '/icons/khan-academy.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T09:30:00',
    coursesCount: 0,
    studentsCount: 2156,
    syncFrequency: 'Every 12 hours',
    features: ['Math Practice', 'Progress Tracking', 'Teacher Dashboard', 'Personalized Learning']
  },
  {
    id: 'app-005',
    name: 'Nearpod',
    provider: 'Nearpod',
    icon: '/icons/nearpod.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Interactive Lessons', 'Real-time Feedback', 'Assessment', 'VR Field Trips']
  },
  {
    id: 'app-006',
    name: 'ClassDojo',
    provider: 'ClassDojo Inc.',
    icon: '/icons/classdojo.svg',
    connected: true,
    status: 'active',
    lastSync: '2024-11-06T11:30:00',
    coursesCount: 95,
    studentsCount: 1975,
    syncFrequency: 'Real-time',
    features: ['Behavior Tracking', 'Parent Communication', 'Class Story', 'Points System']
  },
  {
    id: 'app-007',
    name: 'IXL Learning',
    provider: 'IXL Learning',
    icon: '/icons/ixl.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Math & ELA Practice', 'Adaptive Learning', 'Analytics', 'Standards Coverage']
  },
  {
    id: 'app-008',
    name: 'Kahoot!',
    provider: 'Kahoot! AS',
    icon: '/icons/kahoot.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Game-based Learning', 'Quizzes', 'Engagement', 'Reports']
  },
  {
    id: 'app-009',
    name: 'Reading Eggs',
    provider: 'Blake eLearning',
    icon: '/icons/reading-eggs.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Reading Program', 'Phonics', 'Progress Tracking', 'K-6 Literacy']
  },
  {
    id: 'app-010',
    name: 'Prodigy Math',
    provider: 'Prodigy Education',
    icon: '/icons/prodigy.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Math Game', 'Curriculum-aligned', 'Teacher Tools', 'Differentiation']
  },
  {
    id: 'app-011',
    name: 'Quizlet',
    provider: 'Quizlet Inc.',
    icon: '/icons/quizlet.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Flashcards', 'Study Sets', 'Practice Tests', 'Collaboration']
  },
  {
    id: 'app-012',
    name: 'Edmodo',
    provider: 'Edmodo',
    icon: '/icons/edmodo.svg',
    connected: false,
    status: 'disconnected',
    lastSync: 'Never',
    coursesCount: 0,
    studentsCount: 0,
    syncFrequency: 'N/A',
    features: ['Communication Platform', 'Assignment Management', 'Parent Access', 'Library Resources']
  }
];

export const Integrations: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<LMSIntegration | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const districtId = 'SD-12345'; // In production, get from auth context

  const { data: integrationsData, isLoading, error, refetch } = useQuery({
    queryKey: ['lms-integrations', districtId],
    queryFn: async () => {
      const integrations = await fetchIntegrations(districtId);
      return {
        integrations,
        stats: {
          totalConnected: integrations.filter((i: LMSIntegration) => i.connected).length,
          totalCourses: integrations.reduce((sum: number, i: LMSIntegration) => sum + i.coursesCount, 0),
          totalStudents: integrations.reduce((sum: number, i: LMSIntegration) => sum + i.studentsCount, 0),
          lastGlobalSync: new Date().toISOString()
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-coral-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  if (error || !integrationsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Failed to load integrations</p>
          <p className="text-gray-600 mb-4">Using demo data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter integrations by category
  const filteredIntegrations = filterCategory === 'all' 
    ? integrationsData?.integrations 
    : integrationsData?.integrations?.filter((integration: LMSIntegration) => {
        if (filterCategory === 'lms') {
          return integration.id.startsWith('lms-');
        } else if (filterCategory === 'learning-apps') {
          return integration.id.startsWith('app-');
        }
        return true;
      });

  const categories = [
    { id: 'all', name: 'All Platforms', count: integrationsData?.integrations?.length || 0 },
    { id: 'lms', name: 'Learning Management', count: integrationsData?.integrations?.filter((i: LMSIntegration) => i.id.startsWith('lms-')).length || 0 },
    { id: 'learning-apps', name: 'Learning Apps', count: integrationsData?.integrations?.filter((i: LMSIntegration) => i.id.startsWith('app-')).length || 0 }
  ];

  const handleSync = async (integrationId: string) => {
    void alert(`Syncing ${integrationId}...`);
    await refetch();
  };

  const handleConnect = (integration: LMSIntegration) => {
    setSelectedIntegration(integration);
  };

  const handleDisconnect = async (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      void alert(`Disconnecting ${integrationId}...`);
      await refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'disconnected': return <X className="w-4 h-4" />;
      default: return <X className="w-4 h-4" />;
    }
  };

  const formatLastSync = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Link2 className="w-7 h-7 text-blue-600" />
                LMS Integrations
              </h1>
              <p className="text-gray-600">
                Manage connections with Learning Management Systems
              </p>
            </div>
            <button
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Sync All
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Link2 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {integrationsData?.stats.totalConnected || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Connected Platforms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {integrationsData?.stats.totalCourses || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Synced Courses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                {integrationsData?.stats.totalStudents?.toLocaleString() || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Synced Students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">
                {formatLastSync(integrationsData?.stats.lastGlobalSync || '')}
              </span>
            </div>
            <p className="text-sm text-gray-600">Last Global Sync</p>
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-2 inline-flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filterCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            filteredIntegrations?.map((integration: LMSIntegration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 hover:border-blue-200 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      {integration.icon ? (
                        <img src={integration.icon} alt={integration.name} className="w-10 h-10" />
                      ) : (
                        <Link2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">by {integration.provider}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    {integration.status}
                  </span>
                </div>

                {/* Stats */}
                {integration.connected && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{integration.coursesCount}</p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{integration.studentsCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center border-l border-gray-200">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="w-4 h-4 text-green-600" />
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Active</p>
                    </div>
                  </div>
                )}

                {/* Sync Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="font-medium text-gray-900">{formatLastSync(integration.lastSync)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium text-gray-900">{integration.syncFrequency}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {integration.connected ? (
                    <>
                      <button
                        onClick={() => void handleSync(integration.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </button>
                      <button
                        onClick={() => void alert(`Settings for ${integration.name}`)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleDisconnect(integration.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Disconnect"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                      Connect
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Sync History */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Recent Sync Activity
          </h2>
          <div className="space-y-3">
            {[
              { time: '10:30 AM', platform: 'Google Classroom', action: 'Synced 156 courses', status: 'success' },
              { time: '9:15 AM', platform: 'Canvas LMS', action: 'Synced 89 courses', status: 'success' },
              { time: '6:00 AM', platform: 'Google Classroom', action: 'Synced student rosters', status: 'success' },
              { time: '3:45 AM', platform: 'Canvas LMS', action: 'Grade sync completed', status: 'success' },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-green-500' :
                    log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.platform}</p>
                    <p className="text-xs text-gray-500">{log.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Modal */}
        {selectedIntegration && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIntegration(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Connect to {selectedIntegration.name}
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your {selectedIntegration.name} credentials or API key to establish the connection.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base URL (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-domain.instructure.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    void alert(`Connecting to ${selectedIntegration.name}...`);
                    setSelectedIntegration(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

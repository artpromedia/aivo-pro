import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { 
  Key, Globe, BarChart3, Shield, Clock, AlertTriangle,
  Plus, Search, RefreshCw, Eye, Copy, Trash2, Settings
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  usage: number;
  limit: number;
  created: string;
  lastUsed: string;
  permissions: string[];
}

interface APIMetrics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    avgTime: number;
  }>;
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production Dashboard',
    key: 'aivo_prod_xk7m9...', 
    status: 'active',
    usage: 87500,
    limit: 100000,
    created: '2024-01-15',
    lastUsed: '2 minutes ago',
    permissions: ['read', 'write', 'admin']
  },
  {
    id: '2',
    name: 'Mobile App API',
    key: 'aivo_mobile_pk3s...', 
    status: 'active',
    usage: 45200,
    limit: 50000,
    created: '2024-02-01',
    lastUsed: '5 minutes ago',
    permissions: ['read', 'write']
  },
  {
    id: '3',
    name: 'Analytics Service',
    key: 'aivo_analytics_m2x...', 
    status: 'inactive',
    usage: 1200,
    limit: 25000,
    created: '2024-01-28',
    lastUsed: '2 hours ago',
    permissions: ['read']
  }
];

const mockMetrics: APIMetrics = {
  totalRequests: 8934567,
  successRate: 99.97,
  avgResponseTime: 145,
  errorRate: 0.03,
  topEndpoints: [
    { endpoint: '/api/v1/chat/completions', requests: 2345678, avgTime: 180 },
    { endpoint: '/api/v1/models/list', requests: 1234567, avgTime: 45 },
    { endpoint: '/api/v1/users/auth', requests: 987654, avgTime: 120 },
    { endpoint: '/api/v1/analytics/metrics', requests: 567890, avgTime: 230 },
  ]
};

export default function APIManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'analytics' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  const tabs = [
    { id: 'overview', label: 'API Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'keys', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ];

  const MetricCard = ({ title, value, unit, change, icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-coral-500 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-gray-400">{unit}</span>
        </div>
      </div>
    </motion.div>
  );

  const filteredKeys = mockAPIKeys.filter(key => 
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Gateway Management</h1>
          <p className="text-gray-400">Manage API keys, monitor usage, and analyze performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              toast.info('Refreshing API Data', 'Updating all API metrics and statistics...');
              // In a real app, this would trigger a refetch of API data
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={async () => {
              const confirmed = await confirm({
                title: 'Create New API Key',
                description: 'Generate a new API key for external integration?',
                type: 'info'
              });
              if (confirmed) {
                toast.success('API Key Created', 'New API key generated successfully');
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-coral-600 to-salmon-600 hover:from-coral-700 hover:to-salmon-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New API Key
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-coral-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* API Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Requests"
              value={`${(mockMetrics.totalRequests / 1000000).toFixed(1)}M`}
              unit="today"
              change={18.5}
              icon={<Globe className="w-5 h-5" />}
              color="blue"
            />
            <MetricCard
              title="Success Rate"
              value={mockMetrics.successRate}
              unit="%"
              icon={<Shield className="w-5 h-5" />}
              color="green"
            />
            <MetricCard
              title="Avg Response"
              value={mockMetrics.avgResponseTime}
              unit="ms"
              change={-5.2}
              icon={<Clock className="w-5 h-5" />}
              color="yellow"
            />
            <MetricCard
              title="Error Rate"
              value={mockMetrics.errorRate}
              unit="%"
              icon={<AlertTriangle className="w-5 h-5" />}
              color="red"
            />
          </div>

          {/* Top Endpoints */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Top API Endpoints</h2>
              <p className="text-gray-400">Most frequently accessed endpoints</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockMetrics.topEndpoints.map((endpoint, index) => (
                  <motion.div
                    key={endpoint.endpoint}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <h3 className="font-mono text-white">{endpoint.endpoint}</h3>
                        <p className="text-sm text-gray-400">{endpoint.requests.toLocaleString()} requests</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-medium">{endpoint.avgTime}ms</p>
                      <p className="text-sm text-gray-400">avg response</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search API keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* API Keys List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">API Keys ({filteredKeys.length})</h2>
              <p className="text-gray-400">Manage and monitor your API keys</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {filteredKeys.map((apiKey, index) => (
                  <motion.div
                    key={apiKey.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          apiKey.status === 'active' ? 'bg-green-400' :
                          apiKey.status === 'inactive' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`} />
                        <h3 className="font-semibold text-white">{apiKey.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apiKey.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          apiKey.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toast.info(`API Key Details: ${apiKey.name}`, `Viewing details for ${apiKey.key.substring(0, 8)}...`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey.key);
                            toast.success(`API Key Copied: ${apiKey.name}`, 'Key copied to clipboard successfully');
                          }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info(`API Key Settings: ${apiKey.name}`, 'Opening configuration panel...')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: `Delete API Key: ${apiKey.name}`,
                              description: 'Are you sure you want to delete this API key? This action cannot be undone.',
                              type: 'danger'
                            });
                            if (confirmed) {
                              toast.success('API Key Deleted', `${apiKey.name} has been successfully removed`);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">API Key</p>
                        <p className="font-mono text-white">{apiKey.key}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Usage</p>
                        <p className="text-white">{apiKey.usage.toLocaleString()} / {apiKey.limit.toLocaleString()}</p>
                        <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                          <div 
                            className="h-1 bg-coral-500 rounded-full"
                            style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-white">{apiKey.created}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Used</p>
                        <p className="text-white">{apiKey.lastUsed}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab !== 'overview' && activeTab !== 'keys' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h3>
          <p className="text-gray-400 mb-6">This section is under development.</p>
          <button 
            onClick={() => {
              const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label;
              toast.info('Configuration Settings', `Opening settings for ${activeTabLabel}...`);
            }}
            className="bg-coral-600 hover:bg-coral-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Configure Settings
          </button>
        </div>
      )}
    </div>
  );
}
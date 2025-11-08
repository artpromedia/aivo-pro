import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { 
  Brain, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Clock,
  BarChart3,
  Shield,
  RefreshCw,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  Activity,
  Target,
  Network
} from 'lucide-react';
import ProviderDetailModal from '../components/ProviderDetailModal';
import FailoverRuleModal from '../components/FailoverRuleModal';
import CostOptimization from '../components/CostOptimization';
import AddProviderModal from '../components/AddProviderModal';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { LoadingOverlay } from '../components/LoadingStates';

interface AIProvider {
  id: string;
  name: string;
  type: 'LLM' | 'Vision' | 'Audio' | 'Multimodal';
  vendor: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  health: number;
  latency: number;
  throughput: number;
  costPerRequest: number;
  totalRequests: number;
  successRate: number;
  lastHeartbeat: string;
  priority: number;
  regions: string[];
  capabilities: string[];
  modelVersion: string;
  apiVersion: string;
  quotaLimit: number;
  quotaUsed: number;
  billing: {
    monthly: number;
    daily: number;
    hourly: number;
  };
  configuration: {
    maxTokens: number;
    temperature: number;
    timeout: number;
    retries: number;
  };
}

interface FailoverRule {
  id: string;
  name: string;
  primaryProvider: string;
  fallbackProviders: string[];
  trigger: 'latency' | 'error_rate' | 'quota' | 'manual';
  threshold: number;
  enabled: boolean;
  lastTriggered?: string;
}

// Sub-route Components
const AIProviderSwitch: React.FC = () => {
  const { success } = useToast();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">AI Provider Switch</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Manual Provider Switch</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Provider</label>
            <select disabled className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
              <option>OpenAI GPT-4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Switch To</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>Anthropic Claude 3</option>
              <option>Google Gemini Pro</option>
              <option>Meta Llama 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Switch</label>
            <textarea 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-24"
              placeholder="Optional reason for switching providers"
            />
          </div>
          <button 
            onClick={() => success('Provider switched successfully!')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Switch Provider
          </button>
        </div>
      </div>
    </div>
  );
};

const AIProviderFailover: React.FC = () => {
  const { success } = useToast();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Failover Configuration</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Configure Failover Rules</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Provider</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>OpenAI GPT-4</option>
              <option>Anthropic Claude 3</option>
              <option>Google Gemini Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Backup Provider</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>Anthropic Claude 3</option>
              <option>Google Gemini Pro</option>
              <option>Meta Llama 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Failure Threshold (%)</label>
            <input 
              type="number" 
              min="1" 
              max="100" 
              defaultValue="5"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>
          <button 
            onClick={() => success('Failover rules configured successfully!')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            Save Failover Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const AIProviderManagementMain: React.FC = () => {
  const { success, error, info } = useToast();
  const { confirm } = useConfirmDialog();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'providers' | 'failover' | 'optimization' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showFailoverModal, setShowFailoverModal] = useState(false);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [selectedFailoverRule, setSelectedFailoverRule] = useState<FailoverRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app this would come from API
  const [providers] = useState<AIProvider[]>([
    {
      id: 'openai-gpt4',
      name: 'GPT-4 Turbo',
      type: 'LLM',
      vendor: 'OpenAI',
      status: 'active',
      health: 98,
      latency: 450,
      throughput: 1250,
      costPerRequest: 0.03,
      totalRequests: 45680,
      successRate: 99.2,
      lastHeartbeat: '2024-11-07T10:30:00Z',
      priority: 1,
      regions: ['us-east-1', 'eu-west-1'],
      capabilities: ['text-generation', 'reasoning', 'code'],
      modelVersion: 'gpt-4-1106-preview',
      apiVersion: 'v1',
      quotaLimit: 100000,
      quotaUsed: 45680,
      billing: { monthly: 12450, daily: 425, hourly: 18 },
      configuration: { maxTokens: 4096, temperature: 0.7, timeout: 30000, retries: 3 }
    },
    {
      id: 'anthropic-claude',
      name: 'Claude 3 Sonnet',
      type: 'LLM',
      vendor: 'Anthropic',
      status: 'active',
      health: 96,
      latency: 520,
      throughput: 980,
      costPerRequest: 0.025,
      totalRequests: 32150,
      successRate: 98.8,
      lastHeartbeat: '2024-11-07T10:29:45Z',
      priority: 2,
      regions: ['us-west-2'],
      capabilities: ['text-generation', 'analysis', 'reasoning'],
      modelVersion: 'claude-3-sonnet-20240229',
      apiVersion: 'v1',
      quotaLimit: 80000,
      quotaUsed: 32150,
      billing: { monthly: 8950, daily: 305, hourly: 13 },
      configuration: { maxTokens: 4096, temperature: 0.5, timeout: 25000, retries: 2 }
    },
    {
      id: 'google-palm',
      name: 'PaLM 2',
      type: 'LLM',
      vendor: 'Google',
      status: 'maintenance',
      health: 0,
      latency: 0,
      throughput: 0,
      costPerRequest: 0.02,
      totalRequests: 18900,
      successRate: 97.5,
      lastHeartbeat: '2024-11-07T09:15:00Z',
      priority: 3,
      regions: ['us-central1'],
      capabilities: ['text-generation', 'translation'],
      modelVersion: 'text-bison-001',
      apiVersion: 'v1',
      quotaLimit: 60000,
      quotaUsed: 18900,
      billing: { monthly: 4200, daily: 140, hourly: 6 },
      configuration: { maxTokens: 2048, temperature: 0.3, timeout: 20000, retries: 3 }
    },
    {
      id: 'openai-dalle3',
      name: 'DALL-E 3',
      type: 'Vision',
      vendor: 'OpenAI',
      status: 'active',
      health: 94,
      latency: 2100,
      throughput: 45,
      costPerRequest: 0.08,
      totalRequests: 8450,
      successRate: 96.8,
      lastHeartbeat: '2024-11-07T10:28:30Z',
      priority: 1,
      regions: ['us-east-1'],
      capabilities: ['image-generation', 'creative'],
      modelVersion: 'dall-e-3',
      apiVersion: 'v1',
      quotaLimit: 10000,
      quotaUsed: 8450,
      billing: { monthly: 2850, daily: 95, hourly: 4 },
      configuration: { maxTokens: 1024, temperature: 0.8, timeout: 60000, retries: 2 }
    },
    {
      id: 'elevenlabs-tts',
      name: 'ElevenLabs TTS',
      type: 'Audio',
      vendor: 'ElevenLabs',
      status: 'active',
      health: 99,
      latency: 850,
      throughput: 220,
      costPerRequest: 0.015,
      totalRequests: 12650,
      successRate: 99.5,
      lastHeartbeat: '2024-11-07T10:30:15Z',
      priority: 1,
      regions: ['us-east-1', 'eu-west-1'],
      capabilities: ['text-to-speech', 'voice-cloning'],
      modelVersion: 'eleven_multilingual_v2',
      apiVersion: 'v1',
      quotaLimit: 15000,
      quotaUsed: 12650,
      billing: { monthly: 1890, daily: 63, hourly: 3 },
      configuration: { maxTokens: 512, temperature: 0.5, timeout: 15000, retries: 2 }
    }
  ]);

  const [failoverRules] = useState<FailoverRule[]>([
    {
      id: 'rule-1',
      name: 'LLM Primary Failover',
      primaryProvider: 'openai-gpt4',
      fallbackProviders: ['anthropic-claude', 'google-palm'],
      trigger: 'error_rate',
      threshold: 5,
      enabled: true,
      lastTriggered: '2024-11-06T14:23:00Z'
    },
    {
      id: 'rule-2',
      name: 'High Latency Failover',
      primaryProvider: 'openai-gpt4',
      fallbackProviders: ['anthropic-claude'],
      trigger: 'latency',
      threshold: 2000,
      enabled: true
    },
    {
      id: 'rule-3',
      name: 'Quota Exhaustion',
      primaryProvider: 'anthropic-claude',
      fallbackProviders: ['google-palm'],
      trigger: 'quota',
      threshold: 95,
      enabled: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600';
    if (health >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus;
    const matchesType = filterType === 'all' || provider.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCost = providers.reduce((sum, provider) => sum + provider.billing.monthly, 0);
  const avgLatency = providers.reduce((sum, provider) => sum + provider.latency, 0) / providers.length;
  const avgSuccessRate = providers.reduce((sum, provider) => sum + provider.successRate, 0) / providers.length;

  const handleSaveFailoverRule = async (rule: Omit<FailoverRule, 'id'>) => {
    // In real app, this would save to API
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Failover Rule Saved', `Rule "${rule.name}" has been successfully configured.`);
    } catch (err) {
      error('Failed to Save Rule', 'There was an error saving the failover rule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProvider = async (providerData: any) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      success('Provider Added Successfully', `${providerData.name} has been added to the system.`);
    } catch (err) {
      error('Failed to Add Provider', 'There was an error adding the AI provider. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportConfig = async () => {
    try {
      setIsLoading(true);
      info('Exporting Configuration', 'Generating AI provider configuration export...');
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Export Complete', 'AI provider configuration has been exported successfully.');
    } catch (err) {
      error('Export Failed', 'There was an error exporting the configuration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProvider = (provider: AIProvider) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleEditFailoverRule = (rule: FailoverRule) => {
    setSelectedFailoverRule(rule);
    setShowFailoverModal(true);
  };

  const handleAddFailoverRule = () => {
    setSelectedFailoverRule(null);
    setShowFailoverModal(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'providers', label: 'Providers', icon: Brain },
    { id: 'failover', label: 'Failover Rules', icon: Shield },
    { id: 'optimization', label: 'Optimization', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  return (
    <LoadingOverlay isLoading={isLoading} message="Processing...">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-coral-500" />
                AI Provider Management
              </h1>
              <p className="text-gray-600 mt-2">
                Orchestrate AI providers with intelligent failover and cost optimization
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportConfig}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Config
              </button>
              <button 
                onClick={() => setShowAddProviderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Provider
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
                <p className="text-sm text-green-600">
                  {providers.filter(p => p.status === 'active').length} active
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Network className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
                <p className="text-sm text-red-600">+12% vs last month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgLatency)}ms</p>
                <p className="text-sm text-green-600">-5% vs last hour</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
                <p className="text-sm text-green-600">+0.3% vs last hour</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                    selectedTab === tab.id
                      ? 'text-coral-600 border-b-2 border-coral-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Provider Status Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Status Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {providers.map((provider) => (
                    <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            provider.status === 'active' ? 'bg-green-500' :
                            provider.status === 'maintenance' ? 'bg-yellow-500' :
                            provider.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(provider.status)}`}>
                          {provider.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Health:</span>
                          <span className={`font-medium ${getHealthColor(provider.health)}`}>
                            {provider.health}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Latency:</span>
                          <span className="font-medium text-gray-900">{provider.latency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Requests:</span>
                          <span className="font-medium text-gray-900">{provider.totalRequests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost/req:</span>
                          <span className="font-medium text-gray-900">${provider.costPerRequest}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">OpenAI GPT-4 scaled up automatically</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Google PaLM entered maintenance mode</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Failover rule triggered for Claude 3</p>
                      <p className="text-xs text-gray-600">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'providers' && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="error">Error</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="all">All Types</option>
                    <option value="LLM">LLM</option>
                    <option value="Vision">Vision</option>
                    <option value="Audio">Audio</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                </div>
              </div>

              {/* Providers Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Provider</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Health</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Performance</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Usage</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Cost</th>
                        <th className="text-right py-3 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProviders.map((provider) => (
                        <tr key={provider.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                provider.status === 'active' ? 'bg-green-500' :
                                provider.status === 'maintenance' ? 'bg-yellow-500' :
                                provider.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{provider.name}</p>
                                <p className="text-sm text-gray-600">{provider.vendor} • {provider.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(provider.status)}`}>
                              {provider.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    provider.health >= 95 ? 'bg-green-500' :
                                    provider.health >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${provider.health}%` }}
                                />
                              </div>
                              <span className={`text-sm font-medium ${getHealthColor(provider.health)}`}>
                                {provider.health}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-gray-900">{provider.latency}ms</p>
                              <p className="text-gray-600">{provider.successRate}% success</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-gray-900">{provider.totalRequests.toLocaleString()}</p>
                              <p className="text-gray-600">{Math.round((provider.quotaUsed / provider.quotaLimit) * 100)}% quota</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-gray-900">${provider.costPerRequest}/req</p>
                              <p className="text-gray-600">${provider.billing.daily}/day</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleViewProvider(provider)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  info(`Editing AI Provider: ${provider.name}. Opening provider configuration editor...`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  info(`${provider.name} Settings: Opening advanced configuration panel...`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                              {provider.status === 'active' ? (
                                <button 
                                  onClick={async () => {
                                    const confirmed = await confirm({
                                      title: 'Pause AI Provider',
                                      description: `Are you sure you want to pause ${provider.name}?`,
                                      details: [
                                        'Stop routing new requests',
                                        'Complete existing requests',
                                        'Enable failover to backup providers'
                                      ],
                                      type: 'warning',
                                      confirmText: 'Pause Provider'
                                    });
                                    
                                    if (confirmed) {
                                      success('Provider Paused', `${provider.name} has been paused. Requests are now being routed to backup providers.`);
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Pause className="h-4 w-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={async () => {
                                    const confirmed = await confirm({
                                      title: 'Resume AI Provider',
                                      description: `Are you sure you want to resume ${provider.name}?`,
                                      details: [
                                        'Enable request routing',
                                        'Restore full functionality',
                                        'Update provider status'
                                      ],
                                      type: 'success',
                                      confirmText: 'Resume Provider'
                                    });
                                    
                                    if (confirmed) {
                                      success('Provider Resumed', `${provider.name} has been resumed and is now accepting requests.`);
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Play className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'failover' && (
            <motion.div
              key="failover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Failover Rules */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Failover Rules</h3>
                  <button 
                    onClick={handleAddFailoverRule}
                    className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </button>
                </div>
                <div className="space-y-4">
                  {failoverRules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          {rule.lastTriggered && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Recently triggered
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditFailoverRule(rule)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              const confirmed = await confirm({
                                title: 'Delete Failover Rule',
                                description: `Are you sure you want to delete the failover rule "${rule.name}"?`,
                                details: [
                                  'Remove the failover configuration',
                                  'Revert to default routing',
                                  'Require manual reconfiguration'
                                ],
                                type: 'danger',
                                confirmText: 'Delete Rule'
                              });
                              
                              if (confirmed) {
                                success('Failover Rule Deleted', `"${rule.name}" has been deleted. Default routing has been restored.`);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Primary Provider</p>
                          <p className="font-medium text-gray-900">
                            {providers.find(p => p.id === rule.primaryProvider)?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Trigger</p>
                          <p className="font-medium text-gray-900">
                            {rule.trigger.replace('_', ' ')} {'>'}  {rule.threshold}{rule.trigger === 'latency' ? 'ms' : '%'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Fallback Providers</p>
                          <p className="font-medium text-gray-900">
                            {rule.fallbackProviders.map(id => 
                              providers.find(p => p.id === id)?.name
                            ).join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Last Triggered</p>
                          <p className="font-medium text-gray-900">
                            {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'optimization' && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CostOptimization providers={providers} />
            </motion.div>
          )}

          {selectedTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced Analytics Dashboard
                </h3>
                <p className="text-gray-600">
                  Detailed performance metrics, usage patterns, and predictive analytics coming soon.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Modals */}
        {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          isOpen={showProviderModal}
          onClose={() => {
            setShowProviderModal(false);
            setSelectedProvider(null);
          }}
        />
      )}

      <FailoverRuleModal
        rule={selectedFailoverRule || undefined}
        providers={providers}
        isOpen={showFailoverModal}
        onClose={() => {
          setShowFailoverModal(false);
          setSelectedFailoverRule(null);
        }}
        onSave={handleSaveFailoverRule}
      />

      <AddProviderModal
        isOpen={showAddProviderModal}
        onClose={() => setShowAddProviderModal(false)}
        onAdd={handleAddProvider}
      />
      </div>
    </LoadingOverlay>
  );
};

export default function AIProviderManagement() {
  return (
    <Routes>
      <Route path="/" element={<AIProviderManagementMain />} />
      <Route path="/switch" element={<AIProviderSwitch />} />
      <Route path="/failover" element={<AIProviderFailover />} />
    </Routes>
  );
}
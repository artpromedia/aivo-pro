import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Activity, 
  DollarSign, 
  Clock, 
  Target, 
  Settings, 
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Edit,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useToast } from './ToastProvider';

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

interface ProviderDetailModalProps {
  provider: AIProvider;
  isOpen: boolean;
  onClose: () => void;
}

const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  isOpen,
  onClose
}) => {
  const toast = useToast();
  
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'bg-green-500';
    if (health >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${
              provider.status === 'active' ? 'bg-green-500' :
              provider.status === 'maintenance' ? 'bg-yellow-500' :
              provider.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
            }`} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
              <p className="text-gray-600">{provider.vendor} • {provider.type}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(provider.status)}`}>
              {provider.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                toast.info('Provider Configuration', `Opening configuration editor for ${provider.name}. You can modify API settings, rate limits, and monitoring thresholds.`);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              onClick={() => {
                toast.info('Advanced Settings', `Opening advanced configuration for ${provider.name}. Model: ${provider.modelVersion}, API: ${provider.apiVersion}, Priority: ${provider.priority}`);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </button>
            {provider.status === 'active' ? (
              <button 
                onClick={() => {
                  toast.warning('Provider Paused', `${provider.name} has been paused. New requests will be redirected to backup providers while existing requests complete normally.`);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Pause className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  toast.success('Provider Resumed', `${provider.name} has been resumed. Request routing enabled and health monitoring restored.`);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Play className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Health Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthColor(provider.health)}`}
                          style={{ width: `${provider.health}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{provider.health}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Latency</span>
                    <span className="font-semibold text-gray-900">{provider.latency}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Throughput</span>
                    <span className="font-semibold text-gray-900">{provider.throughput} req/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-gray-900">{provider.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Requests</span>
                    <span className="font-semibold text-gray-900">{provider.totalRequests.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cost per Request</span>
                    <span className="font-semibold text-gray-900">${provider.costPerRequest}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hourly Cost</span>
                    <span className="font-semibold text-gray-900">${provider.billing.hourly}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Daily Cost</span>
                    <span className="font-semibold text-gray-900">${provider.billing.daily}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Cost</span>
                    <span className="font-semibold text-gray-900">${provider.billing.monthly.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Quota & Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Quota Usage</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((provider.quotaUsed / provider.quotaLimit) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-coral-500 h-2 rounded-full"
                        style={{ width: `${(provider.quotaUsed / provider.quotaLimit) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{provider.quotaUsed.toLocaleString()} used</span>
                      <span>{provider.quotaLimit.toLocaleString()} limit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Priority Level</span>
                    <span className="font-semibold text-gray-900">#{provider.priority}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration & Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Configuration
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Model Version</span>
                    <span className="font-semibold text-gray-900">{provider.modelVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Version</span>
                    <span className="font-semibold text-gray-900">{provider.apiVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Tokens</span>
                    <span className="font-semibold text-gray-900">{provider.configuration.maxTokens}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-semibold text-gray-900">{provider.configuration.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Timeout</span>
                    <span className="font-semibold text-gray-900">{provider.configuration.timeout}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Retries</span>
                    <span className="font-semibold text-gray-900">{provider.configuration.retries}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                  Regions & Capabilities
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 block mb-2">Regions</span>
                    <div className="flex flex-wrap gap-2">
                      {provider.regions.map((region) => (
                        <span 
                          key={region}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2">Capabilities</span>
                    <div className="flex flex-wrap gap-2">
                      {provider.capabilities.map((capability) => (
                        <span 
                          key={capability}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Status Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Heartbeat</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(provider.lastHeartbeat).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-gray-600">
                      {provider.status === 'active' ? 'Provider is healthy and responding' : 
                       provider.status === 'maintenance' ? 'Provider is under maintenance' :
                       'Provider is experiencing issues'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button 
              onClick={() => {
                toast.info('Status Refresh', `Refreshing ${provider.name} status. Performing health checks and updating metrics...`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </button>
            <button 
              onClick={() => {
                toast.info('Analytics Dashboard', `Opening analytics dashboard for ${provider.name}. View request trends, performance metrics, and cost analysis.`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </button>
            <button 
              onClick={() => {
                toast.info('Configuration Editor', `Opening configuration editor for ${provider.name}. Modify API settings, rate limits (${provider.quotaLimit} requests), and monitoring thresholds.`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Configuration
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderDetailModal;
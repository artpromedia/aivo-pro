import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Brain, Building2, DollarSign, Users, 
  Activity, CreditCard, Headphones, Server, 
  Zap, CheckCircle, ArrowRight, Eye
} from 'lucide-react';
import { usePlatformStore } from '@/stores/platformStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { PlatformMetrics, AIProvider } from '@/types';

// Mock data - in production this would come from APIs
const mockMetrics: PlatformMetrics = {
  revenue: { mrr: 2400000, growth: 15.3, total: 28800000 },
  districts: { total: 847, active: 823, growth: 8.2 },
  users: { total: 156789, activeDaily: 89543, activeMonthly: 134567, growth: 12.7 },
  ai: { totalModels: 47, accuracy: 94.8, requestsToday: 2847293, costToday: 15420 },
  system: { uptime: 99.97, cpu: 34, memory: 67, latency: 45 },
  support: { openTickets: 23, critical: 2, avgResponseTime: 8, satisfaction: 4.7 },
  api: { dailyCalls: 8934567, growth: 18.5, errorRate: 0.03 },
  security: { score: 98, threats: 0, incidents: 1 },
};

const mockAIProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    status: 'active',
    models: [],
    pricing: { inputCost: 0.03, outputCost: 0.06, currency: 'USD', unit: 'per_1k_tokens' },
    performance: { latency: 245, throughput: 1250, errorRate: 0.02, availability: 99.9 },
    failoverPriority: 1,
    costToday: 8945,
    requestsToday: 1567234,
    lastHealthCheck: new Date(),
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    type: 'anthropic',
    status: 'active',
    models: [],
    pricing: { inputCost: 0.025, outputCost: 0.075, currency: 'USD', unit: 'per_1k_tokens' },
    performance: { latency: 189, throughput: 980, errorRate: 0.01, availability: 99.8 },
    failoverPriority: 2,
    costToday: 4567,
    requestsToday: 890123,
    lastHealthCheck: new Date(),
  },
];

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
  urgency?: boolean;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'yellow' | 'red';
  onClick?: () => void;
}

function KPICard({ title, value, subtitle, change, status, urgency, icon, color, onClick }: KPICardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gray-900 rounded-xl border border-gray-800 p-4 cursor-pointer hover:border-gray-700 transition-all ${
        urgency ? 'ring-2 ring-red-500 ring-opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
      {status && (
        <div className="flex items-center gap-1 mt-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'excellent' ? 'bg-green-500' :
            status === 'good' ? 'bg-blue-500' :
            status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-400 capitalize">{status}</span>
        </div>
      )}
    </motion.div>
  );
}

function AIProviderStatus({ providers }: { providers: AIProvider[] }) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              provider.status === 'active' ? 'bg-green-500' :
              provider.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <div>
              <p className="text-sm font-medium text-white">{provider.name}</p>
              <p className="text-xs text-gray-400">
                {provider.requestsToday.toLocaleString()} requests • ${provider.costToday.toLocaleString()} cost
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Latency</p>
            <p className="text-sm font-medium text-white">{provider.performance.latency}ms</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemHealthMonitor() {
  const healthData = [
    { name: 'API Gateway', status: 'healthy', uptime: 99.97, response: '45ms' },
    { name: 'Database Cluster', status: 'healthy', uptime: 99.99, response: '12ms' },
    { name: 'AI Services', status: 'warning', uptime: 99.85, response: '234ms' },
    { name: 'CDN Network', status: 'healthy', uptime: 99.95, response: '89ms' },
  ];

  return (
    <div className="space-y-3">
      {healthData.map((service) => (
        <div key={service.name} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              service.status === 'healthy' ? 'bg-green-500' :
              service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-white">{service.name}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{service.uptime}% uptime</p>
            <p className="text-xs text-gray-500">{service.response}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OperationsFeed() {
  const mockOperations = [
    { id: 1, type: 'deployment', message: 'AI Model v2.1.4 deployed', timestamp: '2 min ago', status: 'success' },
    { id: 2, type: 'scaling', message: 'Auto-scaled web servers +3', timestamp: '8 min ago', status: 'info' },
    { id: 3, type: 'alert', message: 'High memory usage on DB-02', timestamp: '15 min ago', status: 'warning' },
    { id: 4, type: 'backup', message: 'Daily backup completed', timestamp: '1 hour ago', status: 'success' },
  ];

  return (
    <div className="space-y-3">
      {mockOperations.map((op) => (
        <div key={op.id} className="flex items-start gap-3 p-2">
          <div className={`w-2 h-2 rounded-full mt-2 ${
            op.status === 'success' ? 'bg-green-500' :
            op.status === 'warning' ? 'bg-yellow-500' :
            op.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">{op.message}</p>
            <p className="text-xs text-gray-500">{op.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplianceWidget() {
  const compliance = [
    { name: 'FERPA', status: 'compliant', score: 100 },
    { name: 'COPPA', status: 'compliant', score: 100 },
    { name: 'GDPR', status: 'compliant', score: 98 },
    { name: 'SOC 2', status: 'in-progress', score: 87 },
  ];

  return (
    <div className="space-y-3">
      {compliance.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              item.status === 'compliant' ? 'bg-green-500' :
              item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-white">{item.name}</span>
          </div>
          <span className="text-sm text-gray-400">{item.score}%</span>
        </div>
      ))}
    </div>
  );
}

function QuickActions() {
  const navigate = useNavigate();
  
  const actions = [
    { label: 'Provision License', icon: <CreditCard className="w-4 h-4" />, onClick: () => navigate('/sales/provision') },
    { label: 'Switch AI Provider', icon: <Brain className="w-4 h-4" />, onClick: () => navigate('/ai-providers/switch') },
    { label: 'View Tickets', icon: <Headphones className="w-4 h-4" />, onClick: () => navigate('/support/tickets') },
    { label: 'System Backup', icon: <Server className="w-4 h-4" />, onClick: () => navigate('/resources/backup') },
  ];

  return (
    <div className="space-y-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="w-full flex items-center gap-3 p-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="p-1 bg-coral-600 rounded text-white">
            {action.icon}
          </div>
          <span className="text-sm text-white">{action.label}</span>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const { 
    metrics, 
    aiProviders 
  } = usePlatformStore();

  // Initialize WebSocket connection (for future real-time updates)
  useWebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3001');

  // Use mock data for now, in production would use real metrics
  const platformMetrics = metrics || mockMetrics;
  const providers = aiProviders.length > 0 ? aiProviders : mockAIProviders;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              AIVO Platform Command Center
            </h1>
            <p className="text-gray-400">
              Super Admin Dashboard • Full Platform Control • 
              {new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </header>

      {/* Executive KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <KPICard
          title="Revenue"
          value={`$${(platformMetrics.revenue.mrr / 1000).toFixed(0)}K`}
          subtitle="MRR"
          change={platformMetrics.revenue.growth}
          icon={<DollarSign className="w-5 h-5" />}
          color="emerald"
          onClick={() => navigate('/sales')}
        />
        <KPICard
          title="Districts"
          value={platformMetrics.districts.total}
          subtitle={`${platformMetrics.districts.active} active`}
          change={platformMetrics.districts.growth}
          icon={<Building2 className="w-5 h-5" />}
          color="blue"
          onClick={() => navigate('/sales/clients')}
        />
        <KPICard
          title="Users"
          value={`${(platformMetrics.users.total / 1000).toFixed(0)}K`}
          subtitle={`${(platformMetrics.users.activeDaily / 1000).toFixed(0)}K DAU`}
          change={platformMetrics.users.growth}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          onClick={() => navigate('/users')}
        />
        <KPICard
          title="AI Models"
          value={platformMetrics.ai.totalModels}
          subtitle={`${platformMetrics.ai.accuracy}% accuracy`}
          icon={<Brain className="w-5 h-5" />}
          color="pink"
          onClick={() => navigate('/ai-providers')}
        />
        <KPICard
          title="Uptime"
          value={`${platformMetrics.system.uptime}%`}
          subtitle="Last 30d"
          status={platformMetrics.system.uptime > 99.9 ? 'excellent' : 'warning'}
          icon={<Activity className="w-5 h-5" />}
          color="green"
          onClick={() => navigate('/resources')}
        />
        <KPICard
          title="Support"
          value={platformMetrics.support.openTickets}
          subtitle="Open tickets"
          urgency={platformMetrics.support.critical > 0}
          icon={<Headphones className="w-5 h-5" />}
          color="orange"
          onClick={() => navigate('/support')}
        />
        <KPICard
          title="API Calls"
          value={`${(platformMetrics.api.dailyCalls / 1000000).toFixed(1)}M`}
          subtitle="Today"
          change={platformMetrics.api.growth}
          icon={<Zap className="w-5 h-5" />}
          color="yellow"
          onClick={() => navigate('/api')}
        />
        <KPICard
          title="Security"
          value={platformMetrics.security.score}
          subtitle="Score"
          status={platformMetrics.security.threats > 0 ? 'critical' : 'excellent'}
          icon={<Shield className="w-5 h-5" />}
          color="red"
          onClick={() => navigate('/governance')}
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Provider Management Panel */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                AI Provider Orchestration
              </h2>
              <button 
                onClick={() => navigate('/ai-providers')}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Manage Providers <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <AIProviderStatus providers={providers} />
            
            {/* Provider Actions */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Active Provider</span>
                <select className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                  <option>OpenAI GPT-4</option>
                  <option>Google Gemini Pro</option>
                  <option>Anthropic Claude 3</option>
                  <option>Meta Llama 3</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/ai-providers/switch')}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Manual Switch
                </button>
                <button 
                  onClick={() => navigate('/ai-providers/failover')}
                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  Configure Failover
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Sales Dashboard */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Enterprise Sales Pipeline
              </h2>
              <button 
                onClick={() => navigate('/sales')}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Sales Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Pipeline Value</p>
                <p className="text-xl font-bold text-white">$2.4M</p>
                <p className="text-xs text-green-400">12 deals</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">This Quarter</p>
                <p className="text-xl font-bold text-white">$847K</p>
                <p className="text-xs text-green-400">87% of target</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Win Rate</p>
                <p className="text-xl font-bold text-white">34%</p>
                <p className="text-xs text-yellow-400">↑ 5% MoM</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/sales/provision')}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium"
              >
                Provision License
              </button>
              <button
                onClick={() => navigate('/sales/quote')}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                Generate Quote
              </button>
              <button
                onClick={() => navigate('/sales/contracts')}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                View Contracts
              </button>
            </div>
          </div>

          {/* RBAC Management */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Role-Based Access Control
              </h2>
              <button 
                onClick={() => navigate('/rbac')}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Manage RBAC <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Total Roles</p>
                <p className="text-xl font-bold text-white">24</p>
                <p className="text-xs text-gray-500">3 custom</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Active Users</p>
                <p className="text-xl font-bold text-white">1,847</p>
                <p className="text-xs text-green-400">↑ 156 this week</p>
              </div>
            </div>
          </div>

          {/* Technical Support Center */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Headphones className="w-5 h-5 text-orange-500" />
                Technical Support Center
              </h2>
              <button 
                onClick={() => navigate('/support')}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Support Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-800 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Open</p>
                <p className="text-lg font-bold text-white">{platformMetrics.support.openTickets}</p>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Critical</p>
                <p className="text-lg font-bold text-red-400">{platformMetrics.support.critical}</p>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Avg Response</p>
                <p className="text-lg font-bold text-white">{platformMetrics.support.avgResponseTime}m</p>
              </div>
              <div className="bg-gray-800 rounded p-2 text-center">
                <p className="text-xs text-gray-400">CSAT</p>
                <p className="text-lg font-bold text-green-400">{platformMetrics.support.satisfaction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1 col */}
        <div className="space-y-6">
          {/* System Health Monitor */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              System Health
            </h3>
            <SystemHealthMonitor />
          </div>

          {/* Live Operations Feed */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              Live Operations
            </h3>
            <OperationsFeed />
          </div>

          {/* Compliance Status */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Compliance Status
            </h3>
            <ComplianceWidget />
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h3>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
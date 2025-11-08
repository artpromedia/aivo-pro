import { useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { 
  Server, Monitor, HardDrive, Cpu, MemoryStick,
  Network, Settings,
  RefreshCw, Download, Upload, Zap, Clock
} from 'lucide-react';

interface ResourceMetrics {
  cpu: { usage: number; cores: number; temperature: number };
  memory: { used: number; total: number; percentage: number };
  storage: { used: number; total: number; percentage: number };
  network: { inbound: number; outbound: number; latency: number };
  services: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memory: number;
    cpu: number;
  }>;
}

const mockMetrics: ResourceMetrics = {
  cpu: { usage: 34, cores: 16, temperature: 65 },
  memory: { used: 24.6, total: 64, percentage: 38 },
  storage: { used: 1.2, total: 5.0, percentage: 24 },
  network: { inbound: 145, outbound: 89, latency: 12 },
  services: [
    { name: 'API Gateway', status: 'healthy', uptime: 99.98, memory: 2.1, cpu: 15 },
    { name: 'AI Engine', status: 'healthy', uptime: 99.94, memory: 8.4, cpu: 45 },
    { name: 'Database', status: 'warning', uptime: 99.85, memory: 12.8, cpu: 28 },
    { name: 'Analytics', status: 'healthy', uptime: 99.99, memory: 3.2, cpu: 18 },
    { name: 'WebSocket', status: 'healthy', uptime: 99.97, memory: 1.8, cpu: 8 },
  ]
};

// Sub-route Components
const SystemBackup: React.FC = () => {
  const toast = useToast();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">System Backup</h1>
      <div className="grid gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Backup Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Backup Type</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                <option>Full System Backup</option>
                <option>Database Only</option>
                <option>Configuration Backup</option>
                <option>User Data Backup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                <option>Manual (Now)</option>
                <option>Daily at 2:00 AM</option>
                <option>Weekly on Sunday</option>
                <option>Monthly on 1st</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => toast.success('Backup initiated successfully!')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Start Backup
              </button>
              <button 
                onClick={() => toast.info('Backup configuration saved')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Backups</h2>
          <div className="space-y-3">
            {[
              { date: '2024-11-07 02:00', type: 'Full System', size: '2.4 GB', status: 'completed' },
              { date: '2024-11-06 02:00', type: 'Full System', size: '2.3 GB', status: 'completed' },
              { date: '2024-11-05 02:00', type: 'Full System', size: '2.2 GB', status: 'completed' },
            ].map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{backup.type}</p>
                  <p className="text-sm text-gray-400">{backup.date} • {backup.size}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {backup.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceManagementMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'backup' | 'scaling'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: <Monitor className="w-4 h-4" /> },
    { id: 'servers', label: 'Server Management', icon: <Server className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup & Recovery', icon: <Download className="w-4 h-4" /> },
    { id: 'scaling', label: 'Auto Scaling', icon: <Zap className="w-4 h-4" /> },
  ];

  const ResourceCard = ({ title, value, unit, percentage, icon, status }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-coral-500 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            status === 'healthy' ? 'bg-green-500/20 text-green-400' :
            status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          status === 'healthy' ? 'bg-green-400' :
          status === 'warning' ? 'bg-yellow-400' :
          'bg-red-400'
        }`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-gray-400">{unit}</span>
        </div>
        
        {percentage !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Usage</span>
              <span className="text-white">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  percentage > 80 ? 'bg-red-500' :
                  percentage > 60 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resource Management</h1>
          <p className="text-gray-400">Monitor and manage system resources, servers, and infrastructure</p>
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
          </select>
          
          <button 
            onClick={() => {
              toast.info('Refreshing Resource Data', 'Updating all system metrics...');
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
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
          {/* System Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard
              title="CPU"
              value={mockMetrics.cpu.usage}
              unit="%"
              percentage={mockMetrics.cpu.usage}
              icon={<Cpu className="w-5 h-5" />}
              status={mockMetrics.cpu.usage > 80 ? 'critical' : mockMetrics.cpu.usage > 60 ? 'warning' : 'healthy'}
            />
            <ResourceCard
              title="Memory"
              value={`${mockMetrics.memory.used}GB`}
              unit={`/ ${mockMetrics.memory.total}GB`}
              percentage={mockMetrics.memory.percentage}
              icon={<MemoryStick className="w-5 h-5" />}
              status={mockMetrics.memory.percentage > 85 ? 'critical' : mockMetrics.memory.percentage > 70 ? 'warning' : 'healthy'}
            />
            <ResourceCard
              title="Storage"
              value={`${mockMetrics.storage.used}TB`}
              unit={`/ ${mockMetrics.storage.total}TB`}
              percentage={mockMetrics.storage.percentage}
              icon={<HardDrive className="w-5 h-5" />}
              status={mockMetrics.storage.percentage > 90 ? 'critical' : mockMetrics.storage.percentage > 75 ? 'warning' : 'healthy'}
            />
            <ResourceCard
              title="Network"
              value={`${mockMetrics.network.inbound}MB/s`}
              unit="Inbound"
              icon={<Network className="w-5 h-5" />}
              status="healthy"
            />
          </div>

          {/* Services Status */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Service Status</h2>
              <p className="text-gray-400">Real-time status of all system services</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockMetrics.services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-400' :
                        service.status === 'warning' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <div>
                        <h3 className="font-medium text-white">{service.name}</h3>
                        <p className="text-sm text-gray-400">Uptime: {service.uptime}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-400">Memory</p>
                        <p className="text-white font-medium">{service.memory}GB</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">CPU</p>
                        <p className="text-white font-medium">{service.cpu}%</p>
                      </div>
                      <button 
                        onClick={() => toast.info(`Service Configuration: ${service.name}`, 'Opening service settings...')}
                        className="text-coral-400 hover:text-coral-300 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Backup & Recovery Center</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Last Backup</h3>
                <p className="text-2xl font-bold text-green-400 mb-1">2 hours ago</p>
                <p className="text-sm text-gray-400">Full system backup completed</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Backup Size</h3>
                <p className="text-2xl font-bold text-blue-400 mb-1">1.2 TB</p>
                <p className="text-sm text-gray-400">Compressed backup archive</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Recovery Time</h3>
                <p className="text-2xl font-bold text-yellow-400 mb-1">&lt; 30min</p>
                <p className="text-sm text-gray-400">Estimated full recovery</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Create System Backup',
                    description: 'This will create a full system backup. Process will take approximately 15 minutes. Continue?',
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.success('Backup Initiated', 'Full system backup process started');
                  }
                }}
                className="flex items-center gap-2 bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Create Backup
              </button>
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Restore from Backup',
                    description: 'Are you sure you want to restore from backup? This will overwrite current data.',
                    type: 'danger'
                  });
                  if (confirmed) {
                    toast.success('Restore Initiated', 'System restore process started');
                  }
                }}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Restore from Backup
              </button>
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Schedule Backup',
                    description: 'Open the backup scheduling configuration?',
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.info('Backup Scheduling', 'Opening backup configuration modal...');
                  }
                }}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Clock className="w-4 h-4" />
                Schedule Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {activeTab !== 'overview' && activeTab !== 'backup' && (
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
};

export default function ResourceManagement() {
  return (
    <Routes>
      <Route path="/" element={<ResourceManagementMain />} />
      <Route path="/backup" element={<SystemBackup />} />
    </Routes>
  );
}
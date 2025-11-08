import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { 
  Activity, 
  Server, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Search,
  Eye,
  AlertCircle,
  Info,
  BarChart3,
  LineChart
} from 'lucide-react';

// Define types for system monitoring
interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  uptime: number; // percentage
  responseTime: number; // ms
  lastCheck: string;
  endpoint: string;
  version: string;
  dependencies: string[];
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  source: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  resolvedAt?: string;
  actions: string[];
}

// Future interface for performance analytics
/*
interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  activeUsers: number;
}
*/

const SystemMonitoring: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'services' | 'metrics' | 'alerts' | 'performance'>('overview');
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  // Mock data
  const systemHealth = {
    overall: 98.7,
    services: 12,
    servicesOnline: 11,
    activeAlerts: 3,
    criticalAlerts: 1,
    avgResponseTime: 245,
    uptime: 99.95
  };

  const systemMetrics: SystemMetric[] = [
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 67.5,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 80, critical: 90 },
      trend: 'up',
      lastUpdated: '2024-01-15T12:30:00Z'
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 84.2,
      unit: '%',
      status: 'warning',
      threshold: { warning: 80, critical: 95 },
      trend: 'stable',
      lastUpdated: '2024-01-15T12:30:00Z'
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      value: 56.8,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 80, critical: 90 },
      trend: 'up',
      lastUpdated: '2024-01-15T12:30:00Z'
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 234.7,
      unit: 'Mbps',
      status: 'healthy',
      threshold: { warning: 800, critical: 950 },
      trend: 'down',
      lastUpdated: '2024-01-15T12:30:00Z'
    },
    {
      id: 'response',
      name: 'Avg Response Time',
      value: 245,
      unit: 'ms',
      status: 'healthy',
      threshold: { warning: 500, critical: 1000 },
      trend: 'stable',
      lastUpdated: '2024-01-15T12:30:00Z'
    },
    {
      id: 'users',
      name: 'Active Users',
      value: 1547,
      unit: '',
      status: 'healthy',
      threshold: { warning: 2000, critical: 2500 },
      trend: 'up',
      lastUpdated: '2024-01-15T12:30:00Z'
    }
  ];

  const services: ServiceStatus[] = [
    {
      id: 'api-gateway',
      name: 'API Gateway',
      status: 'online',
      uptime: 99.97,
      responseTime: 125,
      lastCheck: '2024-01-15T12:29:45Z',
      endpoint: '/api/health',
      version: 'v2.1.4',
      dependencies: ['auth-service', 'database']
    },
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'online',
      uptime: 99.95,
      responseTime: 89,
      lastCheck: '2024-01-15T12:29:42Z',
      endpoint: '/auth/health',
      version: 'v1.8.2',
      dependencies: ['database', 'redis']
    },
    {
      id: 'database',
      name: 'Primary Database',
      status: 'online',
      uptime: 99.99,
      responseTime: 12,
      lastCheck: '2024-01-15T12:29:48Z',
      endpoint: 'tcp:5432',
      version: 'PostgreSQL 14.2',
      dependencies: []
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      status: 'online',
      uptime: 99.98,
      responseTime: 3,
      lastCheck: '2024-01-15T12:29:50Z',
      endpoint: 'tcp:6379',
      version: 'Redis 7.0.5',
      dependencies: []
    },
    {
      id: 'storage',
      name: 'File Storage',
      status: 'degraded',
      uptime: 97.3,
      responseTime: 567,
      lastCheck: '2024-01-15T12:29:38Z',
      endpoint: '/storage/health',
      version: 'v3.2.1',
      dependencies: []
    },
    {
      id: 'notification',
      name: 'Notification Service',
      status: 'maintenance',
      uptime: 0,
      responseTime: 0,
      lastCheck: '2024-01-15T10:15:00Z',
      endpoint: '/notify/health',
      version: 'v1.4.6',
      dependencies: ['queue-service']
    }
  ];

  const alerts: Alert[] = [
    {
      id: 'alert-001',
      title: 'High Memory Usage',
      description: 'Memory usage has exceeded 80% threshold on production servers',
      severity: 'warning',
      timestamp: '2024-01-15T12:25:00Z',
      source: 'infrastructure-monitor',
      status: 'active',
      actions: ['Scale up instances', 'Investigate memory leaks', 'Clear caches']
    },
    {
      id: 'alert-002',
      title: 'File Storage Performance Degraded',
      description: 'Response times for file storage operations have increased significantly',
      severity: 'error',
      timestamp: '2024-01-15T11:45:00Z',
      source: 'storage-service',
      status: 'acknowledged',
      assignedTo: 'DevOps Team',
      actions: ['Check disk I/O', 'Review storage capacity', 'Restart storage nodes']
    },
    {
      id: 'alert-003',
      title: 'Scheduled Maintenance Complete',
      description: 'Notification service maintenance window completed successfully',
      severity: 'info',
      timestamp: '2024-01-15T10:30:00Z',
      source: 'maintenance-scheduler',
      status: 'resolved',
      resolvedAt: '2024-01-15T10:30:00Z',
      actions: ['Verify service functionality', 'Update monitoring']
    },
    {
      id: 'alert-004',
      title: 'Critical: Database Connection Pool Exhausted',
      description: 'All database connections are in use, new requests are being queued',
      severity: 'critical',
      timestamp: '2024-01-15T09:15:00Z',
      source: 'database-monitor',
      status: 'resolved',
      assignedTo: 'Database Team',
      resolvedAt: '2024-01-15T09:45:00Z',
      actions: ['Increase connection pool size', 'Identify long-running queries']
    }
  ];

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: Activity },
    { id: 'services', name: 'Service Status', icon: Server },
    { id: 'metrics', name: 'System Metrics', icon: BarChart3 },
    { id: 'alerts', name: 'Alerts & Events', icon: Bell },
    { id: 'performance', name: 'Performance', icon: LineChart }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
      case 'degraded':
      case 'acknowledged': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
      case 'offline':
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance':
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'active': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'degraded':
      case 'acknowledged': return <AlertTriangle className="h-4 w-4" />;
      case 'critical':
      case 'offline':
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'maintenance':
      case 'info': return <Info className="h-4 w-4" />;
      case 'active': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <span className="h-4 w-4 bg-gray-400 rounded-full"></span>;
      default: return <span className="h-4 w-4 bg-gray-400 rounded-full"></span>;
    }
  };

  const getMetricIcon = (id: string) => {
    switch (id) {
      case 'cpu': return <Cpu className="h-5 w-5" />;
      case 'memory': return <MemoryStick className="h-5 w-5" />;
      case 'disk': return <HardDrive className="h-5 w-5" />;
      case 'network': return <Wifi className="h-5 w-5" />;
      case 'response': return <Zap className="h-5 w-5" />;
      case 'users': return <Globe className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health & Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Real-time infrastructure monitoring and alerting dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>{isRealTime ? 'Live' : 'Paused'}</span>
          </div>
          <button 
            onClick={() => setIsRealTime(!isRealTime)}
            className={`p-2 rounded-lg transition-colors ${
              isRealTime ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-100'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isRealTime ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              const exportData = {
                timestamp: new Date().toISOString(),
                systemHealth,
                systemMetrics: systemMetrics.map(metric => ({
                  name: metric.name,
                  value: `${metric.value}${metric.unit}`,
                  status: metric.status,
                  trend: metric.trend,
                  lastUpdated: metric.lastUpdated
                })),
                services: services.map(service => ({
                  name: service.name,
                  status: service.status,
                  uptime: `${service.uptime}%`,
                  responseTime: `${service.responseTime}ms`
                }))
              };
              const jsonData = JSON.stringify(exportData, null, 2);
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `system-monitoring-report-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={async () => {
              const confirmed = await confirm({
                title: 'System Configuration',
                description: 'Open the system configuration panel?',
                type: 'info'
              });
              if (confirmed) {
                toast.info('System Configuration', 'Opening configuration panel...');
                // In real app, open configuration modal
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
          >
            <Settings className="h-4 w-4" />
            Configure
          </button>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Health</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{systemHealth.overall}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${systemHealth.overall}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Last updated: {formatDateTime(lastUpdated.toISOString())}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services Online</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {systemHealth.servicesOnline}/{systemHealth.services}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{systemHealth.activeAlerts}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{systemHealth.criticalAlerts}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{systemHealth.avgResponseTime}ms</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{formatUptime(systemHealth.uptime)}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-coral-50 text-coral-700 border border-coral-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* System Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemMetrics.map((metric) => (
                  <motion.div
                    key={metric.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                          {getMetricIcon(metric.id)}
                        </div>
                        <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                        <span className="text-lg text-gray-600 mb-1">{metric.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'healthy' ? 'bg-green-600' :
                            metric.status === 'warning' ? 'bg-orange-600' : 'bg-red-600'
                          }`}
                          style={{ 
                            width: `${Math.min((metric.value / (metric.threshold.critical * 1.1)) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                        <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
                  <button 
                    onClick={() => {
                      setSelectedTab('alerts');
                      const criticalCount = alerts.filter(a => a.severity === 'critical').length;
                      const warningCount = alerts.filter(a => a.severity === 'warning').length;
                      const infoCount = alerts.filter(a => a.severity === 'info').length;
                      toast.info('Navigating to Alerts', `Viewing ${alerts.length} alerts (${criticalCount} critical, ${warningCount} warning, ${infoCount} info)`);
                    }}
                    className="text-coral-600 hover:text-coral-700 text-sm font-medium"
                  >
                    View All Alerts
                  </button>
                </div>
                <div className="space-y-4">
                  {alerts.slice(0, 3).map((alert) => (
                    <motion.div
                      key={alert.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(alert.status)}`}>
                              {alert.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-500">{alert.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDateTime(alert.timestamp)}</p>
                        {alert.assignedTo && (
                          <p className="text-xs text-gray-600">Assigned to {alert.assignedTo}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Tab */}
          {selectedTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Service Status Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.version}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Uptime</p>
                          <p className="text-lg font-semibold text-gray-900">{formatUptime(service.uptime)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Response Time</p>
                          <p className="text-lg font-semibold text-gray-900">{service.responseTime}ms</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Endpoint</p>
                        <p className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded font-mono">
                          {service.endpoint}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Dependencies</p>
                        <div className="flex flex-wrap gap-2">
                          {service.dependencies.length > 0 ? (
                            service.dependencies.map((dep, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                              >
                                {dep}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No dependencies</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600">
                          Last check: {formatDateTime(service.lastCheck)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              toast.info(`Service Details: ${service.name}`, `Status: ${service.status} | Uptime: ${service.uptime}% | Response: ${service.responseTime}ms`);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="View Service Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              toast.info(`Service Configuration: ${service.name}`, 'Opening configuration panel...');
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Configure Service Settings"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Alerts Tab */}
          {selectedTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Alert Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      />
                    </div>
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>

              {/* Alert List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(alert.severity)}`}>
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <p className="text-gray-600 text-sm">{alert.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Severity</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border w-fit ${getStatusColor(alert.severity)}`}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border w-fit ${getStatusColor(alert.status)}`}>
                              {alert.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-600">Source</p>
                            <p className="text-sm text-gray-900">{alert.source}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-600">Timestamp</p>
                            <p className="text-sm text-gray-900">{formatDateTime(alert.timestamp)}</p>
                            {alert.resolvedAt && (
                              <p className="text-xs text-gray-600">Resolved: {formatDateTime(alert.resolvedAt)}</p>
                            )}
                          </div>
                        </div>

                        {alert.assignedTo && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600">Assigned To</p>
                            <p className="text-sm text-gray-900">{alert.assignedTo}</p>
                          </div>
                        )}

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Suggested Actions</p>
                          <div className="flex flex-wrap gap-2">
                            {alert.actions.map((action, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              const actionType = alert.status === 'active' ? 'acknowledge' : 'view details';
                              if (actionType === 'acknowledge') {
                                toast.success(`Alert Acknowledged: ${alert.title}`, `${alert.severity.toUpperCase()} alert assigned to current user`);
                              } else {
                                toast.info(`Alert Details: ${alert.title}`, `${alert.severity.toUpperCase()} | Source: ${alert.source}`);
                              }
                            }}
                            className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 text-sm"
                          >
                            {alert.status === 'active' ? 'Acknowledge' : 'View Details'}
                          </button>
                          {alert.status === 'acknowledged' && (
                            <button 
                              onClick={async () => {
                                const confirmed = await confirm({
                                  title: `Resolve Alert: ${alert.title}`,
                                  description: 'This will mark the alert as resolved and update system status. Continue?',
                                  type: 'info'
                                });
                                if (confirmed) {
                                  toast.success(`Alert Resolved: ${alert.title}`, `Resolved by current user at ${new Date().toLocaleString()}`);
                                }
                              }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                            >
                              Mark Resolved
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              toast.info(`Edit Alert Configuration: ${alert.title}`, 'Opening alert editor...');
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Placeholder for other tabs */}
          {(selectedTab === 'metrics' || selectedTab === 'performance') && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {selectedTab === 'metrics' && <BarChart3 className="h-8 w-8 text-gray-400" />}
                  {selectedTab === 'performance' && <LineChart className="h-8 w-8 text-gray-400" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedTab === 'metrics' && 'Detailed System Metrics'}
                  {selectedTab === 'performance' && 'Performance Analytics'}
                </h3>
                <p className="text-gray-600">
                  {selectedTab === 'metrics' && 'Comprehensive system metrics with historical data, custom dashboards, and advanced monitoring capabilities.'}
                  {selectedTab === 'performance' && 'In-depth performance analytics with trend analysis, capacity planning, and predictive insights.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SystemMonitoring;
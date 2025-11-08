import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { 
  Clock, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Download,
  Phone,
  Zap,
  Shield,
  BarChart3,
  TrendingUp,
  Flag,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Bookmark,
  Star,
  FileText
} from 'lucide-react';

// Define types for support data
interface SupportTicket {
  id: string;
  title: string;
  description: string;
  customer: {
    name: string;
    email: string;
    company: string;
    plan: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'pending-customer' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'integration';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  responseTime: number; // in minutes
  resolutionTime?: number; // in minutes
  tags: string[];
  satisfaction?: number; // 1-5 rating
}

interface SLAMetrics {
  responseTime: {
    target: number;
    actual: number;
    percentage: number;
  };
  resolutionTime: {
    target: number;
    actual: number;
    percentage: number;
  };
  customerSatisfaction: {
    average: number;
    target: number;
    responses: number;
  };
  firstCallResolution: {
    percentage: number;
    target: number;
  };
}

// Sub-route Components
const SupportTickets: React.FC = () => {
  const toast = useToast();
  
  const mockTickets = [
    { id: 'TKT-001', title: 'Login issues with new users', priority: 'high', status: 'open', created: '2 hours ago' },
    { id: 'TKT-002', title: 'Performance slow in dashboard', priority: 'medium', status: 'in-progress', created: '4 hours ago' },
    { id: 'TKT-003', title: 'Feature request: Export reports', priority: 'low', status: 'pending', created: '1 day ago' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Support Tickets</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All Tickets</h2>
          <button 
            onClick={() => toast.success('New ticket created successfully!')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Create Ticket
          </button>
        </div>
        <div className="space-y-4">
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{ticket.title}</h3>
                  <p className="text-sm text-gray-400">{ticket.id} • {ticket.created}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TechnicalSupportMain: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tickets' | 'sla' | 'knowledge' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  // Mock data
  const supportMetrics = {
    totalTickets: 342,
    openTickets: 45,
    averageResponseTime: 12, // minutes
    customerSatisfaction: 4.6,
    resolvedToday: 28,
    escalatedTickets: 3
  };

  const slaMetrics: SLAMetrics = {
    responseTime: {
      target: 15,
      actual: 12,
      percentage: 94.2
    },
    resolutionTime: {
      target: 240,
      actual: 185,
      percentage: 87.5
    },
    customerSatisfaction: {
      average: 4.6,
      target: 4.5,
      responses: 156
    },
    firstCallResolution: {
      percentage: 78.3,
      target: 75
    }
  };

  const recentTickets: SupportTicket[] = [
    {
      id: 'SUP-001',
      title: 'Unable to access dashboard after update',
      description: 'Customer reports 500 error when trying to access main dashboard',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        company: 'TechCorp Inc.',
        plan: 'Enterprise'
      },
      priority: 'high',
      status: 'in-progress',
      category: 'technical',
      assignedTo: 'Alice Chen',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      slaDeadline: '2024-01-15T14:30:00Z',
      responseTime: 15,
      tags: ['dashboard', 'login-issue', 'urgent'],
      satisfaction: undefined
    },
    {
      id: 'SUP-002',
      title: 'Billing discrepancy for December invoice',
      description: 'Customer questioning charges for additional seats not used',
      customer: {
        name: 'Michael Davis',
        email: 'mdavis@edumax.com',
        company: 'EduMax Solutions',
        plan: 'Professional'
      },
      priority: 'medium',
      status: 'pending-customer',
      category: 'billing',
      assignedTo: 'Bob Wilson',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:30:00Z',
      slaDeadline: '2024-01-16T14:20:00Z',
      responseTime: 45,
      tags: ['billing', 'invoice', 'seats'],
      satisfaction: undefined
    },
    {
      id: 'SUP-003',
      title: 'Feature request: Bulk user import',
      description: 'Customer wants to import 1000+ users via CSV upload',
      customer: {
        name: 'Jennifer Lopez',
        email: 'jlopez@globallearning.com',
        company: 'Global Learning Co',
        plan: 'Enterprise'
      },
      priority: 'low',
      status: 'open',
      category: 'feature-request',
      assignedTo: 'Carol Smith',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-13T16:45:00Z',
      slaDeadline: '2024-01-17T16:45:00Z',
      responseTime: 0,
      tags: ['feature-request', 'bulk-import', 'csv'],
      satisfaction: undefined
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'tickets', name: 'Support Tickets', icon: MessageSquare },
    { id: 'sla', name: 'SLA Management', icon: Clock },
    { id: 'knowledge', name: 'Knowledge Base', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'pending-customer': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Flag className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTickets = recentTickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technical Support Center</h1>
          <p className="text-gray-600 mt-2">
            Manage support tickets, SLA tracking, and customer assistance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const ticketData = recentTickets.map((ticket: SupportTicket) => ({
                ID: ticket.id,
                Title: ticket.title,
                Customer: ticket.customer.name,
                Company: ticket.customer.company,
                Priority: ticket.priority,
                Status: ticket.status,
                Category: ticket.category,
                Assignee: ticket.assignedTo,
                Created: ticket.createdAt,
                'SLA Deadline': ticket.slaDeadline,
                'Response Time': `${ticket.responseTime} min`,
                Tags: ticket.tags.join('; ')
              }));
              const csv = [
                Object.keys(ticketData[0]).join(','),
                ...ticketData.map((row: any) => Object.values(row).map(val => `"${val}"`).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'support-tickets-export.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => {
              const newTicket = {
                id: `T-${Date.now()}`,
                title: 'New Support Request',
                customer: 'Customer Name',
                priority: 'medium' as const,
                status: 'open' as const,
                category: 'technical',
                assignedTo: 'Support Team',
                createdAt: new Date().toISOString().split('T')[0],
                slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Customer support request description'
              };
              toast.success(`New ticket created: ${newTicket.id}`, `Ticket "${newTicket.title}" assigned to ${newTicket.assignedTo}`);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{supportMetrics.totalTickets}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
            <span className="text-sm text-blue-600 font-medium">+12%</span>
            <span className="text-sm text-gray-600 ml-1">this month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{supportMetrics.openTickets}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <AlertTriangle className="h-4 w-4 text-orange-600 mr-1" />
            <span className="text-sm text-orange-600 font-medium">{supportMetrics.escalatedTickets} escalated</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{supportMetrics.averageResponseTime}m</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">Under SLA</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{supportMetrics.customerSatisfaction}/5</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <Star className="h-4 w-4 text-purple-600 mr-1" />
            <span className="text-sm text-purple-600 font-medium">Excellent</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-coral-600 mt-1">{supportMetrics.resolvedToday}</p>
            </div>
            <div className="p-3 bg-coral-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-coral-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-coral-600 mr-1" />
            <span className="text-sm text-coral-600 font-medium">+8%</span>
            <span className="text-sm text-gray-600 ml-1">vs yesterday</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">First Call Resolution</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">78%</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Phone className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <Shield className="h-4 w-4 text-indigo-600 mr-1" />
            <span className="text-sm text-indigo-600 font-medium">Above target</span>
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
              {/* SLA Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Response Time SLA */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Response Time SLA</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-md ${
                      slaMetrics.responseTime.percentage >= 90 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                    }`}>
                      {slaMetrics.responseTime.percentage}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium">{slaMetrics.responseTime.target} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual</span>
                      <span className="font-medium">{slaMetrics.responseTime.actual} minutes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          slaMetrics.responseTime.percentage >= 90 ? 'bg-green-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${Math.min(slaMetrics.responseTime.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Resolution Time SLA */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Resolution Time SLA</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-md ${
                      slaMetrics.resolutionTime.percentage >= 90 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                    }`}>
                      {slaMetrics.resolutionTime.percentage}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium">{slaMetrics.resolutionTime.target} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual</span>
                      <span className="font-medium">{slaMetrics.resolutionTime.actual} minutes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          slaMetrics.resolutionTime.percentage >= 90 ? 'bg-green-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${Math.min(slaMetrics.resolutionTime.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h3>
                  <button 
                    onClick={() => {
                      setSelectedTab('tickets');
                      toast.info('Navigating to Ticket Management', `Viewing all ${recentTickets.length} tickets`);
                    }}
                    className="text-coral-600 hover:text-coral-700 text-sm font-medium"
                  >
                    View All Tickets
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTickets.slice(0, 3).map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ticket.title}</p>
                          <p className="text-sm text-gray-600">{ticket.customer.name} - {ticket.customer.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-500">{ticket.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDateTime(ticket.createdAt)}</p>
                        <p className="text-xs text-gray-600">Assigned to {ticket.assignedTo}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tickets Tab */}
          {selectedTab === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Ticket Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
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
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending-customer">Pending Customer</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button 
                    onClick={async () => {
                      const newTicketId = `T-${Date.now()}`;
                      const confirmed = await confirm({
                        title: 'Create New Support Ticket',
                        description: 'Open the ticket creation form?',
                        type: 'info'
                      });
                      if (confirmed) {
                        toast.success('Creating new ticket', `Ticket ID: ${newTicketId} - Opening creation form...`);
                        // In real app, open ticket creation modal
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
                  >
                    <Plus className="h-4 w-4" />
                    New Ticket
                  </button>
                </div>
              </div>

              {/* Ticket List */}
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`p-2 rounded-lg ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityIcon(ticket.priority)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                            <p className="text-gray-600 text-sm">{ticket.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{ticket.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Customer</p>
                            <p className="text-sm text-gray-900">{ticket.customer.name}</p>
                            <p className="text-xs text-gray-600">{ticket.customer.company}</p>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{ticket.customer.plan}</span>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-600">Status & Priority</p>
                            <div className="flex flex-col gap-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md border w-fit ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-md border w-fit ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-600">Assignment</p>
                            <p className="text-sm text-gray-900">{ticket.assignedTo}</p>
                            <p className="text-xs text-gray-600">{ticket.category}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-600">Timing</p>
                            <p className="text-sm text-gray-900">Created: {formatDateTime(ticket.createdAt)}</p>
                            <p className="text-xs text-gray-600">Response: {formatTime(ticket.responseTime)}</p>
                            {ticket.resolutionTime && (
                              <p className="text-xs text-gray-600">Resolution: {formatTime(ticket.resolutionTime)}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {ticket.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                toast.info(`Ticket Details: ${ticket.id}`, `Viewing "${ticket.title}" - ${ticket.status.toUpperCase()}`);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                toast.info(`Editing Ticket: ${ticket.id}`, `Opening editor for "${ticket.title}"`);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                const bookmarked = Math.random() > 0.5;
                                toast.success(`Bookmark ${bookmarked ? 'Added' : 'Removed'}`, `Ticket "${ticket.title}" ${bookmarked ? 'bookmarked' : 'removed from bookmarks'}`);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                const actions = [
                                  'Escalate to supervisor',
                                  'Transfer to specialist',
                                  'Update priority level',
                                  'Schedule follow-up',
                                  'Close ticket',
                                  'Merge with related ticket'
                                ];
                                const action = actions[Math.floor(Math.random() * actions.length)];
                                toast.info(`Ticket Management: ${ticket.id}`, `Action: ${action} for "${ticket.title}"`);
                              }}
                              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 text-sm"
                            >
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Knowledge Base Tab */}
          {selectedTab === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
                      <p className="text-gray-600">Manage support articles and documentation</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newArticle = {
                          id: `KB-${Date.now()}`,
                          title: 'New Knowledge Base Article',
                          category: 'General',
                          author: 'Support Team',
                          status: 'Draft',
                          created: new Date().toLocaleDateString()
                        };
                        toast.success(`Knowledge Base Article Created: ${newArticle.id}`, `"${newArticle.title}" - Opening article editor...`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Article
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Articles</h3>
                      <p className="text-2xl font-bold text-gray-900">248</p>
                      <p className="text-sm text-green-600">+12 this month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Views</h3>
                      <p className="text-2xl font-bold text-gray-900">15.2K</p>
                      <p className="text-sm text-blue-600">Last 30 days</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Helpful Rating</h3>
                      <p className="text-2xl font-bold text-gray-900">4.6</p>
                      <p className="text-sm text-green-600">Out of 5.0</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Categories</h3>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">Active topics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search articles..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <select className="border border-gray-300 rounded-lg px-3 py-2">
                        <option>All Categories</option>
                        <option>Getting Started</option>
                        <option>Troubleshooting</option>
                        <option>API Documentation</option>
                        <option>Billing</option>
                      </select>
                    </div>
                    
                    {[
                      { id: 'KB-001', title: 'Getting Started with AIVO Platform', category: 'Getting Started', views: 1250, helpful: 89, lastUpdated: '2024-03-10' },
                      { id: 'KB-002', title: 'Troubleshooting AI Model Errors', category: 'Troubleshooting', views: 890, helpful: 76, lastUpdated: '2024-03-08' },
                      { id: 'KB-003', title: 'API Rate Limits and Best Practices', category: 'API Documentation', views: 567, helpful: 92, lastUpdated: '2024-03-05' },
                      { id: 'KB-004', title: 'Understanding Your Billing Dashboard', category: 'Billing', views: 445, helpful: 84, lastUpdated: '2024-03-02' }
                    ].map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{article.title}</h3>
                            <p className="text-sm text-gray-600">{article.category} • Last updated {article.lastUpdated}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right text-sm">
                            <p className="text-gray-600">{article.views} views</p>
                            <p className="text-green-600">{article.helpful}% helpful</p>
                          </div>
                          <button 
                            onClick={() => {
                              const actions = [
                                'Edit Article',
                                'Update Category',
                                'Archive Article',
                                'View Analytics',
                                'Export to PDF',
                                'Share Article'
                              ];
                              const action = actions[Math.floor(Math.random() * actions.length)];
                              toast.info(`Article Action: ${action}`, `"${article.title}" - ${action} initiated`);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLA Management Tab */}
          {selectedTab === 'sla' && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* SLA Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Critical SLA</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">2h</p>
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '95%' }} />
                    </div>
                    <p className="text-green-400 text-xs mt-1">95% met this month</p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">High Priority</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">4h</p>
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '88%' }} />
                    </div>
                    <p className="text-yellow-400 text-xs mt-1">88% met this month</p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Medium Priority</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">8h</p>
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                    <p className="text-blue-400 text-xs mt-1">92% met this month</p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Low Priority</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">24h</p>
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '97%' }} />
                    </div>
                    <p className="text-green-400 text-xs mt-1">97% met this month</p>
                  </div>
                </div>
              </div>

              {/* SLA Configuration */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">SLA Configuration</h2>
                      <p className="text-gray-400">Configure response and resolution times for different priority levels</p>
                    </div>
                    <button 
                      onClick={async () => {
                        const confirmed = await confirm({
                          title: 'Save SLA Configuration',
                          description: 'Save all SLA configuration changes?',
                          type: 'info'
                        });
                        if (confirmed) {
                          toast.success('SLA Configuration Saved', 'All changes have been successfully applied');
                        }
                      }}
                      className="bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {[
                      { priority: 'Critical', response: '2h', resolution: '8h', escalation: '1h', color: 'red' },
                      { priority: 'High', response: '4h', resolution: '24h', escalation: '2h', color: 'yellow' },
                      { priority: 'Medium', response: '8h', resolution: '48h', escalation: '4h', color: 'blue' },
                      { priority: 'Low', response: '24h', resolution: '120h', escalation: '12h', color: 'green' }
                    ].map((sla) => (
                      <div key={sla.priority} className="p-4 bg-gray-700 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-${sla.color}-400`} />
                            <span className="font-medium text-white">{sla.priority}</span>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Response Time</label>
                            <input 
                              type="text" 
                              defaultValue={sla.response}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Resolution Time</label>
                            <input 
                              type="text" 
                              defaultValue={sla.resolution}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Escalation Time</label>
                            <input 
                              type="text" 
                              defaultValue={sla.escalation}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toast.info('SLA Settings', `Opening editor for ${sla.priority} priority SLA`)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={async () => {
                                const confirmed = await confirm({
                                  title: `Delete ${sla.priority} Priority SLA`,
                                  description: `Are you sure you want to delete the ${sla.priority} priority SLA?`,
                                  type: 'danger'
                                });
                                if (confirmed) {
                                  toast.success('SLA Deleted', `${sla.priority} priority SLA has been removed`);
                                }
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Escalation Rules */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Escalation Rules</h2>
                  <p className="text-gray-400">Automatic escalation when SLA targets are at risk</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { rule: 'Auto-escalate critical tickets after 1 hour without response', enabled: true },
                      { rule: 'Notify manager when SLA breach is imminent (30 min before)', enabled: true },
                      { rule: 'Create incident when multiple high-priority tickets are breached', enabled: false },
                      { rule: 'Send customer notification when resolution time exceeds SLA', enabled: true }
                    ].map((rule, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <span className="text-white">{rule.rule}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                          <button 
                            onClick={() => toast.info('Escalation Rule', `Toggling rule: ${rule.rule}`)}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              rule.enabled ? 'bg-coral-600' : 'bg-gray-600'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              rule.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Support Analytics Tab */}
          {selectedTab === 'analytics' && (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Support Analytics</h3>
                <p className="text-gray-400 mb-6">
                  Detailed analytics on support performance, customer satisfaction, and team productivity with actionable insights.
                </p>
                <button 
                  onClick={() => toast.info('Analytics Configuration', 'Opening analytics configuration modal')}
                  className="bg-coral-600 hover:bg-coral-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Configure Analytics
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function TechnicalSupport() {
  return (
    <Routes>
      <Route path="/" element={<TechnicalSupportMain />} />
      <Route path="/tickets" element={<SupportTickets />} />
    </Routes>
  );
}
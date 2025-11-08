import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText, 
  Target,
  Plus,
  Search,
  Download,
  MoreVertical,
  CreditCard,
  Building,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  PieChart,
  Eye
} from 'lucide-react';
import LicenseManagement from '../components/LicenseManagement';

// Define types for sales data
interface SalesLead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  assignedTo: string;
  createdAt: string;
  nextAction: string;
  probability: number;
}

// Future interfaces for additional functionality
/*
interface License {
  id: string;
  type: 'starter' | 'professional' | 'enterprise' | 'custom';
  seats: number;
  duration: number; // months
  features: string[];
  price: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  salesRep: string;
}

interface QuoteItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  duration: number; // months
}

interface Contract {
  id: string;
  customerName: string;
  customerCompany: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending-signature' | 'active' | 'expired' | 'terminated';
  type: 'standard' | 'enterprise' | 'custom';
  paymentTerms: string;
  renewalTerms: string;
  salesRep: string;
  createdAt: string;
}
*/

// Sub-route Components
const SalesOverview: React.FC = () => {
  // Mock data
  const salesMetrics = {
    totalRevenue: 2850000,
    monthlyGrowth: 12.5,
    totalLeads: 156,
    conversionRate: 24.6,
    activeLicenses: 2340,
    pipelineValue: 1200000
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Sales Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-500">${(salesMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-green-400">+{salesMetrics.monthlyGrowth}% this month</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Pipeline Value</h3>
          <p className="text-3xl font-bold text-blue-500">${(salesMetrics.pipelineValue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-blue-400">{salesMetrics.totalLeads} active leads</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-500">{salesMetrics.conversionRate}%</p>
          <p className="text-sm text-purple-400">Industry average: 20%</p>
        </div>
      </div>
    </div>
  );
};

const LicenseProvisioning: React.FC = () => {
  const toast = useToast();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">License Provisioning</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Provision New License</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">License Type</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>Starter</option>
              <option>Professional</option>
              <option>Enterprise</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Seats</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (months)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="12"
            />
          </div>
        </div>
        <div className="mt-6">
          <button 
            onClick={() => toast.success('License provisioned successfully!')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            Provision License
          </button>
        </div>
      </div>
    </div>
  );
};

const SalesClients: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Client Management</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <p className="text-gray-400">Client management interface coming soon...</p>
      </div>
    </div>
  );
};

const QuoteGenerator: React.FC = () => {
  const toast = useToast();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Quote Generator</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Generate New Quote</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Products/Services</label>
            <textarea 
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white h-24"
              placeholder="Describe products and services"
            />
          </div>
          <button 
            onClick={() => toast.success('Quote generated successfully!')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Generate Quote
          </button>
        </div>
      </div>
    </div>
  );
};

const ContractManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Contract Management</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <p className="text-gray-400">Contract management interface coming soon...</p>
      </div>
    </div>
  );
};

const SalesPortalMain: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'pipeline' | 'licenses' | 'quotes' | 'contracts'>('overview');
  
  const toast = useToast();

  // Mock data
  const salesMetrics = {
    totalRevenue: 2850000,
    monthlyGrowth: 12.5,
    totalLeads: 156,
    conversionRate: 24.6,
    activeLicenses: 2340,
    pipelineValue: 1200000
  };

  const recentActivity = [
    { id: '1', type: 'lead', description: 'New lead from TechCorp Inc.', value: '$45,000', time: '2 hours ago' },
    { id: '2', type: 'contract', description: 'Enterprise contract signed', value: '$250,000', time: '4 hours ago' },
    { id: '3', type: 'quote', description: 'Quote sent to EduMax Solutions', value: '$80,000', time: '6 hours ago' },
    { id: '4', type: 'license', description: '500 licenses provisioned', value: '$125,000', time: '1 day ago' }
  ];

  const salesLeads: SalesLead[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      email: 'sarah.johnson@techcorp.com',
      value: 45000,
      status: 'qualified',
      source: 'Website',
      assignedTo: 'Alice Chen',
      createdAt: '2024-01-15',
      nextAction: 'Schedule demo',
      probability: 75
    },
    {
      id: '2',
      name: 'Michael Davis',
      company: 'EduMax Solutions',
      email: 'mdavis@edumax.com',
      value: 80000,
      status: 'proposal',
      source: 'Referral',
      assignedTo: 'Bob Wilson',
      createdAt: '2024-01-10',
      nextAction: 'Follow up on proposal',
      probability: 60
    },
    {
      id: '3',
      name: 'Jennifer Lopez',
      company: 'Global Learning Co',
      email: 'jlopez@globallearning.com',
      value: 120000,
      status: 'negotiation',
      source: 'Trade Show',
      assignedTo: 'Alice Chen',
      createdAt: '2024-01-05',
      nextAction: 'Contract negotiation',
      probability: 85
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'pipeline', name: 'Sales Pipeline', icon: Target },
    { id: 'licenses', name: 'License Management', icon: CreditCard },
    { id: 'quotes', name: 'Quotes', icon: FileText },
    { id: 'contracts', name: 'Contracts', icon: Building }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'contacted': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'qualified': return 'text-green-600 bg-green-50 border-green-200';
      case 'proposal': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'negotiation': return 'text-coral-600 bg-coral-50 border-coral-200';
      case 'closed-won': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'closed-lost': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Sales Portal</h1>
          <p className="text-gray-600 mt-2">
            Manage sales pipeline, licenses, quotes, and customer contracts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvData = salesLeads.map(lead => ({
                Name: lead.name,
                Company: lead.company,
                Email: lead.email,
                Value: lead.value,
                Status: lead.status,
                Source: lead.source,
                AssignedTo: lead.assignedTo,
                CreatedAt: lead.createdAt,
                NextAction: lead.nextAction,
                Probability: lead.probability
              }));
              const csv = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sales-leads-export.csv';
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
              const newLead = {
                id: `lead-${Date.now()}`,
                name: 'New Lead',
                company: 'Company Name',
                email: 'email@company.com',
                value: 0,
                status: 'new' as const,
                source: 'Manual Entry',
                assignedTo: 'Unassigned',
                createdAt: new Date().toISOString().split('T')[0],
                nextAction: 'Initial Contact',
                probability: 25
              };
              toast.success(`New Lead Created: ${newLead.name}`, `Added lead from ${newLead.company} to pipeline`);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
          >
            <Plus className="h-4 w-4" />
            Add Lead
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(salesMetrics.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              {formatPercentage(salesMetrics.monthlyGrowth)}
            </span>
            <span className="text-sm text-gray-600 ml-1">this month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{salesMetrics.totalLeads}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <Target className="h-4 w-4 text-blue-600 mr-1" />
            <span className="text-sm text-blue-600 font-medium">
              {salesMetrics.conversionRate}%
            </span>
            <span className="text-sm text-gray-600 ml-1">conversion</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Licenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {salesMetrics.activeLicenses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <CheckCircle className="h-4 w-4 text-purple-600 mr-1" />
            <span className="text-sm text-purple-600 font-medium">98.5%</span>
            <span className="text-sm text-gray-600 ml-1">satisfaction</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(salesMetrics.pipelineValue)}
              </p>
            </div>
            <div className="p-3 bg-coral-50 rounded-lg">
              <Target className="h-6 w-6 text-coral-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <BarChart3 className="h-4 w-4 text-coral-600 mr-1" />
            <span className="text-sm text-coral-600 font-medium">24 deals</span>
            <span className="text-sm text-gray-600 ml-1">in pipeline</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$85,000</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
            <span className="text-sm text-orange-600 font-medium">+15%</span>
            <span className="text-sm text-gray-600 ml-1">vs last quarter</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">68%</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Star className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <CheckCircle className="h-4 w-4 text-indigo-600 mr-1" />
            <span className="text-sm text-indigo-600 font-medium">Top 10%</span>
            <span className="text-sm text-gray-600 ml-1">in industry</span>
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
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                    <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg">
                      <option>Last 12 months</option>
                      <option>Last 6 months</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Revenue Chart</p>
                      <p className="text-sm text-gray-500">Chart component integration needed</p>
                    </div>
                  </div>
                </div>

                {/* Pipeline Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Pipeline Distribution</h3>
                    <button 
                      onClick={() => {
                        const pipelineData = {
                          new: salesLeads.filter(l => l.status === 'new').length,
                          contacted: salesLeads.filter(l => l.status === 'contacted').length,
                          qualified: salesLeads.filter(l => l.status === 'qualified').length,
                          proposal: salesLeads.filter(l => l.status === 'proposal').length,
                          negotiation: salesLeads.filter(l => l.status === 'negotiation').length,
                          won: salesLeads.filter(l => l.status === 'closed-won').length,
                          lost: salesLeads.filter(l => l.status === 'closed-lost').length
                        };
                        toast.info('Pipeline Overview', `New: ${pipelineData.new} | Qualified: ${pipelineData.qualified} | Proposal: ${pipelineData.proposal} | Negotiation: ${pipelineData.negotiation}`);
                      }}
                      className="text-coral-600 hover:text-coral-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Pipeline Distribution</p>
                      <p className="text-sm text-gray-500">Pie chart component integration needed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button 
                    onClick={() => {
                      toast.info('Recent Activity', 'Viewing detailed activity log...');
                    }}
                    className="text-coral-600 hover:text-coral-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'contract' ? 'bg-green-100 text-green-600' :
                          activity.type === 'quote' ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'lead' && <Users className="h-4 w-4" />}
                          {activity.type === 'contract' && <Building className="h-4 w-4" />}
                          {activity.type === 'quote' && <FileText className="h-4 w-4" />}
                          {activity.type === 'license' && <CreditCard className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">{activity.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Pipeline Tab */}
          {selectedTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Pipeline Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      />
                    </div>
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500">
                    <option>All Statuses</option>
                    <option>New</option>
                    <option>Qualified</option>
                    <option>Proposal</option>
                    <option>Negotiation</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500">
                    <option>All Sales Reps</option>
                    <option>Alice Chen</option>
                    <option>Bob Wilson</option>
                  </select>
                  <button 
                    onClick={() => {
                      const newLead = {
                        id: `lead-${Date.now()}`,
                        name: 'New Pipeline Lead',
                        company: 'New Company',
                        email: 'contact@newcompany.com',
                        value: 50000,
                        status: 'new' as const,
                        source: 'Pipeline Entry',
                        assignedTo: 'Available Rep',
                        createdAt: new Date().toISOString().split('T')[0],
                        nextAction: 'Initial Qualification',
                        probability: 20
                      };
                      toast.success(`New Pipeline Lead: ${newLead.name}`, `${newLead.company} - $${newLead.value.toLocaleString()}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lead
                  </button>
                </div>
              </div>

              {/* Pipeline Cards */}
              <div className="grid grid-cols-1 gap-4">
                {salesLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                            <p className="text-gray-600">{lead.company}</p>
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(lead.value)}
                            </p>
                            <p className="text-sm text-gray-600">{lead.probability}% probability</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getStatusColor(lead.status)}`}>
                            {lead.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-sm text-gray-600">
                            Source: {lead.source}
                          </span>
                          <span className="text-sm text-gray-600">
                            Rep: {lead.assignedTo}
                          </span>
                          <span className="text-sm text-gray-600">
                            Next: {lead.nextAction}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <button 
                          onClick={() => {
                            toast.info(`Lead Details: ${lead.name}`, `${lead.company} | ${formatCurrency(lead.value)} | ${lead.status.toUpperCase()}`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const reportData = `Lead Report for ${lead.name}\n\nContact Information:\n- Company: ${lead.company}\n- Email: ${lead.email}\n\nSales Information:\n- Value: ${formatCurrency(lead.value)}\n- Status: ${lead.status}\n- Probability: ${lead.probability}%\n- Source: ${lead.source}\n\nManagement:\n- Assigned To: ${lead.assignedTo}\n- Created: ${lead.createdAt}\n- Next Action: ${lead.nextAction}`;
                            const blob = new Blob([reportData], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `lead-report-${lead.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
                            const currentIndex = statuses.indexOf(lead.status);
                            const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)];
                            toast.success('Lead Status Updated', `${lead.name} status changed from "${lead.status}" to "${nextStatus}"`);
                          }}
                          className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 text-sm"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Licenses Tab */}
          {selectedTab === 'licenses' && (
            <motion.div
              key="licenses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LicenseManagement />
            </motion.div>
          )}

          {/* Quotes Tab */}
          {selectedTab === 'quotes' && (
            <motion.div
              key="quotes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Quote Management</h2>
                      <p className="text-gray-600">Create and manage sales quotes</p>
                    </div>
                    <button 
                      onClick={() => {
                        const quoteData = {
                          id: `Q-${String(Date.now()).slice(-3)}`,
                          customer: 'New Customer',
                          amount: '$65,000',
                          items: ['AIVO Professional License (50 seats)', 'Implementation Support', 'Training Package'],
                          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                        };
                        toast.success(`New Quote Created: ${quoteData.id}`, `Customer: ${quoteData.customer} | Amount: ${quoteData.amount}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Quote
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Quotes</h3>
                      <p className="text-2xl font-bold text-gray-900">127</p>
                      <p className="text-sm text-green-600">+12% from last month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Approval</h3>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                      <p className="text-sm text-yellow-600">Requires attention</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</h3>
                      <p className="text-2xl font-bold text-gray-900">73%</p>
                      <p className="text-sm text-blue-600">Above average</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'Q-001', customer: 'Lincoln Elementary', amount: '$45,000', status: 'pending', date: '2024-03-15' },
                      { id: 'Q-002', customer: 'Roosevelt High', amount: '$78,000', status: 'approved', date: '2024-03-14' },
                      { id: 'Q-003', customer: 'Washington Middle', amount: '$32,000', status: 'draft', date: '2024-03-13' }
                    ].map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{quote.id}</h3>
                            <p className="text-sm text-gray-600">{quote.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{quote.amount}</p>
                            <p className="text-sm text-gray-600">{quote.date}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                            quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.status}
                          </span>
                          <button 
                            onClick={() => {
                              const actions = [
                                'View Quote Details',
                                'Send to Customer',
                                'Edit Quote',
                                'Duplicate Quote',
                                'Convert to Contract',
                                'Archive Quote'
                              ];
                              const selectedAction = actions[Math.floor(Math.random() * actions.length)];
                              toast.info(`Quote Action: ${selectedAction}`, `Quote ${quote.id} | Customer: ${quote.customer} | ${quote.amount}`);
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

          {/* Contracts Tab */}
          {selectedTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Contract Management</h2>
                      <p className="text-gray-600">Manage contract lifecycle and renewals</p>
                    </div>
                    <button 
                      onClick={() => {
                        const contractData = {
                          id: `CNT-${String(Date.now()).slice(-3)}`,
                          customer: 'New Enterprise Client',
                          value: '$180,000',
                          type: 'Enterprise Agreement',
                          duration: '3 years',
                          startDate: new Date().toLocaleDateString(),
                          features: ['Unlimited Users', 'Priority Support', 'Custom Integration', 'Advanced Analytics']
                        };
                        toast.success(`New Contract Created: ${contractData.id}`, `Customer: ${contractData.customer} | Value: ${contractData.value} | Type: ${contractData.type}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Contract
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Active Contracts</h3>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                      <p className="text-sm text-green-600">$2.4M total value</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Expiring Soon</h3>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-orange-600">Next 30 days</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Signature</h3>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-sm text-yellow-600">Awaiting action</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Renewal Rate</h3>
                      <p className="text-2xl font-bold text-gray-900">91%</p>
                      <p className="text-sm text-blue-600">Last 12 months</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'CNT-001', customer: 'Springfield District', value: '$125,000', status: 'active', expires: '2024-12-31', type: 'Enterprise' },
                      { id: 'CNT-002', customer: 'Metro Schools', value: '$89,000', status: 'pending-signature', expires: '2024-06-30', type: 'Standard' },
                      { id: 'CNT-003', customer: 'Central Academy', value: '$234,000', status: 'active', expires: '2024-04-15', type: 'Custom' }
                    ].map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Building className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{contract.id}</h3>
                            <p className="text-sm text-gray-600">{contract.customer}</p>
                            <p className="text-xs text-gray-500">{contract.type} Contract</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{contract.value}</p>
                            <p className="text-sm text-gray-600">Expires: {contract.expires}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contract.status === 'active' ? 'bg-green-100 text-green-800' :
                            contract.status === 'pending-signature' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contract.status.replace('-', ' ')}
                          </span>
                          <button 
                            onClick={() => {
                              const actions = [
                                'View Contract Details',
                                'Send Renewal Notice',
                                'Modify Terms',
                                'Generate Amendment',
                                'Schedule Review',
                                'Archive Contract'
                              ];
                              const selectedAction = actions[Math.floor(Math.random() * actions.length)];
                              toast.info(`Contract Action: ${selectedAction}`, `Contract ${contract.id} | Customer: ${contract.customer} | ${contract.value}`);
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function SalesPortal() {
  return (
    <Routes>
      <Route path="/" element={<SalesPortalMain />} />
      <Route path="/overview" element={<SalesOverview />} />
      <Route path="/provision" element={<LicenseProvisioning />} />
      <Route path="/clients" element={<SalesClients />} />
      <Route path="/quote" element={<QuoteGenerator />} />
      <Route path="/contracts" element={<ContractManagement />} />
    </Routes>
  );
};
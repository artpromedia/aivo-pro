import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  Phone, 
  TrendingUp,
  Target,
  Clock,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';

interface Enterprise {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  status: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  licenses: number;
  contact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  lastActivity: string;
  probability: number;
  nextStep: string;
}

interface Contract {
  id: string;
  clientName: string;
  type: 'annual' | 'multi-year' | 'pilot' | 'enterprise';
  value: number;
  licenses: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'sent' | 'under-review' | 'signed' | 'expired';
  renewalDate: string;
  paymentTerms: string;
}

interface Deal {
  id: string;
  name: string;
  company: string;
  stage: string;
  value: number;
  probability: number;
  closeDate: string;
  owner: string;
  lastActivity: string;
}

export default function EnterpriseSales() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'contracts' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  // Mock data
  const enterprises: Enterprise[] = [
    {
      id: 'ent-001',
      name: 'Metro School District',
      industry: 'Education',
      size: 'large',
      status: 'negotiation',
      value: 2500000,
      licenses: 50000,
      contact: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@metroschools.edu',
        phone: '+1 (555) 123-4567',
        title: 'Superintendent'
      },
      lastActivity: '2024-11-07',
      probability: 85,
      nextStep: 'Contract review meeting scheduled for Nov 12'
    },
    {
      id: 'ent-002',
      name: 'Global University Network',
      industry: 'Higher Education',
      size: 'enterprise',
      status: 'qualified',
      value: 5000000,
      licenses: 100000,
      contact: {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@globaluni.edu',
        phone: '+1 (555) 987-6543',
        title: 'VP of Technology'
      },
      lastActivity: '2024-11-06',
      probability: 60,
      nextStep: 'Technical demonstration scheduled for Nov 15'
    },
    {
      id: 'ent-003',
      name: 'State Education Department',
      industry: 'Government',
      size: 'enterprise',
      status: 'proposal',
      value: 8000000,
      licenses: 200000,
      contact: {
        name: 'Jennifer Davis',
        email: 'jennifer.davis@state.gov',
        phone: '+1 (555) 456-7890',
        title: 'Director of Digital Learning'
      },
      lastActivity: '2024-11-05',
      probability: 75,
      nextStep: 'Proposal presentation on Nov 20'
    },
    {
      id: 'ent-004',
      name: 'International School Chain',
      industry: 'Private Education',
      size: 'medium',
      status: 'prospect',
      value: 1200000,
      licenses: 25000,
      contact: {
        name: 'Robert Wilson',
        email: 'robert.wilson@intschools.com',
        phone: '+1 (555) 321-0987',
        title: 'CEO'
      },
      lastActivity: '2024-11-04',
      probability: 40,
      nextStep: 'Initial discovery call scheduled'
    }
  ];

  const contracts: Contract[] = [
    {
      id: 'cont-001',
      clientName: 'Metro School District',
      type: 'multi-year',
      value: 2500000,
      licenses: 50000,
      startDate: '2024-12-01',
      endDate: '2027-11-30',
      status: 'under-review',
      renewalDate: '2027-09-01',
      paymentTerms: 'Annual'
    },
    {
      id: 'cont-002',
      clientName: 'City University',
      type: 'annual',
      value: 800000,
      licenses: 15000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'signed',
      renewalDate: '2024-10-01',
      paymentTerms: 'Quarterly'
    },
    {
      id: 'cont-003',
      clientName: 'Regional College Network',
      type: 'pilot',
      value: 150000,
      licenses: 5000,
      startDate: '2024-11-01',
      endDate: '2025-04-30',
      status: 'signed',
      renewalDate: '2025-02-01',
      paymentTerms: 'Upfront'
    }
  ];

  const deals: Deal[] = [
    {
      id: 'deal-001',
      name: 'Metro School District Enterprise License',
      company: 'Metro School District',
      stage: 'Negotiation',
      value: 2500000,
      probability: 85,
      closeDate: '2024-11-30',
      owner: 'Sarah Thompson',
      lastActivity: '2024-11-07'
    },
    {
      id: 'deal-002',
      name: 'Global University Platform Expansion',
      company: 'Global University Network',
      stage: 'Qualification',
      value: 5000000,
      probability: 60,
      closeDate: '2025-01-15',
      owner: 'Michael Rodriguez',
      lastActivity: '2024-11-06'
    },
    {
      id: 'deal-003',
      name: 'State-wide Implementation',
      company: 'State Education Department',
      stage: 'Proposal',
      value: 8000000,
      probability: 75,
      closeDate: '2024-12-20',
      owner: 'Lisa Chen',
      lastActivity: '2024-11-05'
    }
  ];

  // Filter functions
  const filteredEnterprises = enterprises.filter(enterprise => {
    const matchesSearch = searchTerm === '' || 
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || enterprise.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || enterprise.industry.toLowerCase() === filterIndustry.toLowerCase();

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-gray-500/20 text-gray-400';
      case 'qualified': return 'bg-blue-500/20 text-blue-400';
      case 'proposal': return 'bg-yellow-500/20 text-yellow-400';
      case 'negotiation': return 'bg-orange-500/20 text-orange-400';
      case 'closed-won': return 'bg-green-500/20 text-green-400';
      case 'closed-lost': return 'bg-red-500/20 text-red-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'under-review': return 'bg-yellow-500/20 text-yellow-400';
      case 'signed': return 'bg-green-500/20 text-green-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return '🏢';
      case 'medium': return '🏫';
      case 'large': return '🏛️';
      case 'enterprise': return '🌐';
      default: return '🏢';
    }
  };

  // Calculate metrics
  const totalPipelineValue = enterprises.reduce((sum, ent) => sum + ent.value, 0);
  const totalLicenses = enterprises.reduce((sum, ent) => sum + ent.licenses, 0);
  const avgDealSize = totalPipelineValue / enterprises.length;
  const activeContracts = contracts.filter(c => c.status === 'signed').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: PieChart }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="h-8 w-8 text-coral-500" />
            Enterprise Sales Portal
          </h1>
          <p className="text-gray-400 mt-2">
            Manage enterprise opportunities, contracts, and corporate relationships
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.success('Sales Report', 'Generating enterprise sales report...')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button 
            onClick={() => toast.info('New Opportunity', 'Opening opportunity creation wizard...')}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Opportunity
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Pipeline Value</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(totalPipelineValue / 1000000).toFixed(1)}M</p>
          <p className="text-gray-400 text-sm">Total opportunity value</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Licenses</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{(totalLicenses / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm">Across all opportunities</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Avg Deal Size</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(avgDealSize / 1000000).toFixed(1)}M</p>
          <p className="text-gray-400 text-sm">Per enterprise deal</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Active Contracts</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeContracts}</p>
          <p className="text-gray-400 text-sm">Signed and active</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-coral-500 text-coral-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Deals */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Top Opportunities</h2>
                <p className="text-gray-400">Highest value opportunities in the pipeline</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {deals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{deal.name}</h3>
                          <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                            {deal.stage}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span>Company: {deal.company}</span>
                          <span>Owner: {deal.owner}</span>
                          <span>Close Date: {new Date(deal.closeDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">${(deal.value / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400">{deal.probability}% probability</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Pipeline by Stage</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {['Prospect', 'Qualified', 'Proposal', 'Negotiation'].map((stage) => {
                      const count = enterprises.filter(e => e.status === stage.toLowerCase()).length;
                      const value = enterprises.filter(e => e.status === stage.toLowerCase())
                        .reduce((sum, e) => sum + e.value, 0);
                      
                      return (
                        <div key={stage} className="flex items-center justify-between">
                          <span className="text-gray-300">{stage}</span>
                          <div className="text-right">
                            <span className="text-white font-medium">{count} deals</span>
                            <div className="text-sm text-gray-400">${(value / 1000000).toFixed(1)}M</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Contract Status</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {['Signed', 'Under Review', 'Draft', 'Sent'].map((status) => {
                      const count = contracts.filter(c => c.status === status.toLowerCase().replace(' ', '-')).length;
                      const value = contracts.filter(c => c.status === status.toLowerCase().replace(' ', '-'))
                        .reduce((sum, c) => sum + c.value, 0);
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-gray-300">{status}</span>
                          <div className="text-right">
                            <span className="text-white font-medium">{count} contracts</span>
                            <div className="text-sm text-gray-400">${(value / 1000000).toFixed(1)}M</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'opportunities' && (
          <motion.div
            key="opportunities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="prospect">Prospect</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
              
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Industries</option>
                <option value="education">Education</option>
                <option value="higher education">Higher Education</option>
                <option value="government">Government</option>
                <option value="private education">Private Education</option>
              </select>
            </div>

            {/* Opportunities List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Enterprise Opportunities ({filteredEnterprises.length})</h2>
                <p className="text-gray-400">Manage your enterprise sales pipeline</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {filteredEnterprises.map((enterprise) => (
                  <div key={enterprise.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">{getSizeIcon(enterprise.size)}</div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{enterprise.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(enterprise.status)}`}>
                              {enterprise.status}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                              {enterprise.industry}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 mb-2">{enterprise.nextStep}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span>Contact: {enterprise.contact.name} ({enterprise.contact.title})</span>
                            <span>Value: ${(enterprise.value / 1000000).toFixed(1)}M</span>
                            <span>Licenses: {(enterprise.licenses / 1000).toFixed(0)}K</span>
                            <span>Probability: {enterprise.probability}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          onClick={() => toast.info('Opportunity Details', `Viewing details for ${enterprise.name}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info('Edit Opportunity', `Opening editor for ${enterprise.name}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info('Contact Client', `Initiating contact with ${enterprise.contact.name}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'contracts' && (
          <motion.div
            key="contracts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Contracts List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Enterprise Contracts</h2>
                <p className="text-gray-400">Manage contract lifecycle and renewals</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{contract.clientName}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                            {contract.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                          <div>
                            <span className="text-gray-500">Value:</span>
                            <div className="text-white font-medium">${(contract.value / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Licenses:</span>
                            <div className="text-white font-medium">{(contract.licenses / 1000).toFixed(0)}K</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Start Date:</span>
                            <div className="text-white font-medium">{new Date(contract.startDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">End Date:</span>
                            <div className="text-white font-medium">{new Date(contract.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button 
                          onClick={() => toast.info('Contract Details', `Viewing contract for ${contract.clientName}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.success('Contract Download', `Downloading contract for ${contract.clientName}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info('Renewal Process', `Initiating renewal for ${contract.clientName}`)}
                          className="px-3 py-1 bg-coral-500 text-white rounded text-sm hover:bg-coral-600 transition-colors"
                        >
                          Renew
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Revenue Forecast</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-2">${(totalPipelineValue * 0.7 / 1000000).toFixed(1)}M</p>
                <p className="text-gray-400 text-sm">Expected revenue (Q4 2024)</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-400">70%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Win Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-2">73%</p>
                <p className="text-gray-400 text-sm">Closed opportunities (YTD)</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-400">
                    Won: {enterprises.filter(e => e.status === 'closed-won').length} | 
                    Lost: {enterprises.filter(e => e.status === 'closed-lost').length}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Avg Sales Cycle</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-2">127 days</p>
                <p className="text-gray-400 text-sm">Enterprise deals average</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-400">
                    Fastest: 45 days | Longest: 240 days
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Charts Placeholder */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Sales Performance</h3>
                <p className="text-gray-400">Revenue and pipeline trends over time</p>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Performance charts and analytics visualization</p>
                    <p className="text-sm">Integration with BI tools coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
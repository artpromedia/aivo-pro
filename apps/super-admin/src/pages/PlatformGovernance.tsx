import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  FileText,
  AlertTriangle, 
  CheckCircle, 
  Users,
  Lock,
  Eye,
  Download,
  BarChart3,
  Search,
  Plus,
  Edit,
  Trash2,
  Activity,
  Database
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';

interface Policy {
  id: string;
  name: string;
  category: 'privacy' | 'security' | 'compliance' | 'data' | 'user';
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
  owner: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceItem {
  id: string;
  framework: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastCheck: string;
  dueDate: string;
  assignee: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  impact: 'low' | 'medium' | 'high';
  details: string;
}

export default function PlatformGovernance() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'policies' | 'compliance' | 'audit' | 'reports'>('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const policies: Policy[] = [
    {
      id: 'pol-001',
      name: 'Data Privacy Protection',
      category: 'privacy',
      status: 'active',
      lastUpdated: '2024-11-01',
      owner: 'legal@aivo.com',
      description: 'Comprehensive data privacy protection policy covering user data collection, processing, and retention.',
      riskLevel: 'critical'
    },
    {
      id: 'pol-002',
      name: 'Information Security Standards',
      category: 'security',
      status: 'active',
      lastUpdated: '2024-10-28',
      owner: 'security@aivo.com',
      description: 'Security standards for data encryption, access controls, and threat management.',
      riskLevel: 'high'
    },
    {
      id: 'pol-003',
      name: 'AI Ethics Guidelines',
      category: 'compliance',
      status: 'draft',
      lastUpdated: '2024-11-05',
      owner: 'ethics@aivo.com',
      description: 'Ethical guidelines for AI system development and deployment.',
      riskLevel: 'medium'
    },
    {
      id: 'pol-004',
      name: 'Data Retention Policy',
      category: 'data',
      status: 'active',
      lastUpdated: '2024-10-15',
      owner: 'data@aivo.com',
      description: 'Guidelines for data retention periods and deletion procedures.',
      riskLevel: 'medium'
    }
  ];

  const complianceItems: ComplianceItem[] = [
    {
      id: 'comp-001',
      framework: 'GDPR',
      requirement: 'Data Subject Rights Implementation',
      status: 'compliant',
      lastCheck: '2024-11-01',
      dueDate: '2024-12-01',
      assignee: 'legal-team'
    },
    {
      id: 'comp-002',
      framework: 'SOC 2',
      requirement: 'Access Control Reviews',
      status: 'partial',
      lastCheck: '2024-10-15',
      dueDate: '2024-11-15',
      assignee: 'security-team'
    },
    {
      id: 'comp-003',
      framework: 'FERPA',
      requirement: 'Educational Records Protection',
      status: 'compliant',
      lastCheck: '2024-10-30',
      dueDate: '2024-12-30',
      assignee: 'privacy-officer'
    },
    {
      id: 'comp-004',
      framework: 'CCPA',
      requirement: 'Consumer Rights Portal',
      status: 'non-compliant',
      lastCheck: '2024-10-20',
      dueDate: '2024-11-20',
      assignee: 'product-team'
    }
  ];

  const auditEvents: AuditEvent[] = [
    {
      id: 'audit-001',
      timestamp: '2024-11-07T14:30:00Z',
      event: 'Policy Updated: Data Privacy Protection',
      user: 'legal@aivo.com',
      impact: 'high',
      details: 'Updated data retention periods from 7 years to 5 years per new regulations'
    },
    {
      id: 'audit-002',
      timestamp: '2024-11-07T13:15:00Z',
      event: 'Compliance Check: GDPR',
      user: 'system',
      impact: 'medium',
      details: 'Automated compliance check completed for GDPR requirements'
    },
    {
      id: 'audit-003',
      timestamp: '2024-11-07T11:45:00Z',
      event: 'Access Review Completed',
      user: 'security@aivo.com',
      impact: 'medium',
      details: 'Quarterly access review completed with 12 access removals'
    },
    {
      id: 'audit-004',
      timestamp: '2024-11-07T09:20:00Z',
      event: 'Risk Assessment: AI Ethics',
      user: 'ethics@aivo.com',
      impact: 'low',
      details: 'Risk assessment completed for new AI model deployment'
    }
  ];

  // Filter functions
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = searchTerm === '' || 
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy': return Shield;
      case 'security': return Lock;
      case 'compliance': return CheckCircle;
      case 'data': return Database;
      case 'user': return Users;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'privacy': return 'bg-purple-500';
      case 'security': return 'bg-red-500';
      case 'compliance': return 'bg-green-500';
      case 'data': return 'bg-blue-500';
      case 'user': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      case 'compliant': return 'bg-green-500/20 text-green-400';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400';
      case 'non-compliant': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const tabs = [
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'audit', label: 'Audit Log', icon: Activity },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-coral-500" />
            Platform Governance
          </h1>
          <p className="text-gray-400 mt-2">
            Manage policies, ensure compliance, and monitor governance activities
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.success('Governance Report', 'Generating comprehensive governance report...')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button 
            onClick={() => toast.info('Policy Creation', 'Opening policy creation wizard...')}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Active Policies</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{policies.filter(p => p.status === 'active').length}</p>
          <p className="text-gray-400 text-sm">Out of {policies.length} total</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Compliance Rate</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {Math.round((complianceItems.filter(c => c.status === 'compliant').length / complianceItems.length) * 100)}%
          </p>
          <p className="text-gray-400 text-sm">Across all frameworks</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Critical Issues</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {policies.filter(p => p.riskLevel === 'critical').length + complianceItems.filter(c => c.status === 'non-compliant').length}
          </p>
          <p className="text-gray-400 text-sm">Requiring attention</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Audit Events</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{auditEvents.length}</p>
          <p className="text-gray-400 text-sm">Last 7 days</p>
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
        {activeTab === 'policies' && (
          <motion.div
            key="policies"
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
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="privacy">Privacy</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
                <option value="data">Data</option>
                <option value="user">User</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Policies List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Policies ({filteredPolicies.length})</h2>
                <p className="text-gray-400">Manage organizational policies and guidelines</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {filteredPolicies.map((policy) => {
                  const CategoryIcon = getCategoryIcon(policy.category);
                  return (
                    <div key={policy.id} className="p-6 hover:bg-gray-750 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${getCategoryColor(policy.category)}`}>
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-white">{policy.name}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(policy.status)}`}>
                                {policy.status}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(policy.riskLevel)}`}>
                                {policy.riskLevel} risk
                              </span>
                            </div>
                            
                            <p className="text-gray-300 mb-3">{policy.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              <span>Owner: {policy.owner}</span>
                              <span>Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
                              <span>Category: {policy.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => toast.info('Policy Details', `Viewing details for ${policy.name}`)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toast.info('Policy Editor', `Opening editor for ${policy.name}`)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toast.warning('Policy Archive', `Archiving policy: ${policy.name}`)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Compliance Overview */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Compliance Status</h2>
                <p className="text-gray-400">Monitor compliance across regulatory frameworks</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {complianceItems.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{item.requirement}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                            {item.framework}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span>Assignee: {item.assignee}</span>
                          <span>Last Check: {new Date(item.lastCheck).toLocaleDateString()}</span>
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toast.info('Compliance Check', `Running compliance check for ${item.requirement}`)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Check Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Audit Log */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Governance Audit Log</h2>
                <p className="text-gray-400">Track all governance-related activities and changes</p>
              </div>
              
              <div className="divide-y divide-gray-700">
                {auditEvents.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        event.impact === 'low' ? 'bg-green-400' :
                        event.impact === 'medium' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{event.event}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.impact === 'low' ? 'bg-green-500/20 text-green-400' :
                            event.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {event.impact} impact
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-2">{event.details}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span>User: {event.user}</span>
                          <span>{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Compliance Summary</h3>
                </div>
                <p className="text-gray-400 mb-4">Comprehensive compliance status across all frameworks</p>
                <button 
                  onClick={() => toast.success('Report Generated', 'Compliance summary report generated and downloaded')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Generate Report
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Policy Assessment</h3>
                </div>
                <p className="text-gray-400 mb-4">Analysis of policy effectiveness and coverage</p>
                <button 
                  onClick={() => toast.success('Report Generated', 'Policy assessment report generated and downloaded')}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Generate Report
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
                </div>
                <p className="text-gray-400 mb-4">Complete audit trail of governance activities</p>
                <button 
                  onClick={() => toast.success('Report Generated', 'Audit trail report generated and downloaded')}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
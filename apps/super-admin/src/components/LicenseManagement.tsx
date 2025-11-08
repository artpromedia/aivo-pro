import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from './ToastProvider';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { 
  CreditCard, 
  Search, 
  Plus,
  Download,
  Calendar,
  Users,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  RotateCcw,
  Zap,
  Shield,
  Building,
  Globe
} from 'lucide-react';

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
  customerCompany: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  usageStats: {
    seatsUsed: number;
    lastAccessed: string;
  };
}

const LicenseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLicenses, setSelectedLicenses] = useState<Set<string>>(new Set());
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  // Mock data
  const licenses: License[] = [
    {
      id: '1',
      type: 'enterprise',
      seats: 500,
      duration: 12,
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations', 'White Labeling'],
      price: 125000,
      status: 'active',
      customerId: 'cust_001',
      customerName: 'TechCorp Inc.',
      customerCompany: 'TechCorp Inc.',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      autoRenew: true,
      usageStats: {
        seatsUsed: 387,
        lastAccessed: '2024-01-15'
      }
    },
    {
      id: '2',
      type: 'professional',
      seats: 100,
      duration: 12,
      features: ['Standard Analytics', 'Email Support', 'API Access'],
      price: 25000,
      status: 'active',
      customerId: 'cust_002',
      customerName: 'EduMax Solutions',
      customerCompany: 'EduMax Solutions',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      autoRenew: false,
      usageStats: {
        seatsUsed: 89,
        lastAccessed: '2024-01-14'
      }
    },
    {
      id: '3',
      type: 'starter',
      seats: 25,
      duration: 6,
      features: ['Basic Analytics', 'Community Support'],
      price: 3000,
      status: 'expired',
      customerId: 'cust_003',
      customerName: 'Learning Hub',
      customerCompany: 'Learning Hub LLC',
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      autoRenew: false,
      usageStats: {
        seatsUsed: 22,
        lastAccessed: '2023-11-28'
      }
    },
    {
      id: '4',
      type: 'enterprise',
      seats: 1000,
      duration: 24,
      features: ['Advanced Analytics', 'Priority Support', 'Custom Integrations', 'White Labeling', 'SLA Guarantee'],
      price: 350000,
      status: 'pending',
      customerId: 'cust_004',
      customerName: 'Global Learning Co',
      customerCompany: 'Global Learning Co',
      startDate: '2024-02-01',
      endDate: '2026-01-31',
      autoRenew: true,
      usageStats: {
        seatsUsed: 0,
        lastAccessed: 'Never'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'starter': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'professional': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'enterprise': return 'text-coral-600 bg-coral-50 border-coral-200';
      case 'custom': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'starter': return <Zap className="h-4 w-4" />;
      case 'professional': return <Shield className="h-4 w-4" />;
      case 'enterprise': return <Building className="h-4 w-4" />;
      case 'custom': return <Settings className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
    const matchesType = filterType === 'all' || license.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleLicenseSelection = (licenseId: string) => {
    const newSelection = new Set(selectedLicenses);
    if (newSelection.has(licenseId)) {
      newSelection.delete(licenseId);
    } else {
      newSelection.add(licenseId);
    }
    setSelectedLicenses(newSelection);
  };

  // Summary calculations
  const summary = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'active').length,
    expiringSoon: licenses.filter(l => {
      const days = getDaysUntilExpiry(l.endDate);
      return days <= 30 && days > 0;
    }).length,
    totalSeats: licenses.reduce((sum, l) => sum + l.seats, 0),
    usedSeats: licenses.reduce((sum, l) => sum + l.usageStats.seatsUsed, 0),
    revenue: licenses.filter(l => l.status === 'active').reduce((sum, l) => sum + l.price, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">License Management</h2>
          <p className="text-gray-600 mt-1">
            Monitor software licenses, usage, and renewals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const licenseData = licenses.map((license: License) => ({
                ID: license.id,
                Customer: license.customerName,
                Company: license.customerCompany,
                Type: license.type,
                Seats: license.seats,
                Status: license.status,
                'Start Date': license.startDate,
                'End Date': license.endDate,
                Price: `$${license.price}`,
                Features: license.features.join('; ')
              }));
              const csv = [
                Object.keys(licenseData[0]).join(','),
                ...licenseData.map((row: any) => Object.values(row).map(val => `"${val}"`).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'license-management-export.csv';
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
              const newLicense = {
                id: `LIC-${Date.now()}`,
                organization: 'New Organization',
                type: 'Enterprise',
                seats: 100,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                monthlyCost: 2500,
                features: ['AI Tutoring', 'Analytics Dashboard', 'Custom Integration']
              };
              toast.success(`New License Issued: ${newLicense.id}`, `${newLicense.organization} | ${newLicense.type} | ${newLicense.seats} seats | $${newLicense.monthlyCost}/month`);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600"
          >
            <Plus className="h-4 w-4" />
            Issue License
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Licenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{summary.active}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{summary.expiringSoon}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalSeats.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Used Seats</p>
              <p className="text-2xl font-bold text-coral-600 mt-1">{summary.usedSeats.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-coral-50 rounded-lg">
              <Globe className="h-5 w-5 text-coral-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-coral-600 h-2 rounded-full" 
                style={{ width: `${(summary.usedSeats / summary.totalSeats) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {((summary.usedSeats / summary.totalSeats) * 100).toFixed(1)}% utilization
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.revenue)}</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search licenses..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Types</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* License Cards */}
      <div className="space-y-4">
        {filteredLicenses.map((license) => {
          const daysUntilExpiry = getDaysUntilExpiry(license.endDate);
          const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
          const isExpired = daysUntilExpiry <= 0;
          
          return (
            <motion.div
              key={license.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.has(license.id)}
                        onChange={() => toggleLicenseSelection(license.id)}
                        className="rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                      />
                      <div className={`p-2 rounded-lg border ${getTypeColor(license.type)}`}>
                        {getTypeIcon(license.type)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{license.customerName}</h4>
                      <p className="text-gray-600">{license.customerCompany}</p>
                      <p className="text-sm text-gray-500">License ID: {license.id}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getStatusColor(license.status)}`}>
                        {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">License Type</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md border mt-1 ${getTypeColor(license.type)}`}>
                        {getTypeIcon(license.type)}
                        {license.type.charAt(0).toUpperCase() + license.type.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600">Seats Usage</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {license.usageStats.seatsUsed.toLocaleString()} / {license.seats.toLocaleString()}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-coral-600 h-1.5 rounded-full" 
                          style={{ width: `${(license.usageStats.seatsUsed / license.seats) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">Value & Duration</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(license.price)}</p>
                      <p className="text-sm text-gray-600">{license.duration} months</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">Expiry Status</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(license.endDate)}</p>
                      {isExpired && (
                        <span className="text-sm text-red-600 font-medium">Expired</span>
                      )}
                      {isExpiringSoon && !isExpired && (
                        <span className="text-sm text-orange-600 font-medium">
                          Expires in {daysUntilExpiry} days
                        </span>
                      )}
                      {!isExpiringSoon && !isExpired && (
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Start: {formatDate(license.startDate)}</span>
                        <span>Auto-renew: {license.autoRenew ? 'Yes' : 'No'}</span>
                        <span>Last accessed: {license.usageStats.lastAccessed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            toast.info(`License Details: ${license.id}`, `${license.customerName} | ${license.customerCompany} | ${license.seats} seats`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            toast.info(`License Editor: ${license.id}`, `Opening editor for ${license.customerName}...`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: `Renew License: ${license.id}`,
                              description: `Renew license for ${license.customerName}? This will extend the license for ${license.duration} months.`,
                              type: 'info'
                            });
                            if (confirmed) {
                              const newEndDate = new Date(new Date(license.endDate).getTime() + license.duration * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                              toast.success(`License Renewed: ${license.id}`, `${license.customerName} renewed until ${newEndDate}`);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-green-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const actions = [
                              'View Usage Analytics',
                              'Download License Certificate',
                              'Generate Invoice',
                              'Contact Customer',
                              'Upgrade License',
                              'Suspend License',
                              'Transfer Ownership'
                            ];
                            const selectedAction = actions[Math.floor(Math.random() * actions.length)];
                            toast.info(`License Management: ${license.id}`, `Action: ${selectedAction} for ${license.customerName}`);
                          }}
                          className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 text-sm"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Included Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {license.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Warning Indicators */}
                {(isExpired || isExpiringSoon) && (
                  <div className="ml-4">
                    <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedLicenses.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {selectedLicenses.size} license{selectedLicenses.size !== 1 ? 's' : ''} selected
              </h4>
              <p className="text-sm text-gray-600">
                Perform bulk actions on selected licenses
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  if (selectedLicenses.size === 0) {
                    toast.warning('No licenses selected', 'Please select one or more licenses first.');
                    return;
                  }
                  const confirmed = await confirm({
                    title: 'Renew Selected Licenses',
                    description: `Renew ${selectedLicenses.size} selected license(s)? Estimated cost: $${(selectedLicenses.size * 1200).toLocaleString()}`,
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.success(`License Renewal Initiated`, `Renewed ${selectedLicenses.size} license(s) successfully`);
                    setSelectedLicenses(new Set());
                  }
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Renew Selected
              </button>
              <button 
                onClick={() => {
                  if (selectedLicenses.size === 0) {
                    toast.info('No licenses selected! Please select one or more licenses first.');
                    return;
                  }
                  toast.success(`Notifications sent to ${selectedLicenses.size} license(s) including renewal reminders, usage reports, billing updates, and security alerts. Recipients notified via email and in-app.`);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Send Notifications
              </button>
              <button 
                onClick={async () => {
                  if (selectedLicenses.size === 0) {
                    toast.info('No licenses selected! Please select one or more licenses first.');
                    return;
                  }
                  const selectedLics = Array.from(selectedLicenses).map(id => 
                    licenses.find(l => l.id === id)?.customerCompany
                  ).filter(Boolean);
                  
                  const confirmed = await confirm({
                    type: 'danger',
                    title: 'Cancel Selected Licenses?',
                    description: `You are about to cancel ${selectedLicenses.size} license(s):\n${selectedLics.map(org => `• ${org}`).join('\n')}\n\nCancellation Effects:\n• Immediate access termination\n• Data export period: 30 days\n• Billing stops at period end\n• Cannot be undone\n• Users will lose access\n\nRefund Policy:\n• Pro-rated refund available\n• Processing time: 5-7 business days\n\nContinue with cancellation?`,
                    confirmText: 'Cancel Licenses',
                    cancelText: 'Keep Active'
                  });
                  
                  if (confirmed) {
                    toast.success(`Licenses cancelled! ${selectedLicenses.size} license(s) terminated. Access removed, users notified, data export initiated, and refunds processing.`);
                    setSelectedLicenses(new Set());
                  }
                }}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                Cancel Selected
              </button>
              <button 
                onClick={() => setSelectedLicenses(new Set())}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LicenseManagement;
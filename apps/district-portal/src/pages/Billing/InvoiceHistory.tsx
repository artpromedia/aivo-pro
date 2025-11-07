import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Calendar,
  Building2,
  DollarSign,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

// Mock invoice data
const mockInvoices = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 24500.00,
    status: 'Paid',
    school: 'Lincoln Elementary',
    licenseType: 'Enterprise - 500 Seats',
    paymentMethod: 'ACH Transfer',
    paidDate: '2024-01-20'
  },
  {
    id: 'INV-2024-002',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 18750.00,
    status: 'Paid',
    school: 'Washington Middle',
    licenseType: 'Professional - 350 Seats',
    paymentMethod: 'Credit Card',
    paidDate: '2024-01-18'
  },
  {
    id: 'INV-2024-003',
    date: '2024-02-01',
    dueDate: '2024-03-01',
    amount: 12300.00,
    status: 'Pending',
    school: 'Roosevelt High',
    licenseType: 'Standard - 250 Seats',
    paymentMethod: 'Purchase Order',
    paidDate: null
  },
  {
    id: 'INV-2024-004',
    date: '2024-01-20',
    dueDate: '2024-01-25',
    amount: 8500.00,
    status: 'Overdue',
    school: 'Jefferson Elementary',
    licenseType: 'Basic - 150 Seats',
    paymentMethod: 'ACH Transfer',
    paidDate: null
  },
  {
    id: 'INV-2023-089',
    date: '2023-12-15',
    dueDate: '2024-01-15',
    amount: 31200.00,
    status: 'Paid',
    school: 'Madison Middle',
    licenseType: 'Enterprise - 650 Seats',
    paymentMethod: 'Wire Transfer',
    paidDate: '2023-12-28'
  },
  {
    id: 'INV-2024-005',
    date: '2024-02-10',
    dueDate: '2024-03-10',
    amount: 15600.00,
    status: 'Pending',
    school: 'Adams Elementary',
    licenseType: 'Professional - 300 Seats',
    paymentMethod: 'Credit Card',
    paidDate: null
  }
];

const paymentHistory = [
  { date: '2024-01-20', amount: 24500.00, invoice: 'INV-2024-001', method: 'ACH Transfer' },
  { date: '2024-01-18', amount: 18750.00, invoice: 'INV-2024-002', method: 'Credit Card' },
  { date: '2023-12-28', amount: 31200.00, invoice: 'INV-2023-089', method: 'Wire Transfer' }
];

export const InvoiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate summary stats
  const totalInvoices = mockInvoices.length;
  const totalPaid = mockInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const outstandingBalance = mockInvoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = mockInvoices.filter(inv => inv.status === 'Overdue').length;

  // Get unique schools for filter
  const schools = Array.from(new Set(mockInvoices.map(inv => inv.school)));

  // Filter invoices
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.licenseType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSchool = schoolFilter === 'all' || invoice.school === schoolFilter;
    
    return matchesSearch && matchesStatus && matchesSchool;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      Paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      Overdue: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} text-xs font-medium rounded-lg`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Downloading invoice:', invoiceId);
    // API call would go here
  };

  const handleBulkExport = () => {
    console.log('Exporting invoices:', selectedInvoices);
    // API call would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <button
            onClick={() => navigate('/billing')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Billing
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Invoice History</h1>
              <p className="text-purple-100">View and manage all district invoices and payments</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all border border-white/30"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {selectedInvoices.length > 0 && (
                <button
                  onClick={handleBulkExport}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Export Selected ({selectedInvoices.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
              </div>
            </div>
            <p className="text-sm text-purple-600 font-medium">Last 12 months</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
            <p className="text-sm text-green-600 font-medium">All paid invoices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Outstanding Balance</p>
            <p className="text-2xl font-bold text-gray-900">${outstandingBalance.toLocaleString()}</p>
            <p className="text-sm text-orange-600 font-medium">Pending + Overdue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
            <p className="text-sm text-red-600 font-medium">Requires immediate action</p>
          </motion.div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm mb-6 overflow-hidden"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Schools</option>
                    {schools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Time</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setSchoolFilter('all');
                      setDateRange('all');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Search and Actions */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Invoices</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">School</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => handleSelectInvoice(invoice.id)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{invoice.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{invoice.date}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{invoice.school}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                Showing {filteredInvoices.length} of {mockInvoices.length} invoices
              </div>
            </div>
          </div>

          {/* Right Column - Payment History & Info */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Recent Payments
              </h2>
              <div className="space-y-4">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 w-3 h-3 bg-green-500 rounded-full -translate-x-[7px]"></div>
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{payment.invoice}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <Calendar className="w-3 h-3" />
                      {payment.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CreditCard className="w-3 h-3" />
                      {payment.method}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900">ACH Transfer</span>
                  </div>
                  <p className="text-xs text-gray-600">Bank account ending in 4567</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">Credit Card</span>
                  </div>
                  <p className="text-xs text-gray-600">Visa ending in 1234</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Purchase Order</span>
                  </div>
                  <p className="text-xs text-gray-600">Net 30 terms available</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium text-sm">
                  Make a Payment
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium text-sm">
                  Set Up Auto-Pay
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium text-sm">
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

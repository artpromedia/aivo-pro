import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  Download,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Eye,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Shield,
  Lock
} from 'lucide-react';

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  invoiceUrl?: string;
  paymentMethod: string;
  type: 'subscription' | 'addon' | 'usage' | 'refund';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  interval: 'monthly' | 'yearly';
  nextBillingDate: string;
  trialEndsAt?: string;
}

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'methods' | 'subscription'>('overview');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  // Mock data
  const subscription: Subscription = {
    id: 'sub_123',
    plan: 'AIVO Premium Family',
    status: 'active',
    currentPeriodStart: '2024-10-15',
    currentPeriodEnd: '2024-11-15',
    cancelAtPeriodEnd: false,
    amount: 29.99,
    interval: 'monthly',
    nextBillingDate: '2024-11-15'
  };

  const billingHistory: BillingHistory[] = [
    {
      id: 'inv_001',
      date: '2024-10-15',
      amount: 29.99,
      status: 'paid',
      description: 'AIVO Premium Family - Monthly',
      invoiceUrl: '#',
      paymentMethod: '**** 4242',
      type: 'subscription'
    },
    {
      id: 'inv_002',
      date: '2024-09-15',
      amount: 29.99,
      status: 'paid',
      description: 'AIVO Premium Family - Monthly',
      invoiceUrl: '#',
      paymentMethod: '**** 4242',
      type: 'subscription'
    },
    {
      id: 'inv_003',
      date: '2024-08-20',
      amount: 9.99,
      status: 'paid',
      description: 'Additional Learning Module - Science',
      invoiceUrl: '#',
      paymentMethod: '**** 4242',
      type: 'addon'
    },
    {
      id: 'inv_004',
      date: '2024-08-15',
      amount: 29.99,
      status: 'failed',
      description: 'AIVO Premium Family - Monthly',
      paymentMethod: '**** 4242',
      type: 'subscription'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_001',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      nickname: 'Primary Card'
    },
    {
      id: 'pm_002',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      nickname: 'Backup Card'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: DollarSign },
    { key: 'subscription', label: 'Subscription', icon: RefreshCw },
    { key: 'history', label: 'Billing History', icon: Receipt },
    { key: 'methods', label: 'Payment Methods', icon: CreditCard },
  ];

  const filteredHistory = billingHistory.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Billing & Payments
        </h1>
        <p className="text-gray-600">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-white/20 inline-flex gap-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === key
                ? 'bg-aivo-gradient text-white shadow-lg'
                : 'text-gray-600 hover:text-coral-600 hover:bg-coral-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        {activeTab === 'overview' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Billing Overview</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${subscription.amount}</p>
                    <p className="text-sm text-gray-600">Monthly Subscription</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Nov 15</p>
                    <p className="text-sm text-gray-600">Next Billing Date</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{billingHistory.filter(h => h.status === 'paid').length}</p>
                    <p className="text-sm text-gray-600">Paid Invoices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => {
                    // Generate and download invoice
                    alert('Invoice will be downloaded to your device.');
                    // In real implementation, trigger PDF download
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <button 
                  onClick={() => setShowAddMethod(true)}
                  className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
                <Link 
                  to="/billing?tab=subscription"
                  className="inline-flex items-center gap-2 bg-white border-2 border-green-200 text-green-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:border-green-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Update Subscription
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Details</h3>
            
            <div className="bg-gradient-to-r from-coral-50 to-purple-50 rounded-2xl p-6 border border-coral-200 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-aivo-gradient rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{subscription.plan}</h4>
                    <p className="text-gray-600 mb-2">
                      ${subscription.amount}/{subscription.interval === 'monthly' ? 'month' : 'year'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        • Renews {new Date(subscription.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 bg-white border-2 border-coral-200 text-coral-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-coral-50 hover:border-coral-300">
                    <Edit3 className="w-4 h-4" />
                    Modify Plan
                  </button>
                  <button className="inline-flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Usage & Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Current Usage</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Children</span>
                    <span className="font-semibold">2 / 4</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">AI Assessments</span>
                    <span className="font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Learning Modules</span>
                    <span className="font-semibold">All Access</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Plan Features</h4>
                <div className="space-y-2">
                  {[
                    'Advanced AI-powered learning recommendations',
                    'Priority customer support',
                    'Detailed progress analytics',
                    'Parent-teacher messaging',
                    'Custom learning goals',
                    'Unlimited practice sessions'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Billing History</h3>
              
              <div className="flex items-center gap-3">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                
                <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {item.type === 'refund' ? '-' : ''}${item.amount.toFixed(2)}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {item.invoiceUrl && (
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
              
              <button 
                onClick={() => setShowAddMethod(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
              >
                <Plus className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>

            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {method.brand} •••• {method.last4}
                        </h4>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                        {method.nickname && ` • ${method.nickname}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!method.isDefault && (
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
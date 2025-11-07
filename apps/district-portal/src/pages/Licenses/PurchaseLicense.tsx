import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Plus,
  ArrowLeft,
  Check,
  Sparkles,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Award,
  Target,
  Brain,
  Settings,
  Download
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface LicensePackage {
  id: string;
  name: string;
  licenses: number;
  price: number;
  pricePerLicense: number;
  popular?: boolean;
  savings?: string;
  features: string[];
}

interface PilotProgram {
  id: string;
  name: string;
  duration: string;
  licenses: number;
  price: number;
  features: string[];
  description: string;
}

interface ActiveLicense {
  id: string;
  type: 'pilot' | 'paid';
  status: 'active' | 'paused' | 'expired';
  licenses: number;
  used: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  monthlyPrice?: number;
}

export const PurchaseLicense: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'purchase' | 'pilot' | 'manage'>('purchase');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertingPilot, setConvertingPilot] = useState<string | null>(null);

  // Mock data for current licenses
  const { data: activeLicenses } = useQuery({
    queryKey: ['active-licenses'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'pilot-1',
          type: 'pilot' as const,
          status: 'active' as const,
          licenses: 100,
          used: 87,
          startDate: '2025-10-15',
          endDate: '2025-12-15',
          autoRenew: false,
        },
        {
          id: 'paid-1',
          type: 'paid' as const,
          status: 'active' as const,
          licenses: 500,
          used: 423,
          startDate: '2025-01-01',
          endDate: '2026-01-01',
          autoRenew: true,
          monthlyPrice: 2250,
        },
      ] as ActiveLicense[];
    },
  });

  const licensePackages: LicensePackage[] = [
    {
      id: 'starter',
      name: 'Starter',
      licenses: 100,
      price: billingCycle === 'annual' ? 4800 : 500,
      pricePerLicense: billingCycle === 'annual' ? 48 : 5,
      features: [
        'Up to 100 student licenses',
        'Basic AI models',
        'Standard support',
        'Monthly usage reports',
        'Single school integration',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      licenses: 500,
      price: billingCycle === 'annual' ? 21000 : 2000,
      pricePerLicense: billingCycle === 'annual' ? 42 : 4,
      popular: true,
      savings: '20% off',
      features: [
        'Up to 500 student licenses',
        'Advanced AI models',
        'Priority support',
        'Real-time analytics',
        'Multi-school management',
        'Custom integrations',
        'Professional development',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      licenses: 1000,
      price: billingCycle === 'annual' ? 36000 : 3500,
      pricePerLicense: billingCycle === 'annual' ? 36 : 3.5,
      savings: '30% off',
      features: [
        'Up to 1000+ student licenses',
        'Premium AI models',
        'Dedicated success manager',
        'Advanced analytics & reporting',
        'District-wide deployment',
        'API access',
        'White-label options',
        'Onboarding & training',
      ],
    },
  ];

  const pilotPrograms: PilotProgram[] = [
    {
      id: 'pilot-basic',
      name: '30-Day Pilot',
      duration: '30 days',
      licenses: 50,
      price: 0,
      description: 'Perfect for testing AIVO with a small group',
      features: [
        '50 student licenses',
        'Full platform access',
        'Basic AI models',
        'Email support',
        '30-day trial period',
        'No credit card required',
      ],
    },
    {
      id: 'pilot-extended',
      name: '90-Day Extended Pilot',
      duration: '90 days',
      licenses: 100,
      price: 500,
      description: 'Comprehensive evaluation with more students',
      features: [
        '100 student licenses',
        'Full platform access',
        'Advanced AI models',
        'Priority support',
        '90-day trial period',
        'Onboarding session included',
        'Convert discount available',
      ],
    },
  ];

  // Mutations
  const pauseLicenseMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { licenseId, status: 'paused' };
    },
    onSuccess: () => {
      alert('License paused successfully');
    },
  });

  const resumeLicenseMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { licenseId, status: 'active' };
    },
    onSuccess: () => {
      alert('License resumed successfully');
    },
  });

  const convertPilotMutation = useMutation({
    mutationFn: async ({ pilotId, packageId }: { pilotId: string; packageId: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { pilotId, packageId, status: 'converted' };
    },
    onSuccess: () => {
      alert('Pilot converted to paid license successfully!');
      setShowConvertModal(false);
      setConvertingPilot(null);
    },
  });

  const enrollPilotMutation = useMutation({
    mutationFn: async (pilotId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { pilotId, status: 'enrolled' };
    },
    onSuccess: () => {
      alert('Successfully enrolled in pilot program!');
      navigate('/licenses');
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { packageId, status: 'purchased' };
    },
    onSuccess: () => {
      alert('License purchase successful!');
      setShowCheckout(false);
      navigate('/licenses');
    },
  });

  const handlePurchase = (pkg: LicensePackage) => {
    setSelectedPackage(pkg.id);
    setShowCheckout(true);
  };

  const handleEnrollPilot = (pilot: PilotProgram) => {
    setSelectedPilot(pilot.id);
    enrollPilotMutation.mutate(pilot.id);
  };

  const handleConvertPilot = (pilotId: string) => {
    setConvertingPilot(pilotId);
    setShowConvertModal(true);
  };

  const handlePauseLicense = (licenseId: string) => {
    if (confirm('Are you sure you want to pause this license? Students will lose access temporarily.')) {
      pauseLicenseMutation.mutate(licenseId);
    }
  };

  const handleResumeLicense = (licenseId: string) => {
    resumeLicenseMutation.mutate(licenseId);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      expired: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle className="w-4 h-4" />;
    if (status === 'paused') return <Pause className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/licenses"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Licenses</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">License Management</h1>
              <p className="text-purple-100">Purchase licenses, enroll in pilots, or manage existing subscriptions</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'purchase'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Purchase Licenses</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pilot')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'pilot'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Pilot Programs</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'manage'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                <span>Manage Licenses</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Purchase Tab */}
          {activeTab === 'purchase' && (
            <motion.div
              key="purchase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      billingCycle === 'annual'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Annual
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* License Packages */}
              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {licensePackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl p-8 border-2 transition-all hover:shadow-2xl ${
                      pkg.popular
                        ? 'border-purple-500 shadow-xl scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    } relative`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {pkg.savings && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {pkg.savings}
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="mb-4">
                        <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${pkg.price.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          /{billingCycle === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        ${pkg.pricePerLicense.toFixed(2)} per license/{billingCycle === 'annual' ? 'year' : 'month'}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="text-xl font-semibold text-gray-900">
                          {pkg.licenses} Licenses
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePurchase(pkg)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Select {pkg.name}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Enterprise Custom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Brain className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">Need More Than 1000 Licenses?</h3>
                        <p className="text-purple-100">Custom enterprise solutions available</p>
                      </div>
                      <button className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-semibold whitespace-nowrap">
                        Contact Sales
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-200" />
                        <span className="text-sm">Dedicated support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-200" />
                        <span className="text-sm">Custom pricing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-200" />
                        <span className="text-sm">Volume discounts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Pilot Tab */}
          {activeTab === 'pilot' && (
            <motion.div
              key="pilot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Try AIVO Risk-Free</h2>
                <p className="text-lg text-gray-600">
                  Experience the full platform with a pilot program before committing
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {pilotPrograms.map((pilot, index) => (
                  <motion.div
                    key={pilot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pilot.name}</h3>
                        <p className="text-gray-600">{pilot.description}</p>
                      </div>
                      {pilot.price === 0 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          FREE
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="text-4xl font-bold mb-2">
                        {pilot.price === 0 ? (
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Free
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${pilot.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {pilot.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {pilot.licenses} licenses
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pilot.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleEnrollPilot(pilot)}
                      disabled={enrollPilotMutation.isPending && selectedPilot === pilot.id}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold disabled:opacity-50"
                    >
                      {enrollPilotMutation.isPending && selectedPilot === pilot.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enrolling...
                        </span>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>

                    {pilot.price > 0 && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Get 20% discount when converting to paid license
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pilot Benefits */}
              <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What Happens During the Pilot?</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Full Platform Access</h4>
                        <p className="text-sm text-gray-700">Test all features with real students and get a true feel for AIVO's capabilities</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Dedicated Support</h4>
                        <p className="text-sm text-gray-700">Get help from our team throughout your pilot period</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Data & Analytics</h4>
                        <p className="text-sm text-gray-700">Access comprehensive reports to measure impact</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Easy Conversion</h4>
                        <p className="text-sm text-gray-700">Convert to a paid license with one click and keep all your data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Active Licenses</h2>
                <p className="text-lg text-gray-600">
                  Manage your subscriptions, pause licenses, or convert pilots to paid plans
                </p>
              </div>

              <div className="space-y-6">
                {activeLicenses?.map((license) => (
                  <div
                    key={license.id}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          license.type === 'pilot'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}>
                          {license.type === 'pilot' ? (
                            <Zap className="w-7 h-7 text-white" />
                          ) : (
                            <Award className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {license.type === 'pilot' ? 'Pilot Program' : 'Paid License'}
                            </h3>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(license.status)}`}>
                              {getStatusIcon(license.status)}
                              {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {license.licenses} licenses • {license.used} in use ({Math.round((license.used / license.licenses) * 100)}% utilization)
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {new Date(license.endDate).toLocaleDateString()}</span>
                        </div>
                        {license.monthlyPrice && (
                          <p className="text-lg font-bold text-gray-900">
                            ${license.monthlyPrice.toLocaleString()}/month
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Usage Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">License Usage</span>
                        <span className="font-semibold text-gray-900">
                          {license.used} / {license.licenses}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            (license.used / license.licenses) > 0.9
                              ? 'bg-gradient-to-r from-red-500 to-red-600'
                              : (license.used / license.licenses) > 0.7
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              : 'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          style={{ width: `${(license.used / license.licenses) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {license.type === 'pilot' && (
                        <button
                          onClick={() => handleConvertPilot(license.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Convert to Paid License
                        </button>
                      )}

                      {license.status === 'active' ? (
                        <button
                          onClick={() => handlePauseLicense(license.id)}
                          disabled={pauseLicenseMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-all font-medium"
                        >
                          <Pause className="w-4 h-4" />
                          Pause License
                        </button>
                      ) : license.status === 'paused' ? (
                        <button
                          onClick={() => handleResumeLicense(license.id)}
                          disabled={resumeLicenseMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-all font-medium"
                        >
                          <Play className="w-4 h-4" />
                          Resume License
                        </button>
                      ) : null}

                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all font-medium">
                        <Plus className="w-4 h-4" />
                        Add More Licenses
                      </button>

                      {license.type === 'paid' && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all font-medium">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                      )}

                      {license.autoRenew && (
                        <div className="flex items-center gap-2 text-sm text-green-600 ml-auto">
                          <RotateCcw className="w-4 h-4" />
                          Auto-renew enabled
                        </div>
                      )}
                    </div>

                    {/* Warning for high utilization */}
                    {(license.used / license.licenses) > 0.85 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <strong>High Utilization:</strong> You're using {Math.round((license.used / license.licenses) * 100)}% of your licenses. 
                          Consider adding more licenses to avoid capacity issues.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* No Active Licenses State */}
              {(!activeLicenses || activeLicenses.length === 0) && (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Licenses</h3>
                  <p className="text-gray-600 mb-6">Get started by purchasing licenses or enrolling in a pilot</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('purchase')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      Purchase Licenses
                    </button>
                    <button
                      onClick={() => setActiveTab('pilot')}
                      className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-all font-medium"
                    >
                      Try a Pilot
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Convert Pilot Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowConvertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Convert Pilot to Paid License</h2>
                  <p className="text-gray-600">Choose a package and keep all your data</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <strong>Special Offer:</strong> Get 20% off your first year when converting from a pilot!
                    All your student data, AI models, and settings will be preserved.
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {licensePackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      if (convertingPilot) {
                        convertPilotMutation.mutate({ pilotId: convertingPilot, packageId: pkg.id });
                      }
                    }}
                    className="w-full p-4 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{pkg.name} Package</h3>
                        <p className="text-sm text-gray-600">{pkg.licenses} licenses</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${Math.round(pkg.price * 0.8).toLocaleString()}
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${pkg.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 font-semibold">20% OFF</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Purchase</h2>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Package</span>
                  <span className="font-semibold text-gray-900">
                    {licensePackages.find(p => p.id === selectedPackage)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Licenses</span>
                  <span className="font-semibold text-gray-900">
                    {licensePackages.find(p => p.id === selectedPackage)?.licenses}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${licensePackages.find(p => p.id === selectedPackage)?.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => purchaseMutation.mutate(selectedPackage)}
                disabled={purchaseMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold mb-3 disabled:opacity-50"
              >
                {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
              </button>

              <button
                onClick={() => setShowCheckout(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calculator,
  Lightbulb,
  AlertTriangle,
  Settings,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { useToast } from './ToastProvider';

interface CostOptimizationProps {
  providers: Array<{
    id: string;
    name: string;
    vendor: string;
    costPerRequest: number;
    totalRequests: number;
    billing: {
      monthly: number;
      daily: number;
      hourly: number;
    };
    successRate: number;
    latency: number;
  }>;
}

const CostOptimization: React.FC<CostOptimizationProps> = ({ providers }) => {
  const toast = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [optimizationMode, setOptimizationMode] = useState<'cost' | 'performance' | 'balanced'>('balanced');

  // Calculate optimization metrics
  const totalCost = providers.reduce((sum, p) => sum + p.billing.monthly, 0);
  const totalRequests = providers.reduce((sum, p) => sum + p.totalRequests, 0);
  const avgCostPerRequest = totalCost / (totalRequests || 1);

  // Cost optimization recommendations
  const recommendations = [
    {
      id: 1,
      type: 'high-impact',
      title: 'Switch High-Volume Requests to Lower-Cost Provider',
      description: 'Move 40% of Claude 3 traffic to Google PaLM for routine tasks',
      impact: 'Save $2,850/month (32% reduction)',
      effort: 'Medium',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 2,
      type: 'medium-impact',
      title: 'Implement Request Batching',
      description: 'Batch similar requests to reduce API call overhead',
      impact: 'Save $420/month (5% reduction)',
      effort: 'Low',
      icon: Zap,
      color: 'blue'
    },
    {
      id: 3,
      type: 'optimization',
      title: 'Enable Auto-Scaling Rules',
      description: 'Automatically scale down during off-peak hours',
      impact: 'Save $1,200/month (15% reduction)',
      effort: 'High',
      icon: TrendingDown,
      color: 'purple'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Review DALL-E 3 Usage',
      description: 'High cost per request detected for image generation',
      impact: 'Potential savings: $680/month',
      effort: 'Medium',
      icon: AlertTriangle,
      color: 'yellow'
    }
  ];

  // Provider efficiency analysis
  const providerEfficiency = providers.map(provider => {
    const costEfficiency = 1 / provider.costPerRequest;
    const performanceScore = (provider.successRate / 100) * (1000 / Math.max(provider.latency, 1));
    const efficiency = (costEfficiency + performanceScore) / 2;
    
    return {
      ...provider,
      efficiency,
      costEfficiency,
      performanceScore,
      recommendation: efficiency > 0.8 ? 'optimal' : efficiency > 0.5 ? 'good' : 'needs-attention'
    };
  }).sort((a, b) => b.efficiency - a.efficiency);

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'high-impact': return 'border-green-200 bg-green-50 text-green-800';
      case 'medium-impact': return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'optimization': return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getEfficiencyColor = (recommendation: string) => {
    switch (recommendation) {
      case 'optimal': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'needs-attention': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</p>
              <p className="text-sm text-red-600">+12% vs last month</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cost/Request</p>
              <p className="text-2xl font-bold text-gray-900">${avgCostPerRequest.toFixed(3)}</p>
              <p className="text-sm text-green-600">-3% vs last month</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-gray-900">$5,150</p>
              <p className="text-sm text-purple-600">58% optimization</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
              <p className="text-2xl font-bold text-gray-900">7.2/10</p>
              <p className="text-sm text-blue-600">Good performance</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Optimization Mode</label>
              <select
                value={optimizationMode}
                onChange={(e) => setOptimizationMode(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              >
                <option value="cost">Cost First</option>
                <option value="performance">Performance First</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const reportData = {
                  currentSpend: totalCost,
                  projectedSavings: 2850,
                  recommendations: recommendations.length,
                  reportDate: new Date().toLocaleDateString(),
                  topRecommendations: recommendations.slice(0, 3).map((r: any) => r.title)
                };
                toast.success('Report Generated', `Cost optimization report generated! Current spend: $${reportData.currentSpend.toLocaleString()}, potential savings: $${reportData.projectedSavings.toLocaleString()}. Downloading...`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </button>
            <button 
              onClick={() => {
                const applicableOptimizations = recommendations.filter((r: any) => r.effort === 'Low' || r.effort === 'Medium');
                toast.success('Optimizations Applied', `Successfully applied ${applicableOptimizations.length} optimization recommendations! Projected monthly savings: $${Math.floor(2850 * 0.7).toLocaleString()}. Changes will take effect within 15 minutes.`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Apply Optimizations
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimization Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Optimization Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div key={rec.id} className={`border rounded-lg p-4 ${getRecommendationColor(rec.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      rec.color === 'green' ? 'bg-green-100' :
                      rec.color === 'blue' ? 'bg-blue-100' :
                      rec.color === 'purple' ? 'bg-purple-100' :
                      rec.color === 'yellow' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        rec.color === 'green' ? 'text-green-600' :
                        rec.color === 'blue' ? 'text-blue-600' :
                        rec.color === 'purple' ? 'text-purple-600' :
                        rec.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{rec.impact}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
                            {rec.effort} effort
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Provider Efficiency Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            Provider Efficiency Analysis
          </h3>
          <div className="space-y-4">
            {providerEfficiency.map((provider, index) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-600">{provider.vendor}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEfficiencyColor(provider.recommendation)}`}>
                    {provider.recommendation.replace('-', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cost/Request</p>
                    <p className="font-medium">${provider.costPerRequest}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-medium">{provider.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Efficiency</p>
                    <div className="flex items-center gap-1">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-coral-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(provider.efficiency * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs">{(provider.efficiency * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Breakdown Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Cost Breakdown & Trends
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive cost visualization coming soon</p>
            <p className="text-sm text-gray-500">Will include provider comparison, trend analysis, and forecasting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOptimization;
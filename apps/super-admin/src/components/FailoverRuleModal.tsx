import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Save,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  type: 'LLM' | 'Vision' | 'Audio' | 'Multimodal';
  vendor: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
}

interface FailoverRule {
  id: string;
  name: string;
  primaryProvider: string;
  fallbackProviders: string[];
  trigger: 'latency' | 'error_rate' | 'quota' | 'manual';
  threshold: number;
  enabled: boolean;
  lastTriggered?: string;
}

interface FailoverRuleModalProps {
  rule?: FailoverRule;
  providers: AIProvider[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<FailoverRule, 'id'>) => void;
}

const FailoverRuleModal: React.FC<FailoverRuleModalProps> = ({
  rule,
  providers,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Omit<FailoverRule, 'id'>>({
    name: rule?.name || '',
    primaryProvider: rule?.primaryProvider || '',
    fallbackProviders: rule?.fallbackProviders || [],
    trigger: rule?.trigger || 'error_rate',
    threshold: rule?.threshold || 5,
    enabled: rule?.enabled ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (!formData.primaryProvider) {
      newErrors.primaryProvider = 'Primary provider is required';
    }

    if (formData.fallbackProviders.length === 0) {
      newErrors.fallbackProviders = 'At least one fallback provider is required';
    }

    if (formData.fallbackProviders.includes(formData.primaryProvider)) {
      newErrors.fallbackProviders = 'Fallback providers cannot include the primary provider';
    }

    if (formData.threshold <= 0) {
      newErrors.threshold = 'Threshold must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleAddFallback = (providerId: string) => {
    if (!formData.fallbackProviders.includes(providerId) && providerId !== formData.primaryProvider) {
      setFormData({
        ...formData,
        fallbackProviders: [...formData.fallbackProviders, providerId]
      });
    }
  };

  const handleRemoveFallback = (providerId: string) => {
    setFormData({
      ...formData,
      fallbackProviders: formData.fallbackProviders.filter(id => id !== providerId)
    });
  };

  const availableProviders = providers.filter(p => 
    p.status === 'active' && !formData.fallbackProviders.includes(p.id) && p.id !== formData.primaryProvider
  );

  const getThresholdUnit = () => {
    switch (formData.trigger) {
      case 'latency': return 'ms';
      case 'error_rate': return '%';
      case 'quota': return '%';
      default: return '';
    }
  };

  const getThresholdDescription = () => {
    switch (formData.trigger) {
      case 'latency': return 'Trigger when latency exceeds this value (milliseconds)';
      case 'error_rate': return 'Trigger when error rate exceeds this percentage';
      case 'quota': return 'Trigger when quota usage exceeds this percentage';
      case 'manual': return 'Manual failover only';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-6 w-6 text-coral-500" />
            {rule ? 'Edit Failover Rule' : 'Create Failover Rule'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter rule name..."
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Primary Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Provider *
              </label>
              <select
                value={formData.primaryProvider}
                onChange={(e) => setFormData({ ...formData, primaryProvider: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 ${
                  errors.primaryProvider ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select primary provider...</option>
                {providers.filter(p => p.status === 'active').map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} ({provider.vendor})
                  </option>
                ))}
              </select>
              {errors.primaryProvider && <p className="text-red-600 text-sm mt-1">{errors.primaryProvider}</p>}
            </div>

            {/* Trigger Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type
                </label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                >
                  <option value="error_rate">Error Rate</option>
                  <option value="latency">High Latency</option>
                  <option value="quota">Quota Exhaustion</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              {formData.trigger !== 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Threshold {getThresholdUnit() && `(${getThresholdUnit()})`}
                  </label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 ${
                      errors.threshold ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    step={formData.trigger === 'latency' ? '100' : '1'}
                  />
                  {errors.threshold && <p className="text-red-600 text-sm mt-1">{errors.threshold}</p>}
                  <p className="text-gray-500 text-sm mt-1">{getThresholdDescription()}</p>
                </div>
              )}
            </div>

            {/* Fallback Providers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fallback Providers *
              </label>
              
              {/* Selected Fallback Providers */}
              {formData.fallbackProviders.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Selected providers (in priority order):</p>
                  <div className="space-y-2">
                    {formData.fallbackProviders.map((providerId, index) => {
                      const provider = providers.find(p => p.id === providerId);
                      return (
                        <div key={providerId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="bg-coral-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              #{index + 1}
                            </span>
                            <span className="font-medium">{provider?.name}</span>
                            <span className="text-gray-500">({provider?.vendor})</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFallback(providerId)}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Fallback Provider */}
              {availableProviders.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Add fallback provider:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleAddFallback(provider.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        {provider.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {errors.fallbackProviders && <p className="text-red-600 text-sm mt-1">{errors.fallbackProviders}</p>}
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                Enable this rule immediately
              </label>
              {formData.enabled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>

            {/* Rule Preview */}
            {formData.name && formData.primaryProvider && formData.fallbackProviders.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Rule Preview</h4>
                <p className="text-blue-800 text-sm">
                  When <strong>{providers.find(p => p.id === formData.primaryProvider)?.name}</strong>
                  {formData.trigger !== 'manual' && (
                    <> {formData.trigger.replace('_', ' ')} exceeds {formData.threshold}{getThresholdUnit()}</>
                  )}
                  {formData.trigger === 'manual' && <> is manually failed over</>},
                  automatically switch to{' '}
                  <strong>
                    {formData.fallbackProviders.map(id => 
                      providers.find(p => p.id === id)?.name
                    ).join(' → ')}
                  </strong> in order.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FailoverRuleModal;
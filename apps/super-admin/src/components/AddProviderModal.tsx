import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, CheckCircle } from 'lucide-react';
import { useToast } from './ToastProvider';
import { useConfirmDialog } from './ConfirmDialogProvider';
import { ButtonLoading } from './LoadingStates';

interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  models: string[];
  priority: number;
  costPerToken: number;
  rateLimit: number;
  maxTokens: number;
  timeout: number;
  retries: number;
  status: 'active' | 'inactive';
  description?: string;
}

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (provider: Omit<AIProvider, 'id'>) => Promise<void>;
}

const providerTypes = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5-turbo and other OpenAI models',
    defaultModels: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    defaultBaseUrl: 'https://api.openai.com/v1',
    icon: '🤖'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3 and other Anthropic models',
    defaultModels: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    icon: '🎭'
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Configure a custom AI provider with your own settings',
    defaultModels: [],
    defaultBaseUrl: '',
    icon: '⚙️'
  }
];

export const AddProviderModal: React.FC<AddProviderModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const { success, error } = useToast();
  const { confirm } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AIProvider>>({
    name: '',
    type: 'openai',
    apiKey: '',
    baseUrl: '',
    models: [],
    priority: 1,
    costPerToken: 0.002,
    rateLimit: 1000,
    maxTokens: 4096,
    timeout: 30,
    retries: 3,
    status: 'active',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newModel, setNewModel] = useState('');

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Provider name is required';
      }
      if (!formData.type) {
        newErrors.type = 'Provider type is required';
      }
    }

    if (stepNumber === 2) {
      if (!formData.apiKey?.trim()) {
        newErrors.apiKey = 'API key is required';
      }
      if (formData.type === 'custom' && !formData.baseUrl?.trim()) {
        newErrors.baseUrl = 'Base URL is required for custom providers';
      }
      if (!formData.models || formData.models.length === 0) {
        newErrors.models = 'At least one model is required';
      }
    }

    if (stepNumber === 3) {
      if (formData.priority === undefined || formData.priority < 1) {
        newErrors.priority = 'Priority must be at least 1';
      }
      if (formData.rateLimit === undefined || formData.rateLimit < 1) {
        newErrors.rateLimit = 'Rate limit must be at least 1';
      }
      if (formData.timeout === undefined || formData.timeout < 1) {
        newErrors.timeout = 'Timeout must be at least 1 second';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleTypeChange = (type: string) => {
    const providerType = providerTypes.find(p => p.id === type);
    setFormData({
      ...formData,
      type: type as AIProvider['type'],
      baseUrl: providerType?.defaultBaseUrl || '',
      models: [...(providerType?.defaultModels || [])]
    });
  };

  const addModel = () => {
    if (newModel.trim() && !formData.models?.includes(newModel.trim())) {
      setFormData({
        ...formData,
        models: [...(formData.models || []), newModel.trim()]
      });
      setNewModel('');
    }
  };

  const removeModel = (model: string) => {
    setFormData({
      ...formData,
      models: formData.models?.filter(m => m !== model) || []
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const confirmed = await confirm({
      title: 'Add AI Provider',
      description: `Are you sure you want to add "${formData.name}" as a new AI provider?`,
      details: [
        `Type: ${providerTypes.find(p => p.id === formData.type)?.name}`,
        `Models: ${formData.models?.join(', ')}`,
        `Priority: ${formData.priority}`,
        `Rate Limit: ${formData.rateLimit} requests/minute`,
        `Status: ${formData.status}`
      ],
      confirmText: 'Add Provider',
      type: 'success'
    });

    if (!confirmed) return;

    setIsLoading(true);
    try {
      await onAdd(formData as Omit<AIProvider, 'id'>);
      success('Provider Added', `${formData.name} has been successfully added to the system.`);
      onClose();
      // Reset form
      setFormData({
        name: '',
        type: 'openai',
        apiKey: '',
        baseUrl: '',
        models: [],
        priority: 1,
        costPerToken: 0.002,
        rateLimit: 1000,
        maxTokens: 4096,
        timeout: 30,
        retries: 3,
        status: 'active',
        description: ''
      });
      setStep(1);
    } catch (err) {
      error('Failed to Add Provider', 'There was an error adding the AI provider. Please try again.');
      console.error('Error adding provider:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add AI Provider
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          </div>
          
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-coral-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-coral-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter provider name (e.g., OpenAI Primary)"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider Type *
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {providerTypes.map((type) => (
                        <label
                          key={type.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.type === type.id
                              ? 'border-coral-500 bg-coral-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.id}
                            checked={formData.type === type.id}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Brief description of this provider instance..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: API Configuration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key *
                    </label>
                    <input
                      type="password"
                      value={formData.apiKey || ''}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder="Enter your API key"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                        errors.apiKey ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.apiKey && <p className="text-red-600 text-sm mt-1">{errors.apiKey}</p>}
                  </div>

                  {formData.type === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base URL *
                      </label>
                      <input
                        type="url"
                        value={formData.baseUrl || ''}
                        onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                        placeholder="https://api.example.com/v1"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                          errors.baseUrl ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.baseUrl && <p className="text-red-600 text-sm mt-1">{errors.baseUrl}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Models *
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newModel}
                          onChange={(e) => setNewModel(e.target.value)}
                          placeholder="Enter model name"
                          onKeyDown={(e) => e.key === 'Enter' && addModel()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                        />
                        <button
                          type="button"
                          onClick={addModel}
                          className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      
                      {formData.models && formData.models.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.models.map((model) => (
                            <span
                              key={model}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {model}
                              <button
                                type="button"
                                onClick={() => removeModel(model)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.models && <p className="text-red-600 text-sm mt-1">{errors.models}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                        errors.priority ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost per Token ($)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="0"
                      value={formData.costPerToken || ''}
                      onChange={(e) => setFormData({ ...formData, costPerToken: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Limit (req/min) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.rateLimit || ''}
                      onChange={(e) => setFormData({ ...formData, rateLimit: parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                        errors.rateLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.rateLimit && <p className="text-red-600 text-sm mt-1">{errors.rateLimit}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTokens || ''}
                      onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout (seconds) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.timeout || ''}
                      onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 ${
                        errors.timeout ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.timeout && <p className="text-red-600 text-sm mt-1">{errors.timeout}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retry Attempts
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.retries || ''}
                      onChange={(e) => setFormData({ ...formData, retries: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Status
                  </label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <ButtonLoading
                isLoading={isLoading}
                onClick={handleSubmit}
                loadingText="Adding Provider..."
                className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors"
              >
                Add Provider
              </ButtonLoading>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddProviderModal;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Shield, 
  User, 
  Key, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: 'platform' | 'content' | 'user' | 'analytics' | 'system';
}

interface RoleCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  onCreateRole: (roleData: any) => void;
}

interface RoleFormData {
  name: string;
  description: string;
  type: 'custom';
  permissions: string[];
  isActive: boolean;
}

const RoleCreationWizard: React.FC<RoleCreationWizardProps> = ({
  isOpen,
  onClose,
  permissions,
  onCreateRole
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    type: 'custom',
    permissions: [],
    isActive: true
  });
  const [showPermissionDetails, setShowPermissionDetails] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, name: 'Basic Info', icon: User, description: 'Role name and description' },
    { number: 2, name: 'Permissions', icon: Key, description: 'Select role permissions' },
    { number: 3, name: 'Review', icon: CheckCircle, description: 'Review and create' }
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        errors.name = 'Role name is required';
      } else if (formData.name.length < 3) {
        errors.name = 'Role name must be at least 3 characters';
      }
      
      if (!formData.description.trim()) {
        errors.description = 'Role description is required';
      } else if (formData.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
      }
    }

    if (step === 2) {
      if (formData.permissions.length === 0) {
        errors.permissions = 'At least one permission must be selected';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleCreate = () => {
    if (validateStep(2)) {
      const roleData = {
        ...formData,
        id: `role-${Date.now()}`,
        userCount: 0,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        createdBy: 'current-user@aivo.com'
      };
      onCreateRole(roleData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'custom',
        permissions: [],
        isActive: true
      });
      setCurrentStep(1);
      setValidationErrors({});
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform': return 'from-purple-500 to-purple-600';
      case 'content': return 'from-green-500 to-green-600';
      case 'user': return 'from-blue-500 to-blue-600';
      case 'analytics': return 'from-orange-500 to-orange-600';
      case 'system': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'platform': return '🏗️';
      case 'content': return '📚';
      case 'user': return '👤';
      case 'analytics': return '📊';
      case 'system': return '⚙️';
      default: return '🔧';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-coral-500 to-purple-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
                  <p className="text-sm text-gray-600">Define a custom role with specific permissions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        step.number === currentStep
                          ? 'bg-gradient-to-br from-coral-500 to-purple-600 text-white shadow-lg'
                          : step.number < currentStep
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.number < currentStep ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${
                          step.number === currentStep ? 'text-coral-600' :
                          step.number < currentStep ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </div>
                        <div className="text-xs text-gray-500">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-4 ${
                        step.number < currentStep ? 'bg-green-300' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
                      <p className="text-gray-600">Provide the basic details for your new role.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Content Manager, District Analyst"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 ${
                            validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          placeholder="Describe the purpose and responsibilities of this role..."
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 resize-none ${
                            validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.description && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-coral-50 to-purple-50 rounded-lg border border-coral-200">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-4 h-4 text-coral-600 rounded focus:ring-coral-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                          Activate role immediately
                        </label>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <strong>Best Practices:</strong>
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            <li>Use clear, descriptive names that indicate the role's function</li>
                            <li>Include the scope of access in the description</li>
                            <li>Follow the principle of least privilege</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Permissions */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Permissions</h3>
                        <p className="text-gray-600">
                          Choose the permissions this role should have. Selected: {formData.permissions.length} of {permissions.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            permissions: prev.permissions.length === permissions.length ? [] : permissions.map(p => p.id)
                          }))}
                          className="text-sm text-coral-600 hover:text-coral-700 font-medium"
                        >
                          {formData.permissions.length === permissions.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                    </div>

                    {validationErrors.permissions && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.permissions}
                        </p>
                      </div>
                    )}

                    <div className="space-y-6 max-h-96 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className={`bg-gradient-to-r ${getCategoryColor(category)} p-4`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getCategoryIcon(category)}</span>
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {category.charAt(0).toUpperCase() + category.slice(1)} Permissions
                                  </h4>
                                  <p className="text-sm text-white/80">
                                    {categoryPermissions.length} permissions available
                                  </p>
                                </div>
                              </div>
                              <div className="text-white/80 text-sm">
                                {categoryPermissions.filter(p => formData.permissions.includes(p.id)).length} selected
                              </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <input
                                  type="checkbox"
                                  id={permission.id}
                                  checked={formData.permissions.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="w-4 h-4 text-coral-600 rounded focus:ring-coral-500 mt-1"
                                />
                                <div className="flex-1">
                                  <label htmlFor={permission.id} className="block font-medium text-gray-900 cursor-pointer">
                                    {permission.name}
                                  </label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                      {permission.resource} • {permission.action}
                                    </span>
                                    <button
                                      onClick={() => setShowPermissionDetails(
                                        showPermissionDetails === permission.id ? null : permission.id
                                      )}
                                      className="text-xs text-coral-600 hover:text-coral-700 flex items-center gap-1"
                                    >
                                      {showPermissionDetails === permission.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                      {showPermissionDetails === permission.id ? 'Hide' : 'Details'}
                                    </button>
                                  </div>
                                  {showPermissionDetails === permission.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700"
                                    >
                                      {permission.description}
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Role</h3>
                      <p className="text-gray-600">Review the role configuration before creating.</p>
                    </div>

                    {/* Role Summary */}
                    <div className="bg-gradient-to-br from-coral-50 to-purple-50 rounded-lg p-6 border border-coral-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-coral-500 to-purple-600 rounded-xl">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{formData.name}</h4>
                          <p className="text-gray-600 mt-1">{formData.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500">Type: Custom Role</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {formData.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Summary */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900">
                          Permissions ({formData.permissions.length})
                        </h4>
                      </div>
                      <div className="p-4 space-y-4">
                        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                          const selectedInCategory = categoryPermissions.filter(p => formData.permissions.includes(p.id));
                          if (selectedInCategory.length === 0) return null;

                          return (
                            <div key={category}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getCategoryIcon(category)}</span>
                                <h5 className="font-medium text-gray-900">
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </h5>
                                <span className="text-sm text-gray-500">
                                  ({selectedInCategory.length})
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 ml-6">
                                {selectedInCategory.map((permission) => (
                                  <div key={permission.id} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-gray-700">{permission.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <strong>Important:</strong> Once created, this role can be assigned to users immediately. 
                          Ensure the permissions are correct as users will gain access to these capabilities.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={currentStep === 1 ? onClose : handlePrevious}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white rounded-lg hover:from-coral-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Create Role
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default RoleCreationWizard;
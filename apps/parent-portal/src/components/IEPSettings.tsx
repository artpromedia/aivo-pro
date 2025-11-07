import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Bell, 
  FileText, 
  Settings as SettingsIcon,
  Eye,
  Lock
} from 'lucide-react';

interface IEPSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

interface IEPSettingsData {
  notifications: {
    goalProgress: boolean;
    meetingReminders: boolean;
    documentUpdates: boolean;
    evaluationAlerts: boolean;
  };
  privacy: {
    shareWithTeachers: boolean;
    shareWithTherapists: boolean;
    shareWithAdministrators: boolean;
    anonymousDataCollection: boolean;
  };
  reports: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    format: 'pdf' | 'email' | 'both';
    includePhotos: boolean;
    detailedProgress: boolean;
  };
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
}

const IEPSettings: React.FC<IEPSettingsProps> = ({ isOpen, onClose, childId: _childId }) => {
  const [settings, setSettings] = useState<IEPSettingsData>({
    notifications: {
      goalProgress: true,
      meetingReminders: true,
      documentUpdates: true,
      evaluationAlerts: true,
    },
    privacy: {
      shareWithTeachers: true,
      shareWithTherapists: true,
      shareWithAdministrators: false,
      anonymousDataCollection: true,
    },
    reports: {
      frequency: 'monthly',
      format: 'both',
      includePhotos: true,
      detailedProgress: true,
    },
    accessibility: {
      largeText: false,
      highContrast: false,
      screenReader: false,
      keyboardNavigation: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would normally save to an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Settings saved:', settings);
      alert('Settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (section: keyof IEPSettingsData, key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-coral-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-coral-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">IEP Settings</h2>
              <p className="text-sm text-gray-600">Configure your IEP preferences and notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-coral-600" />
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.goalProgress}
                    onChange={(e) => updateSetting('notifications', 'goalProgress', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Goal progress updates</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.meetingReminders}
                    onChange={(e) => updateSetting('notifications', 'meetingReminders', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Meeting reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.documentUpdates}
                    onChange={(e) => updateSetting('notifications', 'documentUpdates', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Document updates</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.evaluationAlerts}
                    onChange={(e) => updateSetting('notifications', 'evaluationAlerts', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Evaluation alerts</span>
                </label>
              </div>
            </div>

            {/* Privacy & Sharing */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-coral-600" />
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Sharing</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareWithTeachers}
                    onChange={(e) => updateSetting('privacy', 'shareWithTeachers', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Share with teachers</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareWithTherapists}
                    onChange={(e) => updateSetting('privacy', 'shareWithTherapists', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Share with therapists</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareWithAdministrators}
                    onChange={(e) => updateSetting('privacy', 'shareWithAdministrators', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Share with administrators</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.privacy.anonymousDataCollection}
                    onChange={(e) => updateSetting('privacy', 'anonymousDataCollection', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Anonymous data collection</span>
                </label>
              </div>
            </div>

            {/* Reports */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-coral-600" />
                <h3 className="text-lg font-semibold text-gray-900">Progress Reports</h3>
              </div>
              <div className="ml-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Frequency
                    </label>
                    <select
                      value={settings.reports.frequency}
                      onChange={(e) => updateSetting('reports', 'frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-coral-500 focus:border-coral-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Format
                    </label>
                    <select
                      value={settings.reports.format}
                      onChange={(e) => updateSetting('reports', 'format', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-coral-500 focus:border-coral-500"
                    >
                      <option value="pdf">PDF Only</option>
                      <option value="email">Email Only</option>
                      <option value="both">Both PDF & Email</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reports.includePhotos}
                      onChange={(e) => updateSetting('reports', 'includePhotos', e.target.checked)}
                      className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                    />
                    <span className="text-sm text-gray-700">Include photos</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reports.detailedProgress}
                      onChange={(e) => updateSetting('reports', 'detailedProgress', e.target.checked)}
                      className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                    />
                    <span className="text-sm text-gray-700">Detailed progress charts</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-coral-600" />
                <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.largeText}
                    onChange={(e) => updateSetting('accessibility', 'largeText', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Large text</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.highContrast}
                    onChange={(e) => updateSetting('accessibility', 'highContrast', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">High contrast</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.screenReader}
                    onChange={(e) => updateSetting('accessibility', 'screenReader', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Screen reader support</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.keyboardNavigation}
                    onChange={(e) => updateSetting('accessibility', 'keyboardNavigation', e.target.checked)}
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500"
                  />
                  <span className="text-sm text-gray-700">Enhanced keyboard navigation</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IEPSettings;
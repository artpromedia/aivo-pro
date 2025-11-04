import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  BookOpen,
  Target,
  Clock,
  Shield,
  Bell,
  Eye,
  Save,
  X,
  AlertTriangle,
  Settings as SettingsIcon,
  Brain,
  Calendar,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Monitor
} from 'lucide-react';

interface ChildSettingsData {
  id: string;
  name: string;
  avatar: string;
  age: number;
  grade: number;
  learningGoals: {
    dailyMinutes: number;
    weeklyHours: number;
    subjects: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  preferences: {
    visualTheme: 'light' | 'dark' | 'auto';
    soundEffects: boolean;
    musicBackground: boolean;
    notifications: boolean;
    reminderTime: string;
    screenTime: {
      dailyLimit: number;
      breakReminder: number;
    };
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    voiceGuidance: boolean;
  };
  parentalControls: {
    contentFilter: 'strict' | 'moderate' | 'relaxed';
    timeRestrictions: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      weekendsOnly: boolean;
    };
    progressSharing: {
      withTeacher: boolean;
      withFamily: boolean;
      publicAchievements: boolean;
    };
  };
}

export const ChildSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'learning' | 'preferences' | 'accessibility' | 'parental'>('profile');
  const [hasChanges, setHasChanges] = useState(false);

  // Mock child settings data
  const [settings, setSettings] = useState<ChildSettingsData>({
    id: id || '1',
    name: 'Emma Chen',
    avatar: '👧',
    age: 8,
    grade: 3,
    learningGoals: {
      dailyMinutes: 45,
      weeklyHours: 5,
      subjects: ['Math', 'Reading', 'Science'],
      difficulty: 'intermediate'
    },
    preferences: {
      visualTheme: 'light',
      soundEffects: true,
      musicBackground: false,
      notifications: true,
      reminderTime: '16:00',
      screenTime: {
        dailyLimit: 60,
        breakReminder: 15
      }
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      voiceGuidance: true
    },
    parentalControls: {
      contentFilter: 'moderate',
      timeRestrictions: {
        enabled: false,
        startTime: '09:00',
        endTime: '20:00',
        weekendsOnly: false
      },
      progressSharing: {
        withTeacher: true,
        withFamily: true,
        publicAchievements: false
      }
    }
  });

  const handleSave = () => {
    // Save settings to backend
    alert(`Settings saved for ${settings.name}!`);
    setHasChanges(false);
  };

  const updateSettings = (section: keyof ChildSettingsData, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any || {}), ...updates }
    }));
    setHasChanges(true);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'learning', label: 'Learning', icon: Brain },
    { key: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { key: 'accessibility', label: 'Accessibility', icon: Eye },
    { key: 'parental', label: 'Parental Controls', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={`/children/${id}`}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-sm hover:shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-aivo-gradient rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              {settings.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
                {settings.name}'s Settings
              </h1>
              <p className="text-gray-600">
                Customize learning experience and preferences
              </p>
            </div>
          </div>

          {hasChanges && (
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setHasChanges(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="space-y-2">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === key
                        ? 'bg-aivo-gradient text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 min-h-[600px]">
              {activeTab === 'profile' && <ProfileSettings settings={settings} updateSettings={updateSettings} />}
              {activeTab === 'learning' && <LearningSettings settings={settings} updateSettings={updateSettings} />}
              {activeTab === 'preferences' && <PreferencesSettings settings={settings} updateSettings={updateSettings} />}
              {activeTab === 'accessibility' && <AccessibilitySettings settings={settings} updateSettings={updateSettings} />}
              {activeTab === 'parental' && <ParentalSettings settings={settings} updateSettings={updateSettings} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings: React.FC<{ settings: ChildSettingsData; updateSettings: any }> = ({ settings, updateSettings }) => (
  <div className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => updateSettings('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={settings.age}
            onChange={(e) => updateSettings('age', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
        <select
          value={settings.grade}
          onChange={(e) => updateSettings('grade', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i}>{i === 0 ? 'Kindergarten' : `Grade ${i}`}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
        <div className="flex gap-3">
          {['👧', '👦', '🧒', '👶', '🦄', '🐱', '🐶', '🌟'].map(emoji => (
            <button
              key={emoji}
              onClick={() => updateSettings('avatar', emoji)}
              className={`w-12 h-12 rounded-xl text-xl transition-all ${
                settings.avatar === emoji
                  ? 'bg-aivo-gradient shadow-lg scale-110'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Learning Settings Component
const LearningSettings: React.FC<{ settings: ChildSettingsData; updateSettings: any }> = ({ settings, updateSettings }) => (
  <div className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Goals & Progress</h3>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Learning (minutes)</label>
          <input
            type="number"
            value={settings.learningGoals.dailyMinutes}
            onChange={(e) => updateSettings('learningGoals', { dailyMinutes: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Goal (hours)</label>
          <input
            type="number"
            value={settings.learningGoals.weeklyHours}
            onChange={(e) => updateSettings('learningGoals', { weeklyHours: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
        <select
          value={settings.learningGoals.difficulty}
          onChange={(e) => updateSettings('learningGoals', { difficulty: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        >
          <option value="beginner">Beginner - Focus on fundamentals</option>
          <option value="intermediate">Intermediate - Balanced challenge</option>
          <option value="advanced">Advanced - Push boundaries</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Subjects</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Math', 'Reading', 'Science', 'Art', 'Music', 'Social Studies'].map(subject => (
            <label key={subject} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.learningGoals.subjects.includes(subject)}
                onChange={(e) => {
                  const subjects = e.target.checked
                    ? [...settings.learningGoals.subjects, subject]
                    : settings.learningGoals.subjects.filter(s => s !== subject);
                  updateSettings('learningGoals', { subjects });
                }}
                className="rounded border-gray-300 text-coral-600 focus:ring-coral-500"
              />
              <span className="text-sm text-gray-700">{subject}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Preferences Settings Component
const PreferencesSettings: React.FC<{ settings: ChildSettingsData; updateSettings: any }> = ({ settings, updateSettings }) => (
  <div className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-6">App Preferences</h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Visual Theme</label>
        <div className="flex gap-3">
          {[
            { key: 'light', label: 'Light', icon: Sun },
            { key: 'dark', label: 'Dark', icon: Moon },
            { key: 'auto', label: 'Auto', icon: Monitor }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => updateSettings('preferences', { visualTheme: key })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                settings.preferences.visualTheme === key
                  ? 'bg-aivo-gradient text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for interactions' },
          { key: 'musicBackground', label: 'Background Music', description: 'Play ambient music during lessons' },
          { key: 'notifications', label: 'Push Notifications', description: 'Receive reminders and updates' }
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h5 className="font-medium text-gray-900">{label}</h5>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preferences[key as keyof typeof settings.preferences] as boolean}
                onChange={(e) => updateSettings('preferences', { [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reminder Time</label>
          <input
            type="time"
            value={settings.preferences.reminderTime}
            onChange={(e) => updateSettings('preferences', { reminderTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Screen Time Limit (minutes)</label>
          <input
            type="number"
            value={settings.preferences.screenTime.dailyLimit}
            onChange={(e) => updateSettings('preferences', { 
              screenTime: { ...settings.preferences.screenTime, dailyLimit: parseInt(e.target.value) }
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </div>
);

// Accessibility Settings Component
const AccessibilitySettings: React.FC<{ settings: ChildSettingsData; updateSettings: any }> = ({ settings, updateSettings }) => (
  <div className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Accessibility Options</h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Size</label>
        <div className="flex gap-3">
          {[
            { key: 'small', label: 'Small' },
            { key: 'medium', label: 'Medium' },
            { key: 'large', label: 'Large' },
            { key: 'extra-large', label: 'Extra Large' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => updateSettings('accessibility', { fontSize: key })}
              className={`px-4 py-2 rounded-xl transition-all ${
                settings.accessibility.fontSize === key
                  ? 'bg-aivo-gradient text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'highContrast', label: 'High Contrast', description: 'Increase color contrast for better visibility' },
          { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' },
          { key: 'voiceGuidance', label: 'Voice Guidance', description: 'Audio instructions and feedback' }
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h5 className="font-medium text-gray-900">{label}</h5>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessibility[key as keyof typeof settings.accessibility] as boolean}
                onChange={(e) => updateSettings('accessibility', { [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Parental Controls Component
const ParentalSettings: React.FC<{ settings: ChildSettingsData; updateSettings: any }> = ({ settings, updateSettings }) => (
  <div className="p-8">
    <h3 className="text-xl font-bold text-gray-900 mb-6">Parental Controls</h3>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Filter Level</label>
        <select
          value={settings.parentalControls.contentFilter}
          onChange={(e) => updateSettings('parentalControls', { contentFilter: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        >
          <option value="strict">Strict - Maximum filtering</option>
          <option value="moderate">Moderate - Balanced approach</option>
          <option value="relaxed">Relaxed - Minimal filtering</option>
        </select>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h5 className="font-medium text-amber-900">Time Restrictions</h5>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-800">Enable learning time restrictions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.parentalControls.timeRestrictions.enabled}
                onChange={(e) => updateSettings('parentalControls', {
                  timeRestrictions: { ...settings.parentalControls.timeRestrictions, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
          
          {settings.parentalControls.timeRestrictions.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-amber-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.parentalControls.timeRestrictions.startTime}
                  onChange={(e) => updateSettings('parentalControls', {
                    timeRestrictions: { ...settings.parentalControls.timeRestrictions, startTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.parentalControls.timeRestrictions.endTime}
                  onChange={(e) => updateSettings('parentalControls', {
                    timeRestrictions: { ...settings.parentalControls.timeRestrictions, endTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h5 className="font-medium text-gray-900 mb-3">Progress Sharing</h5>
        <div className="space-y-3">
          {[
            { key: 'withTeacher', label: 'Share with Teacher', description: 'Allow teacher access to learning progress' },
            { key: 'withFamily', label: 'Share with Family', description: 'Allow family members to view progress' },
            { key: 'publicAchievements', label: 'Public Achievements', description: 'Show achievements on public profile' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h6 className="text-sm font-medium text-gray-900">{label}</h6>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.parentalControls.progressSharing[key as keyof typeof settings.parentalControls.progressSharing]}
                  onChange={(e) => updateSettings('parentalControls', {
                    progressSharing: { ...settings.parentalControls.progressSharing, [key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-coral-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Users,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Key,
  Plus,
  X,
  Check,
  AlertTriangle,
  MessageCircle,
  UserPlus,
  Crown,
  Trash2,
  Edit3,
  Download
} from 'lucide-react';
import { Button } from '@aivo/ui';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  relationship: string;
  status: 'pending' | 'active' | 'inactive';
  permissions: string[];
  invitedAt: string;
  lastActive?: string;
}

interface NotificationSettings {
  achievements: boolean;
  progress: boolean;
  suggestions: boolean;
  messages: boolean;
  reminders: boolean;
  weeklyReports: boolean;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'caregivers' | 'notifications' | 'privacy' | 'account'>('profile');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', relationship: '', permissions: [] as string[] });
  
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      relationship: 'Mother',
      status: 'active',
      permissions: ['view_progress', 'receive_notifications', 'messaging'],
      invitedAt: '2024-09-15',
      lastActive: '2024-11-03'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      relationship: 'Father',
      status: 'pending',
      permissions: ['view_progress', 'receive_notifications'],
      invitedAt: '2024-10-28'
    },
    {
      id: '3',
      name: 'Grace Chen',
      email: 'grace.chen@email.com',
      relationship: 'Grandmother',
      status: 'active',
      permissions: ['view_progress'],
      invitedAt: '2024-10-01',
      lastActive: '2024-11-01'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    achievements: true,
    progress: true,
    suggestions: true,
    messages: true,
    reminders: false,
    weeklyReports: true,
  });

  const maxCaregivers = 3;
  const availableSlots = maxCaregivers - caregivers.length;

  const handleInviteCaregiver = () => {
    if (caregivers.length >= maxCaregivers) {
      alert('You can only invite up to 3 additional caregivers.');
      return;
    }

    const newCaregiver: Caregiver = {
      id: Date.now().toString(),
      name: inviteForm.name,
      email: inviteForm.email,
      relationship: inviteForm.relationship,
      status: 'pending',
      permissions: inviteForm.permissions,
      invitedAt: new Date().toISOString().split('T')[0],
    };

    setCaregivers([...caregivers, newCaregiver]);
    setInviteForm({ name: '', email: '', relationship: '', permissions: [] });
    setShowInviteModal(false);
  };

  const removeCaregiver = (id: string) => {
    setCaregivers(caregivers.filter(c => c.id !== id));
  };

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'caregivers', label: 'Family Access', icon: Users },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy & Security', icon: Shield },
    { key: 'account', label: 'Account', icon: SettingsIcon },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account, family access, and platform preferences
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
        {activeTab === 'profile' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah Chen"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="sarah.chen@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50">
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-aivo-gradient rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      SC
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline">
                        Upload New Picture
                      </Button>
                      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language Preference</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white/50">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => {
                  // Save profile changes
                  alert('Profile changes saved successfully!');
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  // Reset form or go back
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === 'caregivers' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Family Access Management</h3>
                <p className="text-gray-600 mt-1">
                  Invite up to 3 additional family members or caregivers to access your child's progress
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  {caregivers.length}/{maxCaregivers + 1} members
                </div>
                {availableSlots > 0 && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite Caregiver
                  </button>
                )}
              </div>
            </div>

            {/* Current User (Primary) */}
            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-coral-50 to-purple-50 rounded-xl border border-coral-200">
                <Crown className="w-5 h-5 text-coral-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Sarah Chen (You)</p>
                  <p className="text-sm text-gray-600">Primary Account Holder • Full Access</p>
                </div>
                <span className="px-3 py-1 bg-coral-100 text-coral-700 text-xs font-medium rounded-full">
                  Primary
                </span>
              </div>
            </div>

            {/* Caregivers List */}
            <div className="space-y-4">
              {caregivers.map((caregiver) => (
                <motion.div
                  key={caregiver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-aivo-gradient rounded-xl flex items-center justify-center text-white font-bold">
                    {caregiver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{caregiver.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        caregiver.status === 'active' ? 'bg-green-100 text-green-700' :
                        caregiver.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {caregiver.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {caregiver.relationship} • {caregiver.email}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Permissions: {caregiver.permissions.join(', ')}</span>
                      {caregiver.lastActive && (
                        <>
                          <span>•</span>
                          <span>Last active: {new Date(caregiver.lastActive).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeCaregiver(caregiver.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {availableSlots === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    You've reached the maximum of 3 additional caregivers. Remove a caregiver to invite someone new.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {key === 'achievements' && 'Get notified when your children earn achievements'}
                      {key === 'progress' && 'Receive updates about learning progress and milestones'}
                      {key === 'suggestions' && 'Get AI-powered learning recommendations'}
                      {key === 'messages' && 'Receive messages from teachers and the AIVO team'}
                      {key === 'reminders' && 'Get reminders for scheduled learning sessions'}
                      {key === 'weeklyReports' && 'Receive weekly progress summary reports'}
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateNotificationSetting(key as keyof NotificationSettings, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => {
                  alert('Notification preferences saved successfully!');
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Password & Authentication</h4>
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      alert('Password change form would open here. Please check your email for instructions.');
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-coral-200 text-coral-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-coral-50 hover:border-coral-300"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </button>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      onClick={() => {
                        alert('Two-Factor Authentication setup initiated. Please check your phone for verification code.');
                      }}
                      className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-purple-50 hover:border-purple-300"
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Data Privacy</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-900">Data Usage Analytics</h5>
                      <p className="text-sm text-gray-600">Help improve AIVO by sharing anonymous usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"></div>
                    </label>
                  </div>
                  
                  <button 
                    onClick={() => {
                      window.open('/privacy-policy', '_blank');
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
                  >
                    <Shield className="w-4 h-4" />
                    View Privacy Policy
                  </button>
                  
                  <button 
                    onClick={() => {
                      alert('Data export initiated. You will receive an email with download link within 24 hours.');
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Download className="w-4 h-4" />
                    Download My Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Management</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Subscription</h4>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-aivo-gradient rounded-xl flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-lg font-bold text-gray-900">AIVO Premium Family</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">Next billing: December 15, 2024</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">4</p>
                        <p className="text-xs text-gray-600">Children</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-coral-600">∞</p>
                        <p className="text-xs text-gray-600">AI Features</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-600">24/7</p>
                        <p className="text-xs text-gray-600">Support</p>
                      </div>
                    </div>
                    
                    <Link 
                      to="/billing"
                      className="inline-flex items-center gap-2 bg-white border-2 border-coral-200 text-coral-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-coral-50 hover:border-coral-300"
                    >
                      Manage Subscription
                    </Link>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h4>
                <div className="flex flex-wrap gap-3 justify-start">
                  <button 
                    onClick={() => {
                      alert('Account data export started. Download will begin shortly.');
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to deactivate your account? This action can be reversed within 30 days.')) {
                        alert('Account deactivation process initiated. You will receive a confirmation email.');
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-yellow-200 text-yellow-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-yellow-50 hover:border-yellow-300"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Deactivate
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?')) {
                        if (confirm('Final confirmation: Type "DELETE" to confirm account deletion')) {
                          alert('Account deletion initiated. You will receive a final confirmation email.');
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-white border-2 border-red-200 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Invite Family Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select
                  value={inviteForm.relationship}
                  onChange={(e) => setInviteForm({...inviteForm, relationship: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse/Partner">Spouse/Partner</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Other Family">Other Family</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-2">
                  {['view_progress', 'receive_notifications', 'messaging', 'settings_access'].map(permission => (
                    <label key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={inviteForm.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInviteForm({...inviteForm, permissions: [...inviteForm.permissions, permission]});
                          } else {
                            setInviteForm({...inviteForm, permissions: inviteForm.permissions.filter(p => p !== permission)});
                          }
                        }}
                        className="rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {permission.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleInviteCaregiver}
                disabled={!inviteForm.name || !inviteForm.email || !inviteForm.relationship}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
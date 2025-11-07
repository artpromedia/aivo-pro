import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Clock,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  GraduationCap,
  HeartHandshake,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@aivo/ui';

interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: 'family' | 'teacher' | 'therapist' | 'caregiver';
  permissions: string[];
  status: 'active' | 'pending' | 'expired';
  invitedDate: string;
  lastAccess?: string;
  childAccess: string[];
}

export const AccessManagement: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('all');
  
  const accessUsers: AccessUser[] = [
    {
      id: '1',
      name: 'Mrs. Sarah Johnson',
      email: 'sjohnson@school.edu',
      role: 'teacher',
      permissions: ['view_progress', 'add_comments', 'view_iep'],
      status: 'active',
      invitedDate: '2024-10-15',
      lastAccess: '2024-11-03',
      childAccess: ['emma-id'],
    },
    {
      id: '2',
      name: 'Grandma Mary',
      email: 'mary.family@gmail.com',
      role: 'family',
      permissions: ['view_progress', 'view_activities'],
      status: 'active',
      invitedDate: '2024-09-20',
      lastAccess: '2024-11-02',
      childAccess: ['emma-id', 'noah-id'],
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      email: 'mchen@therapy.com',
      role: 'therapist',
      permissions: ['view_progress', 'view_iep', 'add_notes'],
      status: 'pending',
      invitedDate: '2024-11-01',
      childAccess: ['emma-id'],
    },
    {
      id: '4',
      name: 'Lisa Rodriguez',
      email: 'lisa.r@caregiver.org',
      role: 'caregiver',
      permissions: ['view_progress', 'view_activities', 'emergency_contact'],
      status: 'active',
      invitedDate: '2024-10-01',
      lastAccess: '2024-11-01',
      childAccess: ['emma-id'],
    },
  ];

  const permissionOptions = [
    { value: 'view_progress', label: 'View Learning Progress', description: 'See academic performance and analytics' },
    { value: 'view_activities', label: 'View Activities', description: 'See daily learning activities and sessions' },
    { value: 'view_iep', label: 'View IEP/504 Information', description: 'Access special education documents' },
    { value: 'add_comments', label: 'Add Comments', description: 'Leave notes and feedback' },
    { value: 'add_notes', label: 'Add Clinical Notes', description: 'Add therapeutic observations' },
    { value: 'modify_goals', label: 'Modify Goals', description: 'Adjust learning objectives' },
    { value: 'emergency_contact', label: 'Emergency Contact', description: 'Access emergency information' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return GraduationCap;
      case 'family': return HeartHandshake;
      case 'therapist': return Stethoscope;
      case 'caregiver': return Users;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-600';
      case 'family': return 'bg-green-100 text-green-600';
      case 'therapist': return 'bg-purple-100 text-purple-600';
      case 'caregiver': return 'bg-coral-100 text-coral-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-coral-50 p-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/dashboard"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-coral-600" />
                <span className="text-sm font-medium text-coral-600">Access Control</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
                Team Access Management
              </h1>
              <p className="text-gray-600 mt-1">
                Control who can view and interact with your children's learning profiles
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: Users, 
              label: 'Total Users', 
              value: accessUsers.length.toString(),
              color: 'from-coral-400 to-coral-600'
            },
            { 
              icon: Shield, 
              label: 'Active Access', 
              value: accessUsers.filter(u => u.status === 'active').length.toString(),
              color: 'from-green-400 to-green-600'
            },
            { 
              icon: Clock, 
              label: 'Pending Invites', 
              value: accessUsers.filter(u => u.status === 'pending').length.toString(),
              color: 'from-yellow-400 to-orange-500'
            },
            { 
              icon: Mail, 
              label: 'Invite New User', 
              value: '',
              color: 'from-purple-400 to-purple-600',
              isButton: true
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20"
            >
              {stat.isButton ? (
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite User
                </button>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Filter by Child */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-6 border border-white/20">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Filter by Child Access
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Children', count: accessUsers.length },
              { key: 'emma-id', label: 'Emma', count: accessUsers.filter(u => u.childAccess.includes('emma-id')).length },
              { key: 'noah-id', label: 'Noah', count: accessUsers.filter(u => u.childAccess.includes('noah-id')).length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedChild === key
                    ? 'bg-aivo-gradient text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedChild(key)}
              >
                {label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedChild === key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Access List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {accessUsers
              .filter(user => selectedChild === 'all' || user.childAccess.includes(selectedChild))
              .map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <motion.div
                    key={user.id}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRoleColor(user.role)}`}>
                          <RoleIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-700' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {user.status}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 capitalize">
                              {user.role}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                          
                          {/* Permissions */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {user.permissions.map((perm) => (
                              <span key={perm} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                                {permissionOptions.find(p => p.value === perm)?.label}
                              </span>
                            ))}
                          </div>
                          
                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Invited: {new Date(user.invitedDate).toLocaleDateString()}</span>
                            {user.lastAccess && (
                              <span>Last access: {new Date(user.lastAccess).toLocaleDateString()}</span>
                            )}
                            <span>Access to: {user.childAccess.length} child{user.childAccess.length !== 1 ? 'ren' : ''}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-coral-600 hover:bg-coral-50 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
};

// Invite User Modal Component
const InviteUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'family',
    children: [] as string[],
    permissions: [] as string[],
    message: '',
  });

  const roleOptions = [
    { value: 'family', label: 'Family Member', description: 'Parent, grandparent, or family member', icon: HeartHandshake },
    { value: 'teacher', label: 'Teacher', description: 'Classroom teacher or instructor', icon: GraduationCap },
    { value: 'therapist', label: 'Therapist', description: 'Speech, occupational, or behavioral therapist', icon: Stethoscope },
    { value: 'caregiver', label: 'Caregiver', description: 'Babysitter, tutor, or care provider', icon: Users },
  ];

  const permissionsByRole = {
    family: ['view_progress', 'view_activities'],
    teacher: ['view_progress', 'add_comments', 'view_iep', 'modify_goals'],
    therapist: ['view_progress', 'view_iep', 'add_notes'],
    caregiver: ['view_progress', 'view_activities', 'emergency_contact'],
  };

  const handleRoleChange = (role: string) => {
    setInviteData({
      ...inviteData,
      role,
      permissions: permissionsByRole[role as keyof typeof permissionsByRole] || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
              Invite Team Member
            </h2>
            <p className="text-gray-600 mt-1">Add someone to help support your child's learning journey</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
              placeholder="Enter email address"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Role *
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <motion.label
                  key={option.value}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                    inviteData.role === option.value
                      ? 'border-coral-500 bg-coral-50'
                      : 'border-gray-200 hover:border-coral-300'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={inviteData.role === option.value}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      inviteData.role === option.value ? 'bg-coral-100 text-coral-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <option.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Children Access */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Grant Access To *
            </label>
            <div className="space-y-2">
              {['Emma Thompson', 'Noah Thompson'].map((child, index) => (
                <label key={child} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-coral-600 border-gray-300 rounded focus:ring-coral-500" 
                    checked={inviteData.children.includes(child)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInviteData({ ...inviteData, children: [...inviteData.children, child] });
                      } else {
                        setInviteData({ ...inviteData, children: inviteData.children.filter(c => c !== child) });
                      }
                    }}
                  />
                  <div className="w-8 h-8 bg-aivo-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {child.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{child}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Permissions ({inviteData.role} default)
            </label>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex flex-wrap gap-2">
                {inviteData.permissions.map((perm) => (
                  <span key={perm} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    {perm.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Permissions can be customized after sending the invitation
              </p>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
              rows={3}
              placeholder="Add a personal message to the invitation..."
              value={inviteData.message}
              onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-coral-50 border border-coral-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-coral-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-coral-800 mb-1">Privacy & Security</p>
                <p className="text-sm text-coral-700">
                  All access is logged and can be revoked at any time. Invited users will only see information you grant permission for.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
            >
              Cancel
            </button>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20">
              <Mail className="w-4 h-4" />
              Send Invitation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';
import { 
  Users, Search, Plus, Filter, MoreVertical, 
  Shield, Mail, Calendar, Activity, Eye, Edit, Trash2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'district_admin' | 'teacher' | 'student';
  district: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  created: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@district1.edu',
    role: 'district_admin',
    district: 'Springfield School District',
    status: 'active',
    lastLogin: '2 hours ago',
    created: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@district2.edu',
    role: 'teacher',
    district: 'Lincoln Elementary',
    status: 'active',
    lastLogin: '1 day ago',
    created: '2024-02-01'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@central.edu',
    role: 'super_admin',
    district: 'AIVO Platform',
    status: 'active',
    lastLogin: '5 minutes ago',
    created: '2023-12-01'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.davis@student.edu',
    role: 'student',
    district: 'Roosevelt High School',
    status: 'pending',
    lastLogin: 'Never',
    created: '2024-03-01'
  }
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'roles' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const toast = useToast();
  const { confirm } = useConfirmDialog();

  const tabs = [
    { id: 'overview', label: 'User Overview', icon: <Users className="w-4 h-4" /> },
    { id: 'users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Role Management', icon: <Shield className="w-4 h-4" /> },
    { id: 'analytics', label: 'User Analytics', icon: <Activity className="w-4 h-4" /> },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/20 text-red-400';
      case 'district_admin': return 'bg-blue-500/20 text-blue-400';
      case 'teacher': return 'bg-green-500/20 text-green-400';
      case 'student': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'inactive': return 'bg-gray-400';
      case 'pending': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    pending: mockUsers.filter(u => u.status === 'pending').length,
    districts: new Set(mockUsers.map(u => u.district)).size,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage platform users, roles, and permissions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
              const confirmed = await confirm({
                title: 'Add New User',
                description: 'Open the user creation wizard?',
                type: 'info'
              });
              if (confirmed) {
                toast.info('Add User', 'Opening user creation wizard...');
                // In real app, open add user modal
              }
            }}
            className="flex items-center gap-2 bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-coral-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
              </div>
              <p className="text-3xl font-bold text-white">{userStats.total}</p>
              <p className="text-gray-400 text-sm">Across all districts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Active Users</h3>
              </div>
              <p className="text-3xl font-bold text-white">{userStats.active}</p>
              <p className="text-gray-400 text-sm">{((userStats.active / userStats.total) * 100).toFixed(1)}% of total</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Pending</h3>
              </div>
              <p className="text-3xl font-bold text-white">{userStats.pending}</p>
              <p className="text-gray-400 text-sm">Awaiting activation</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Districts</h3>
              </div>
              <p className="text-3xl font-bold text-white">{userStats.districts}</p>
              <p className="text-gray-400 text-sm">Connected districts</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Add New User',
                    description: 'Create a new user account?',
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.success('User Creation', 'Opening new user form...');
                  }
                }}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors text-left"
              >
                <Plus className="w-5 h-5 text-coral-400 mb-2" />
                <h3 className="font-medium text-white">Add New User</h3>
                <p className="text-sm text-gray-400">Create a new user account</p>
              </button>
              
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Bulk User Invite',
                    description: 'Open the bulk invitation tool?',
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.info('Bulk Invite', 'Opening bulk invitation wizard...');
                  }
                }}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors text-left"
              >
                <Mail className="w-5 h-5 text-blue-400 mb-2" />
                <h3 className="font-medium text-white">Bulk Invite</h3>
                <p className="text-sm text-gray-400">Send invitations to multiple users</p>
              </button>
              
              <button 
                onClick={() => {
                  toast.info('Navigate to Role Management', 'Switching to role management interface...');
                  // In real app, navigate to role management
                }}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors text-left"
              >
                <Shield className="w-5 h-5 text-green-400 mb-2" />
                <h3 className="font-medium text-white">Manage Roles</h3>
                <p className="text-sm text-gray-400">Configure user permissions</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none"
              />
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="district_admin">District Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            
            <button 
              onClick={() => {
                toast.info('User Filters Applied', `Applied advanced filtering to ${filteredUsers.length} users`);
              }}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Users List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Users ({filteredUsers.length})</h2>
            </div>
            
            <div className="divide-y divide-gray-700">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-coral-500 to-salmon-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">{user.name}</h3>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">{user.district}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right text-sm">
                        <p className="text-gray-400">Last Login</p>
                        <p className="text-white">{user.lastLogin}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toast.info(`User Details: ${user.name}`, `Viewing profile for ${user.email}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info(`Edit User: ${user.name}`, 'Opening user editor...')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            const confirmed = await confirm({
                              title: `Delete User: ${user.name}`,
                              description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
                              type: 'danger'
                            });
                            if (confirmed) {
                              toast.success('User Deleted', `${user.name} has been successfully removed`);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toast.info(`More Actions: ${user.name}`, 'Opening additional options...')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'overview' && activeTab !== 'users' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h3>
          <p className="text-gray-400 mb-6">This section is under development.</p>
          <button 
            onClick={() => {
              const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label;
              toast.info('Configuration Settings', `Opening settings for ${activeTabLabel}...`);
            }}
            className="bg-coral-600 hover:bg-coral-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Configure Settings
          </button>
        </div>
      )}
    </div>
  );
}
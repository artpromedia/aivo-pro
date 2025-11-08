import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Key, 
  Plus,
  Search,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Download
} from 'lucide-react';
import RoleManagement from '../components/RoleManagement';
import UserManagement from '../components/UserManagement';
import PermissionMatrix from '../components/PermissionMatrix';
import RoleCreationWizard from '../components/RoleCreationWizard';
import { useToast } from '../components/ToastProvider';
import { useConfirmDialog } from '../components/ConfirmDialogProvider';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: 'platform' | 'content' | 'user' | 'analytics' | 'system';
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  permissions: string[];
  userCount: number;
  isActive: boolean;
  createdAt: string;
  lastModified: string;
  createdBy: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  district: string;
  position: string;
  createdAt: string;
  permissions: string[];
}

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress: string;
}

export default function RBACManagement() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'roles' | 'users' | 'permissions' | 'audit'>('overview');
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditEventFilter, setAuditEventFilter] = useState('all');
  const [showRoleCreationWizard, setShowRoleCreationWizard] = useState(false);
  const toast = useToast();
  const { confirm, alert } = useConfirmDialog();

  // Handler functions for role management
  const handleEditRole = async (role: Role) => {
    toast.info('Role Editor', `Opening editor for role: ${role.name}`);
    // In real app, this would open a role edit modal
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const confirmed = await confirm({
      title: 'Delete Role',
      description: `Are you sure you want to delete the role "${role.name}"?`,
      type: 'danger',
      details: [
        `Users with this role: ${role.userCount}`,
        `Permissions: ${role.permissions.length}`,
        'This action cannot be undone',
        'Users will lose all permissions from this role'
      ],
      confirmText: 'Delete Role'
    });

    if (confirmed) {
      toast.success('Role Deleted', `Role "${role.name}" has been successfully deleted.`);
    }
  };

  const handleCreateRole = () => {
    setShowRoleCreationWizard(true);
  };

  const handleRoleCreated = (roleData: any) => {
    setRoles(prev => [...prev, roleData]);
    toast.success('Role Created', `Role "${roleData.name}" has been successfully created.`);
  };

  const handleDuplicateRole = async (role: Role) => {
    const confirmed = await confirm({
      title: 'Duplicate Role',
      description: `Create a copy of role "${role.name}"?`,
      type: 'info',
      details: [
        'Creates a new role with the same permissions',
        'You can modify the copy after creation',
        'Original role remains unchanged'
      ],
      confirmText: 'Duplicate Role'
    });

    if (confirmed) {
      toast.success('Role Duplicated', `Created a copy of role "${role.name}".`);
    }
  };

  // Handler functions for user management
  const handleEditUser = async (user: User) => {
    toast.info('User Editor', `Opening editor for user: ${user.name}`);
    // In real app, this would open a user edit modal
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const confirmed = await confirm({
      title: 'Delete User',
      description: `Are you sure you want to delete user "${user.name}"?`,
      type: 'danger',
      details: [
        `Email: ${user.email}`,
        `Roles: ${user.roles.join(', ')}`,
        'This action cannot be undone',
        'User will lose access to the system'
      ],
      confirmText: 'Delete User'
    });

    if (confirmed) {
      toast.success('User Deleted', `User "${user.name}" has been successfully deleted.`);
    }
  };

  const handleCreateUser = () => {
    toast.info('Create User', 'Opening user creation modal...');
    // In real app, this would open a user creation modal
  };

  const handleViewUser = async (user: User) => {
    await alert('User Details', `Viewing details for ${user.name}`, 'info');
    // In real app, this would open a user details modal
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const confirmed = await confirm({
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} User`,
      description: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} user "${user.name}"?`,
      type: newStatus === 'active' ? 'success' : 'warning',
      details: [
        `Current status: ${user.status}`,
        `New status: ${newStatus}`,
        newStatus === 'active' ? 'User will regain system access' : 'User will lose system access'
      ],
      confirmText: newStatus === 'active' ? 'Activate' : 'Deactivate'
    });

    if (confirmed) {
      toast.success(
        'User Status Updated', 
        `User "${user.name}" has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
      );
    }
  };

  // Mock data - in real app this would come from API
  const [permissions] = useState<Permission[]>([
    {
      id: 'perm-1',
      name: 'View Dashboard',
      resource: 'dashboard',
      action: 'read',
      description: 'Access to main dashboard and analytics',
      category: 'analytics'
    },
    {
      id: 'perm-2',
      name: 'Manage Users',
      resource: 'users',
      action: 'write',
      description: 'Create, edit, and delete user accounts',
      category: 'user'
    },
    {
      id: 'perm-3',
      name: 'Manage Content',
      resource: 'content',
      action: 'write',
      description: 'Create and modify educational content',
      category: 'content'
    },
    {
      id: 'perm-4',
      name: 'View Reports',
      resource: 'reports',
      action: 'read',
      description: 'Access to performance and analytics reports',
      category: 'analytics'
    },
    {
      id: 'perm-5',
      name: 'System Configuration',
      resource: 'system',
      action: 'admin',
      description: 'Modify system settings and configurations',
      category: 'system'
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'role-1',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      type: 'system',
      permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5'],
      userCount: 3,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-11-01T14:30:00Z',
      createdBy: 'System'
    },
    {
      id: 'role-2',
      name: 'District Administrator',
      description: 'District-level management and oversight',
      type: 'system',
      permissions: ['perm-1', 'perm-2', 'perm-4'],
      userCount: 45,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-10-15T09:20:00Z',
      createdBy: 'System'
    },
    {
      id: 'role-3',
      name: 'School Principal',
      description: 'School-level administration and teacher management',
      type: 'system',
      permissions: ['perm-1', 'perm-4'],
      userCount: 156,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-09-22T16:45:00Z',
      createdBy: 'System'
    },
    {
      id: 'role-4',
      name: 'Teacher',
      description: 'Classroom instruction and student management',
      type: 'system',
      permissions: ['perm-1', 'perm-3'],
      userCount: 2847,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastModified: '2024-11-05T11:15:00Z',
      createdBy: 'System'
    },
    {
      id: 'role-5',
      name: 'Content Creator',
      description: 'Custom role for curriculum development team',
      type: 'custom',
      permissions: ['perm-1', 'perm-3', 'perm-4'],
      userCount: 12,
      isActive: true,
      createdAt: '2024-03-10T14:00:00Z',
      lastModified: '2024-10-28T13:20:00Z',
      createdBy: 'admin@aivo.com'
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@springfield.edu',
      roles: ['role-2'],
      status: 'active',
      lastLogin: '2024-11-07T09:30:00Z',
      district: 'Springfield School District',
      position: 'District Administrator',
      createdAt: '2024-02-01T10:00:00Z',
      permissions: ['perm-1', 'perm-2', 'perm-4']
    },
    {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@riverside.edu',
      roles: ['role-3'],
      status: 'active',
      lastLogin: '2024-11-07T08:15:00Z',
      district: 'Riverside School District',
      position: 'Principal',
      createdAt: '2024-02-15T14:30:00Z',
      permissions: ['perm-1', 'perm-4']
    },
    {
      id: 'user-3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@oakwood.edu',
      roles: ['role-4'],
      status: 'active',
      lastLogin: '2024-11-07T07:45:00Z',
      district: 'Oakwood Elementary',
      position: 'Grade 3 Teacher',
      createdAt: '2024-08-20T09:00:00Z',
      permissions: ['perm-1', 'perm-3']
    },
    {
      id: 'user-4',
      name: 'David Williams',
      email: 'david.williams@metro.edu',
      roles: ['role-5'],
      status: 'inactive',
      lastLogin: '2024-11-05T16:20:00Z',
      district: 'Metro Public Schools',
      position: 'Curriculum Developer',
      createdAt: '2024-03-15T11:30:00Z',
      permissions: ['perm-1', 'perm-3', 'perm-4']
    },
    {
      id: 'user-5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@highland.edu',
      roles: ['role-3'],
      status: 'suspended',
      lastLogin: '2024-11-01T13:10:00Z',
      district: 'Highland Middle School',
      position: 'Assistant Principal',
      createdAt: '2024-01-30T15:45:00Z',
      permissions: ['perm-1', 'perm-4']
    }
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'audit-1',
      action: 'Role Assignment',
      actor: 'admin@aivo.com',
      target: 'emily.rodriguez@oakwood.edu',
      timestamp: '2024-11-07T09:30:00Z',
      details: 'Assigned Teacher role to Emily Rodriguez',
      severity: 'low',
      ipAddress: '192.168.1.45'
    },
    {
      id: 'audit-2',
      action: 'Permission Modified',
      actor: 'super.admin@aivo.com',
      target: 'Content Creator Role',
      timestamp: '2024-11-07T08:15:00Z',
      details: 'Added View Reports permission to Content Creator role',
      severity: 'medium',
      ipAddress: '10.0.0.12'
    },
    {
      id: 'audit-3',
      action: 'User Suspended',
      actor: 'admin@aivo.com',
      target: 'lisa.thompson@highland.edu',
      timestamp: '2024-11-06T14:20:00Z',
      details: 'Suspended user due to policy violation',
      severity: 'high',
      ipAddress: '192.168.1.10'
    },
    {
      id: 'audit-4',
      action: 'Role Created',
      actor: 'super.admin@aivo.com',
      target: 'Data Analyst Role',
      timestamp: '2024-11-05T11:45:00Z',
      details: 'Created new custom role for analytics team',
      severity: 'medium',
      ipAddress: '10.0.0.12'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRoles = roles.length;
  const customRoles = roles.filter(r => r.type === 'custom').length;

  // Filter audit logs based on search and event type
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = auditSearchTerm === '' || 
      log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchTerm.toLowerCase());

    const matchesEvent = auditEventFilter === 'all' ||
      (auditEventFilter === 'login' && log.action.toLowerCase().includes('login')) ||
      (auditEventFilter === 'permission' && log.action.toLowerCase().includes('permission')) ||
      (auditEventFilter === 'role' && log.action.toLowerCase().includes('role')) ||
      (auditEventFilter === 'failed' && log.severity === 'high');

    return matchesSearch && matchesEvent;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'permissions', label: 'Permissions', icon: Key },
    { id: 'audit', label: 'Audit Trail', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-coral-500" />
                Role-Based Access Control
              </h1>
              <p className="text-gray-600 mt-2">
                Manage user permissions, roles, and access controls across the platform
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Export RBAC Report',
                    description: 'This will generate a comprehensive RBAC report. Continue?',
                    type: 'info'
                  });
                  if (confirmed) {
                    toast.success('RBAC report export initiated');
                    // In real app, trigger report generation
                  }
                  // Create and download a sample CSV file
                  const csvContent = "Role,Users,Permissions,Created\nAdmin,5,Full Access,2024-01-01\nTeacher,450,Education,2024-01-15";
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'rbac-report.csv';
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Create New Role',
                    description: 'Open the role creation wizard?',
                    type: 'info'
                  });
                  if (confirmed) {
                    setShowRoleCreationWizard(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Role
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">{activeUsers} active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
                <p className="text-sm text-purple-600">{customRoles} custom</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
                <p className="text-sm text-orange-600">5 categories</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Key className="h-6 w-6 text-orange-600" />
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
                <p className="text-sm font-medium text-gray-600">Audit Events</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
                <p className="text-sm text-red-600">2 high severity</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                    selectedTab === tab.id
                      ? 'text-coral-600 border-b-2 border-coral-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Role Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className={`h-4 w-4 ${role.type === 'system' ? 'text-blue-600' : 'text-purple-600'}`} />
                          <h4 className="font-medium text-gray-900">{role.name}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          role.type === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {role.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Users:</span>
                          <span className="font-medium text-gray-900">{role.userCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Permissions:</span>
                          <span className="font-medium text-gray-900">{role.permissions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                        {log.severity === 'critical' || log.severity === 'high' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()} • {log.actor}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Matrix Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix Overview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        {permissions.slice(0, 4).map((permission) => (
                          <th key={permission.id} className="text-center py-3 px-4 font-medium text-gray-900 text-sm">
                            {permission.name}
                          </th>
                        ))}
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {roles.slice(0, 4).map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Shield className={`h-4 w-4 ${role.type === 'system' ? 'text-blue-600' : 'text-purple-600'}`} />
                              <span className="font-medium text-gray-900">{role.name}</span>
                            </div>
                          </td>
                          {permissions.slice(0, 4).map((permission) => (
                            <td key={permission.id} className="py-3 px-4 text-center">
                              {role.permissions.includes(permission.id) ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto" />
                              )}
                            </td>
                          ))}
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => {
                                  toast.info(`Role details viewed: ${role.name}`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => {
                                  toast.info(`Role editor opened for: ${role.name}`);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RoleManagement
                roles={roles}
                permissions={permissions}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
                onCreateRole={handleCreateRole}
                onDuplicateRole={handleDuplicateRole}
              />
            </motion.div>
          )}

          {selectedTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <UserManagement
                users={users}
                roles={roles}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onCreateUser={handleCreateUser}
                onViewUser={handleViewUser}
                onToggleUserStatus={handleToggleUserStatus}
              />
            </motion.div>
          )}

          {/* Permissions Tab */}
          {selectedTab === 'permissions' && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PermissionMatrix
                permissions={permissions}
                roles={roles}
              />
            </motion.div>
          )}

          {/* Audit Tab */}
          {selectedTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Audit Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Total Events</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">1,247</p>
                  <p className="text-gray-400 text-sm">Last 30 days</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Successful</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">1,198</p>
                  <p className="text-gray-400 text-sm">96.1% success rate</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Failed Attempts</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">49</p>
                  <p className="text-gray-400 text-sm">Requires attention</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Risk Score</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">Low</p>
                  <p className="text-gray-400 text-sm">Security status</p>
                </div>
              </div>

              {/* Audit Filters */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search audit logs..."
                      value={auditSearchTerm}
                      onChange={(e) => setAuditSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-coral-500 focus:outline-none"
                    />
                  </div>
                  
                  <select 
                    value={auditEventFilter}
                    onChange={(e) => setAuditEventFilter(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2"
                  >
                    <option value="all">All Events</option>
                    <option value="login">Login/Logout</option>
                    <option value="permission">Permission Changes</option>
                    <option value="role">Role Assignments</option>
                    <option value="failed">Failed Attempts</option>
                  </select>
                  
                  <select className="bg-gray-700 border border-gray-600 rounded-lg text-white px-3 py-2">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Custom Range</option>
                  </select>
                  
                  <button 
                    onClick={async () => {
                      const confirmed = await confirm({
                        title: 'Export Audit Logs',
                        description: 'This will download the complete audit log history. Continue?',
                        type: 'info'
                      });
                      if (confirmed) {
                        toast.success('Audit logs export initiated');
                        // In real app, trigger log export
                      }
                      const csvContent = "Event,User,Timestamp,Details\nRole Assignment,john.smith@district1.edu,2024-03-20 14:30:15,Assigned District Admin role\nPermission Modified,mike.wilson@central.edu,2024-03-20 14:25:42,Updated user management permissions";
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'audit-logs.csv';
                      a.click();
                    }}
                    className="bg-coral-600 hover:bg-coral-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Audit Log */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Audit Trail</h2>
                  <p className="text-gray-400">Comprehensive log of all security and access events</p>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No audit logs found</h3>
                        <p>Try adjusting your search terms or filters</p>
                      </div>
                    </div>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <div key={log.id} className="p-6 flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          log.severity === 'low' ? 'bg-green-400' :
                          log.severity === 'medium' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`} />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-white">{log.action}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              log.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                              log.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {log.severity}
                            </span>
                            <span className="text-xs text-gray-500">#{log.id}</span>
                          </div>
                          
                          <p className="text-gray-300 mb-2">{log.details}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span>User: {log.actor}</span>
                            <span>Target: {log.target}</span>
                            <span>IP: {log.ipAddress}</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => toast.info(`Viewing audit log details: ${log.id}`)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              const logData = `Event: ${log.action}\nUser: ${log.actor}\nTarget: ${log.target}\nTimestamp: ${log.timestamp}\nDetails: ${log.details}\nIP: ${log.ipAddress}`;
                              const blob = new Blob([logData], { type: 'text/plain' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `audit-log-${log.id}.txt`;
                              a.click();
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">Showing {filteredAuditLogs.length} of {auditLogs.length} audit entries</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toast.info('Navigating to previous page')}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-gray-400 text-sm">Page 1 of 1</span>
                    <button 
                      onClick={() => toast.info('Navigating to next page')}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role Creation Wizard */}
      <RoleCreationWizard
        isOpen={showRoleCreationWizard}
        onClose={() => setShowRoleCreationWizard(false)}
        permissions={permissions}
        onCreateRole={handleRoleCreated}
      />
    </div>
  );
}
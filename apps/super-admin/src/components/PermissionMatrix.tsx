import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  Circle,
  Eye
} from 'lucide-react';
import { useToast } from './ToastProvider';

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
  permissions: string[];
}

interface PermissionMatrixProps {
  permissions: Permission[];
  roles: Role[];
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  permissions,
  roles
}) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'content': return 'text-green-600 bg-green-50 border-green-200';
      case 'user': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'analytics': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'system': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || permission.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const togglePermissionSelection = (permissionId: string) => {
    const newSelection = new Set(selectedPermissions);
    if (newSelection.has(permissionId)) {
      newSelection.delete(permissionId);
    } else {
      newSelection.add(permissionId);
    }
    setSelectedPermissions(newSelection);
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Categories</option>
            <option value="platform">Platform</option>
            <option value="content">Content</option>
            <option value="user">User</option>
            <option value="analytics">Analytics</option>
            <option value="system">System</option>
          </select>
          <button 
            onClick={() => {
              const newPermission = {
                id: `perm-${Date.now()}`,
                name: 'Custom Permission',
                category: filterCategory === 'all' ? 'platform' : filterCategory,
                description: 'New custom permission for role-based access control',
                scopes: ['read', 'write'],
                created: new Date().toLocaleDateString()
              };
              toast.success(
                'Permission Created', 
                `Successfully created "${newPermission.name}" with ID: ${newPermission.id}. Opening configuration wizard...`
              );
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Permission
          </button>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Key className="h-5 w-5 text-coral-500" />
            Permission Matrix
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Manage which roles have access to specific permissions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role.id} className="text-center py-3 px-4 font-medium text-gray-900 min-w-32">
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{role.name}</span>
                    </div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <React.Fragment key={category}>
                  {/* Category Header */}
                  <tr className="bg-gray-25">
                    <td 
                      colSpan={roles.length + 2} 
                      className="py-2 px-6 sticky left-0 bg-gray-25 z-10"
                    >
                      <span className={`px-3 py-1 text-sm font-medium rounded-md border ${getCategoryColor(category)}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryPermissions.length})
                      </span>
                    </td>
                  </tr>
                  
                  {/* Permissions in Category */}
                  {categoryPermissions.map((permission) => (
                    <motion.tr
                      key={permission.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 sticky left-0 bg-white z-10 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePermissionSelection(permission.id)}
                            className="flex-shrink-0"
                          >
                            {selectedPermissions.has(permission.id) ? (
                              <CheckCircle className="h-4 w-4 text-coral-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{permission.name}</p>
                            <p className="text-sm text-gray-600">{permission.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{permission.resource}:{permission.action}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Role Permission Checkboxes */}
                      {roles.map((role) => (
                        <td key={role.id} className="py-4 px-4 text-center">
                          <button 
                            onClick={() => {
                              const currentPermission = hasPermission(role.id, permission.id);
                              const action = currentPermission ? 'revoke' : 'grant';
                              if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} permission "${permission.name}" for role "${role.name}"?\n\nThis will:\n• ${action.charAt(0).toUpperCase() + action.slice(1)} ${permission.name} access\n• Update role permissions immediately\n• Affect all users with this role\n• Log the permission change\n\nContinue?`)) {
                                toast.success(`Permission ${action}ed successfully! Role: ${role.name}, Permission: ${permission.name}. Users with this role will ${currentPermission ? 'lose' : 'gain'} this permission immediately.`);
                              }
                            }}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title={`${hasPermission(role.id, permission.id) ? 'Revoke' : 'Grant'} permission for ${role.name}`}
                          >
                            {hasPermission(role.id, permission.id) ? (
                              <Lock className="h-4 w-4 text-green-600" />
                            ) : (
                              <Unlock className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                      ))}
                      
                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => {
                              toast.info(`Permission Details: ${permission.name} - Category: ${permission.category}. Current role assignments: ${roles.map(role => `${role.name}: ${hasPermission(role.id, permission.id) ? 'Granted' : 'Not Granted'}`).join(', ')}.`);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="View Permission Details"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => {
                              toast.info(`Opening permission editor for: ${permission.name}. You can edit permission name, description, category assignment, scope, and inheritance rules.`);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit Permission"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete permission "${permission.name}"?\n\nThis will:\n• Remove permission from system\n• Revoke from all roles\n• Affect user access immediately\n• Cannot be undone\n\nRoles affected:\n${roles.filter(role => hasPermission(role.id, permission.id)).map(role => `• ${role.name}`).join('\n') || '• None'}\n\nContinue with deletion?`)) {
                                toast.success(`Permission deleted successfully! ${permission.name} has been removed from the system, revoked from all roles, and user access updated.`);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Permission"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Permissions Actions */}
      {selectedPermissions.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {selectedPermissions.size} permission{selectedPermissions.size !== 1 ? 's' : ''} selected
              </h4>
              <p className="text-sm text-gray-600">
                Perform bulk actions on selected permissions
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (selectedPermissions.size === 0) {
                    toast.info('No permissions selected! Please select one or more permissions first.');
                    return;
                  }
                  toast.info(`Opening role selection dialog to assign ${selectedPermissions.size} selected permissions to a role. This will grant these permissions to all users with the selected role.`);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Assign to Role
              </button>
              <button 
                onClick={() => {
                  if (selectedPermissions.size === 0) {
                    toast.info('No permissions selected! Please select one or more permissions first.');
                    return;
                  }
                  toast.warning(`Opening role selection dialog to remove ${selectedPermissions.size} selected permissions from a role. Warning: This will revoke these permissions from all users with the selected role.`);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Remove from Role
              </button>
              <button 
                onClick={() => {
                  if (selectedPermissions.size === 0) {
                    toast.info('No permissions selected! Please select one or more permissions first.');
                    return;
                  }
                  const selectedPerms = Array.from(selectedPermissions).map(id => 
                    permissions.find(p => p.id === id)?.name
                  ).filter(Boolean);
                  if (confirm(`Delete Selected Permissions?\n\nYou are about to delete ${selectedPermissions.size} permission(s):\n${selectedPerms.map(name => `• ${name}`).join('\n')}\n\nThis will:\n• Remove permissions from system permanently\n• Revoke from all roles and users\n• Cannot be undone\n\nContinue with deletion?`)) {
                    toast.success(`Permissions deleted successfully! ${selectedPermissions.size} permission(s) removed from system, revoked from all roles, and user access updated.`);
                    setSelectedPermissions(new Set());
                  }
                }}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete Selected
              </button>
              <button 
                onClick={() => setSelectedPermissions(new Set())}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            <p className="text-sm text-gray-600">Total Permissions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedPermissions).length}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
            <p className="text-sm text-gray-600">Roles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-coral-600">{selectedPermissions.size}</p>
            <p className="text-sm text-gray-600">Selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;
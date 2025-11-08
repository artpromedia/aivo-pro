import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Key, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  CheckCircle,
  Copy
} from 'lucide-react';

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

interface RoleManagementProps {
  roles: Role[];
  permissions: Permission[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onCreateRole: () => void;
  onDuplicateRole: (role: Role) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  permissions,
  onEditRole,
  onDeleteRole,
  onCreateRole,
  onDuplicateRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const getPermissionName = (permissionId: string) => {
    return permissions.find(p => p.id === permissionId)?.name || 'Unknown Permission';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform': return 'text-purple-600 bg-purple-50';
      case 'content': return 'text-green-600 bg-green-50';
      case 'user': return 'text-blue-600 bg-blue-50';
      case 'analytics': return 'text-orange-600 bg-orange-50';
      case 'system': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || role.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && role.isActive) ||
                         (filterStatus === 'inactive' && !role.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

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
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Types</option>
            <option value="system">System Roles</option>
            <option value="custom">Custom Roles</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={onCreateRole}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Role Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className={`h-5 w-5 ${role.type === 'system' ? 'text-blue-600' : 'text-purple-600'}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      role.type === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {role.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      role.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{role.userCount} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Key className="h-4 w-4" />
                      <span>{role.permissions.length} permissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicateRole(role)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Duplicate Role"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditRole(role)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Edit Role"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {role.type === 'custom' && (
                    <button
                      onClick={() => onDeleteRole(role.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete Role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions Preview */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Permissions</h4>
                <button
                  onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                  className="text-sm text-coral-600 hover:text-coral-700 font-medium"
                >
                  {expandedRole === role.id ? 'Show Less' : 'Show All'}
                </button>
              </div>

              {expandedRole === role.id ? (
                // Expanded view - grouped by category
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                    const rolePermissions = categoryPermissions.filter(p => role.permissions.includes(p.id));
                    if (rolePermissions.length === 0) return null;

                    return (
                      <div key={category}>
                        <h5 className={`text-sm font-medium mb-2 px-2 py-1 rounded-md ${getCategoryColor(category)}`}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h5>
                        <div className="space-y-1 pl-4">
                          {rolePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-gray-900">{permission.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Collapsed view - show first few permissions
                <div className="space-y-2">
                  {role.permissions.slice(0, 3).map((permissionId) => (
                    <div key={permissionId} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-gray-900">{getPermissionName(permissionId)}</span>
                    </div>
                  ))}
                  {role.permissions.length > 3 && (
                    <div className="text-sm text-gray-500 pl-5">
                      +{role.permissions.length - 3} more permissions
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                <span>Modified: {new Date(role.lastModified).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-600 mb-6">No roles match your current search and filter criteria.</p>
          <button
            onClick={onCreateRole}
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Your First Role
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
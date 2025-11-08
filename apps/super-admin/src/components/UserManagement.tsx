import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Eye,
  Mail,
  Building,
  Clock,
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';
import { useToast } from './ToastProvider';

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
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

interface UserManagementProps {
  users: User[];
  roles: Role[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: () => void;
  onViewUser: (user: User) => void;
  onToggleUserStatus: (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  roles,
  onEditUser,
  onDeleteUser,
  onCreateUser,
  onViewUser,
  onToggleUserStatus
}) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'lastLogin' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || 'Unknown Role';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'suspended': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'suspended': return <UserX className="h-4 w-4 text-red-600" />;
      default: return <UserX className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];
      
      if (sortBy === 'lastLogin' || sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, district, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>
          <button
            onClick={onCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as typeof sortBy);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
            <option value="lastLogin-desc">Last Login (Recent)</option>
            <option value="lastLogin-asc">Last Login (Oldest)</option>
            <option value="createdAt-desc">Created (Newest)</option>
            <option value="createdAt-asc">Created (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="text-left py-3 px-6 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    User
                    {sortBy === 'name' && (
                      <span className="text-coral-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Roles</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th 
                  className="text-left py-3 px-6 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center gap-1">
                    Last Login
                    {sortBy === 'lastLogin' && (
                      <span className="text-coral-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">District</th>
                <th className="text-right py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <p className="text-sm text-gray-500">{user.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.slice(0, 2).map((roleId) => (
                        <span
                          key={roleId}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {getRoleName(roleId)}
                        </span>
                      ))}
                      {user.roles.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{user.roles.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(user.lastLogin).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Building className="h-3 w-3 text-gray-400" />
                      {user.district}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewUser(user)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative group">
                        <button 
                          onClick={() => {
                            toast.info(`User options available for ${user.name}: View profile, edit information, manage permissions, reset password, view activity logs, suspend/activate account, delete account, and export data.`);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="User Actions Menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => onToggleUserStatus(user.id, 'suspended')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Suspend User
                              </button>
                            ) : user.status === 'suspended' ? (
                              <button
                                onClick={() => onToggleUserStatus(user.id, 'active')}
                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                Activate User
                              </button>
                            ) : (
                              <button
                                onClick={() => onToggleUserStatus(user.id, 'active')}
                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                Activate User
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteUser(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">No users match your current search and filter criteria.</p>
          <button
            onClick={onCreateUser}
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First User
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedUsers.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredAndSortedUsers.filter(u => u.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredAndSortedUsers.filter(u => u.status === 'suspended').length}
              </p>
              <p className="text-sm text-gray-600">Suspended</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
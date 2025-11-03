import { useAuth } from './useAuth';
import { UserRole } from '../types/auth.types';

export interface PermissionsHookReturn {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccessResource: (resource: string, action: string) => boolean;
  permissions: string[];
  role: UserRole | null;
}

export function usePermissions(): PermissionsHookReturn {
  const { user, session, hasPermission, hasRole } = useAuth();

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const canAccessResource = (resource: string, action: string): boolean => {
    const permission = `${action}_${resource}`;
    return hasPermission(permission);
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
    canAccessResource,
    permissions: session?.permissions || [],
    role: user?.role || null,
  };
}
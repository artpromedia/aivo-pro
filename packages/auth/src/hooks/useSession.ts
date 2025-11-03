import { useAuth } from './useAuth';
import { sessionService } from '../services/sessionService';

export const useSession = () => {
  const { session, user, isAuthenticated } = useAuth();

  const hasPermission = (permission: string): boolean => {
    return sessionService.hasPermission(session, permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return sessionService.hasAnyPermission(session, permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return sessionService.hasAllPermissions(session, permissions);
  };

  const isRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const getTimeUntilExpiry = (): number => {
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  };

  const isSessionExpiring = (thresholdMinutes: number = 5): boolean => {
    const timeLeft = getTimeUntilExpiry();
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeLeft > 0 && timeLeft < thresholdMs;
  };

  return {
    session,
    user,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    hasAnyRole,
    getTimeUntilExpiry,
    isSessionExpiring,
  };
};
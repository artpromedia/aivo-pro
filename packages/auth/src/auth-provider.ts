import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session, LoginRequest, SignupRequest, UserRole } from './types/auth.types';
import { AuthContext, AuthContextType } from './providers/AuthContext';
import { authService } from './services/authService';
import { sessionService } from './services/sessionService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          const newSession: Session = {
            user: currentUser,
            tokens: {
              accessToken: authService.getAccessToken() || '',
              refreshToken: authService.getRefreshToken() || '',
              expiresIn: 3600,
              tokenType: 'Bearer',
            },
            permissions: getPermissionsForRole(currentUser.role),
            expiresAt: Date.now() + 3600000,
            lastActivity: Date.now(),
          };
          
          setUser(currentUser);
          setSession(newSession);
          sessionService.setSession(newSession);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        await authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for session expiry
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setSession(null);
      setError('Your session has expired. Please log in again.');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sessionExpired', handleSessionExpired);
      
      return () => {
        window.removeEventListener('sessionExpired', handleSessionExpired);
      };
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(credentials);
      
      if (response.requiresMFA) {
        throw new Error('MFA_REQUIRED');
      }

      const newSession: Session = {
        user: response.user,
        tokens: response.tokens,
        permissions: getPermissionsForRole(response.user.role),
        expiresAt: Date.now() + response.tokens.expiresIn * 1000,
        lastActivity: Date.now(),
      };

      setUser(response.user);
      setSession(newSession);
      sessionService.setSession(newSession);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.signup(data);
      console.log('AuthProvider signup response:', response);
      
      // If user needs email verification, don't set them as logged in
      if (response.user && !response.user.emailVerified) {
        setError(`Account created! Please check your email (${data.email}) and click the verification link to complete registration.`);
        return;
      }
      
      // If signup includes immediate login (tokens provided)
      if (response.tokens?.accessToken) {
        const newSession: Session = {
          user: response.user,
          tokens: response.tokens,
          permissions: getPermissionsForRole(response.user.role),
          expiresAt: Date.now() + response.tokens.expiresIn * 1000,
          lastActivity: Date.now(),
        };

        setUser(response.user);
        setSession(newSession);
        sessionService.setSession(newSession);
      } else if (response.user_id && !response.verification_required) {
        // Handle development mode where signup succeeds but doesn't return tokens
        // We need to login the user automatically
        try {
          const loginResponse = await authService.login({
            email: data.email,
            password: data.password,
          });
          
          if (loginResponse.tokens?.accessToken) {
            const newSession: Session = {
              user: loginResponse.user,
              tokens: loginResponse.tokens,
              permissions: getPermissionsForRole(loginResponse.user.role),
              expiresAt: Date.now() + loginResponse.tokens.expiresIn * 1000,
              lastActivity: Date.now(),
            };

            setUser(loginResponse.user);
            setSession(newSession);
            sessionService.setSession(newSession);
          }
        } catch (loginError) {
          console.error('Auto-login after signup failed:', loginError);
          setError('Account created successfully! Please login with your credentials.');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSession(null);
      sessionService.clearSession();
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const tokens = await authService.refreshAccessToken();
      
      if (session) {
        const updatedSession = {
          ...session,
          tokens,
          expiresAt: Date.now() + tokens.expiresIn * 1000,
          lastActivity: Date.now(),
        };
        
        setSession(updatedSession);
        sessionService.setSession(updatedSession);
      }
    } catch (error) {
      await logout();
    }
  }, [session, logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!session) return false;
    return session.permissions.includes(permission) || session.permissions.includes('*');
  }, [session]);

  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    setLoading(true);

    try {
      await authService.resetPasswordRequest(email);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to request password reset';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      await authService.resetPasswordConfirm(token, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshSession,
    clearError,
    hasPermission,
    hasRole,
    requestPasswordReset,
    resetPassword,
  };

  // Debug logging
  console.log('AuthProvider state:', {
    user: !!user,
    session: !!session,
    loading,
    error,
    isAuthenticated: !!user,
    userDetails: user ? { id: user.id, email: user.email } : null
  });

  return React.createElement(AuthContext.Provider, { value }, children);
};

// Helper function to get permissions based on role
function getPermissionsForRole(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    [UserRole.PARENT]: ['view_children', 'add_child', 'view_progress', 'manage_subscription'],
    [UserRole.TEACHER]: ['view_students', 'manage_iep', 'view_analytics', 'approve_suggestions'],
    [UserRole.DISTRICT_ADMIN]: ['view_district', 'manage_licenses', 'view_all_schools', 'generate_reports'],
    [UserRole.SYSTEM_ADMIN]: ['*'],
    [UserRole.STUDENT]: ['view_lessons', 'submit_homework', 'play_games'],
  };

  return permissions[role] || [];
}
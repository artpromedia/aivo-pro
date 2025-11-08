// Main exports
export { AuthProvider } from './auth-provider';
export { useAuth } from './hooks/useAuth';

// Component exports
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { PasswordReset } from './components/PasswordReset';
export { MFASetup } from './components/MFASetup';
export { MFAVerification } from './components/MFAVerification';
export { AuthContainer } from './components/AuthContainer';
export { ProtectedRoute } from './components/ProtectedRoute';

// Advanced Authentication Components
export { BiometricAuth } from './components/BiometricAuth';
export { MFAComponent } from './components/MFAComponent';
export { SSOComponent, SSOCallback } from './components/SSOComponent';

// Type exports
export * from './types/auth.types';

// Service exports
export { authService } from './services/authService';
export { tokenService } from './services/tokenService';
export { mfaService } from './services/mfaService';
export { sessionService } from './services/sessionService';

// Hook exports
export * from './hooks/useMFA';
export * from './hooks/usePermissions';
export * from './hooks/useSession';

// Advanced Hooks (with specific exports to avoid conflicts)
export { useBiometric } from './advanced-hooks';

// Context exports
export { AuthContext } from './providers/AuthContext';
export type { AuthContextType } from './providers/AuthContext';

// Advanced Authentication Exports
export * from './biometric';
export * from './mfa';
export * from './sso';
export { SSOProviders } from './sso';
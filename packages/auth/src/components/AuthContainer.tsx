import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PasswordReset } from './PasswordReset';

type AuthView = 'login' | 'signup' | 'reset-password';

interface AuthContainerProps {
  initialView?: AuthView;
  onSuccess?: () => void;
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialView = 'login',
  onSuccess,
  className = '',
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);
  const [resetToken, setResetToken] = useState<string | undefined>();

  const handleSuccess = () => {
    onSuccess?.();
  };

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
    setResetToken(undefined);
  };

  const handleForgotPassword = () => {
    setCurrentView('reset-password');
  };

  const handleMFARequired = (tempToken: string) => {
    // Handle MFA flow - for now, just log it
    console.log('MFA Required:', tempToken);
    // In a real app, you would show MFA verification component
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onMFARequired={handleMFARequired}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSwitchToSignup}
            className={className}
          />
        );

      case 'signup':
        return (
          <div className="space-y-6">
            <SignupForm
              onSuccess={handleSuccess}
              className={className}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        );

      case 'reset-password':
        return (
          <PasswordReset
            resetToken={resetToken}
            onSuccess={handleSwitchToLogin}
            onBack={handleSwitchToLogin}
            className={className}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {renderCurrentView()}
    </div>
  );
};
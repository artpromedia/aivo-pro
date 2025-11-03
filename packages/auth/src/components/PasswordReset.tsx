import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Mail, ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetData = z.infer<typeof requestResetSchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface PasswordResetProps {
  resetToken?: string;
  onSuccess?: () => void;
  onBack?: () => void;
  className?: string;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  resetToken,
  onSuccess,
  onBack,
  className = '',
}) => {
  const { requestPasswordReset, resetPassword, loading, error, clearError } = useAuth();
  const [step, setStep] = useState<'request' | 'reset' | 'success'>(
    resetToken ? 'reset' : 'request'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors },
    setError: setRequestError,
  } = useForm<RequestResetData>({
    resolver: zodResolver(requestResetSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    setError: setResetError,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: resetToken || '',
    },
  });

  const onRequestReset = async (data: RequestResetData) => {
    clearError();

    try {
      await requestPasswordReset(data.email);
      setEmailSent(data.email);
      setStep('success');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setRequestError('email', {
          message: 'No account found with this email address',
        });
      } else {
        setRequestError('root', {
          message: error.response?.data?.message || 'Failed to send reset email',
        });
      }
    }
  };

  const onResetPassword = async (data: ResetPasswordData) => {
    clearError();

    try {
      await resetPassword(data.token, data.password);
      setStep('success');
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setResetError('token', {
          message: 'Invalid or expired reset token',
        });
      } else {
        setResetError('root', {
          message: error.response?.data?.message || 'Failed to reset password',
        });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'request':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">
                Enter your email and we'll send you a link to reset your password
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestSubmit(onRequestReset)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    {...registerRequest('email')}
                    type="email"
                    placeholder="Enter your email address"
                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                    autoComplete="email"
                  />
                </div>
                {requestErrors.email && (
                  <p className="text-sm text-red-600">{requestErrors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Send Reset Link
              </Button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </button>
              )}
            </form>
          </div>
        );

      case 'reset':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-600">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-6">
              {!resetToken && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Reset Token</label>
                  <input
                    {...registerReset('token')}
                    type="text"
                    placeholder="Enter reset token from email"
                    className="block w-full px-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                  />
                  {resetErrors.token && (
                    <p className="text-sm text-red-600">{resetErrors.token.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    {...registerReset('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {resetErrors.password && (
                  <p className="text-sm text-red-600">{resetErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    {...registerReset('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {resetErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resetToken ? 'Password Reset!' : 'Check Your Email'}
              </h1>
              <p className="text-gray-600">
                {resetToken
                  ? 'Your password has been successfully reset. You can now sign in with your new password.'
                  : `We've sent a password reset link to ${emailSent}. Click the link in the email to reset your password.`
                }
              </p>
            </div>

            {resetToken ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onSuccess?.()}
                className="w-full"
              >
                Continue to Login
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setStep('request')}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            )}

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {renderStep()}
    </div>
  );
};
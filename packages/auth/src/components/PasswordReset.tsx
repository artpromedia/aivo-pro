import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Mail, ArrowLeft, Eye, EyeOff, Lock, CheckCircle, Brain, ArrowRight } from 'lucide-react';

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
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-300/30 animate-pulse">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Reset Password
              </h1>
              <p className="text-gray-600 text-lg">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 shadow-sm">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRequestSubmit(onRequestReset)} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    {...registerRequest('email')}
                    type="email"
                    placeholder="your.email@example.com"
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                      requestErrors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                    }`}
                    autoComplete="email"
                  />
                </div>
                {requestErrors.email && (
                  <p className="text-sm text-red-600 font-medium">{requestErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/30 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center shadow-lg shadow-purple-200/50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center w-full text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-300/30 animate-pulse">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                New Password
              </h1>
              <p className="text-gray-600 text-lg">
                Enter your new secure password below
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

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    {...registerReset('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                      resetErrors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-purple-50 rounded-r-2xl transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-purple-500 hover:text-purple-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-purple-500 hover:text-purple-700" />
                    )}
                  </button>
                </div>
                {resetErrors.password && (
                  <p className="text-sm text-red-600 font-medium">{resetErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    {...registerReset('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                      resetErrors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-purple-50 rounded-r-2xl transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-purple-500 hover:text-purple-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-purple-500 hover:text-purple-700" />
                    )}
                  </button>
                </div>
                {resetErrors.confirmPassword && (
                  <p className="text-sm text-red-600 font-medium">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/30 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center shadow-lg shadow-purple-200/50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </button>
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
              <button
                onClick={() => onSuccess?.()}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/30 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 shadow-lg shadow-purple-200/50 flex items-center justify-center"
              >
                Continue to Login
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setStep('request')}
                  className="w-full border-2 border-purple-500 text-purple-600 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  Try Again
                </button>
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
    <div className={`w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-200/50 p-8 border border-white/20 ${className}`}>
      {renderStep()}
    </div>
  );
};
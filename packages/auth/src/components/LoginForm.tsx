import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Phone, Lock, Brain, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onMFARequired?: (tempToken: string) => void;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onMFARequired,
  onSuccess,
  onForgotPassword,
  onSignUp,
  className = '',
}) => {
  const { login, error, clearError, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();

    try {
      const credentials = {
        [loginMethod]: data.identifier,
        password: data.password,
      };

      await login(credentials);
      onSuccess?.();
    } catch (error: any) {
      if (error.message === 'MFA_REQUIRED' && error.tempToken) {
        onMFARequired?.(error.tempToken);
      } else {
        setFormError('root', {
          message: error.response?.data?.message || 'Invalid credentials',
        });
      }
    }
  };

  return (
    <div className={`w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-200/50 p-8 border border-white/20 ${className}`}>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-300/30 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Welcome to AIVO
        </h1>
        <p className="text-gray-600 text-lg">Sign in to access your learning platform</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Login Method Toggle */}
        <div className="flex rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-medium ${
              loginMethod === 'email'
                ? 'bg-white text-purple-600 shadow-md shadow-purple-100 scale-105'
                : 'text-gray-600 hover:text-purple-500'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-3 rounded-xl transition-all duration-200 flex items-center justify-center font-medium ${
              loginMethod === 'phone'
                ? 'bg-white text-purple-600 shadow-md shadow-purple-100 scale-105'
                : 'text-gray-600 hover:text-purple-500'
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            Phone
          </button>
        </div>

        {/* Email/Phone Input */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-800">
            {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {loginMethod === 'email' ? 
                <Mail className="w-5 h-5 text-purple-400" /> : 
                <Phone className="w-5 h-5 text-purple-400" />
              }
            </div>
            <input
              {...register('identifier')}
              type={loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={loginMethod === 'email' ? 'your.email@example.com' : '+1 (555) 123-4567'}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                errors.identifier 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
              }`}
              autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
            />
          </div>
          {errors.identifier && (
            <p className="text-sm text-red-600 font-medium">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-800">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
              }`}
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between py-2">
          <label className="flex items-center cursor-pointer">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-2"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Remember me</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/30 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center shadow-lg shadow-purple-200/50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-3 h-5 w-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200" />
          </div>
          <div className="relative flex justify-center text-base">
            <span className="px-6 bg-white text-gray-500 font-medium">or</span>
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="button"
          onClick={onSignUp}
          className="w-full border-2 border-purple-500 text-purple-600 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          Create New Account
        </button>
      </form>
    </div>
  );
};
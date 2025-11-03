import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onMFARequired?: (tempToken: string) => void;
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onMFARequired,
  onSuccess,
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
    <div className={`w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Sign in to continue to AIVO Learning</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Login Method Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center ${
              loginMethod === 'email'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center ${
              loginMethod === 'phone'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            Phone
          </button>
        </div>

        {/* Email/Phone Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {loginMethod === 'email' ? 'Email' : 'Phone Number'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {loginMethod === 'email' ? 
                <Mail className="w-4 h-4 text-gray-400" /> : 
                <Phone className="w-4 h-4 text-gray-400" />
              }
            </div>
            <input
              {...register('identifier')}
              type={loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
              autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
            />
          </div>
          {errors.identifier && (
            <p className="text-sm text-red-600">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="rounded border-gray-300 text-coral-500 focus:ring-coral-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="/auth/reset-password" className="text-sm text-coral-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>

        {/* Signup Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-coral-500 font-medium hover:underline">
            Sign up for free
          </a>
        </p>
      </form>
    </div>
  );
};
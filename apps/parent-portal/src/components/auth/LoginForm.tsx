import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User, Lock, ArrowRight, Brain } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin?: (credentials: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'reset'>('login');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (onLogin) {
      await onLogin(data);
    } else {
      // Mock login for development
      console.log('Login attempt:', data);
      // Simulate successful login
      localStorage.setItem('auth_token', 'mock_token');
      window.location.reload();
    }
  };

  if (currentView === 'signup') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-purple-600 mb-3">Create Account</h2>
          <p className="text-gray-600 text-lg">Create your AIVO parent account</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 hover:border-purple-300 transition-all duration-200 bg-white shadow-sm"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 hover:border-purple-300 transition-all duration-200 bg-white shadow-sm"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 hover:border-purple-300 transition-all duration-200 bg-white shadow-sm"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 hover:border-purple-300 transition-all duration-200 bg-white shadow-sm"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-coral-500 to-salmon-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-coral-600 hover:to-salmon-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            Konto erstellen
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'reset') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-purple-600 mb-3">Reset Password</h2>
          <p className="text-gray-600 text-lg">We'll send you a reset link</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 hover:border-purple-300 transition-all duration-200 bg-white shadow-sm"
              placeholder="your.email@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-coral-500 to-salmon-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-coral-600 hover:to-salmon-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            Reset-Link senden
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-purple-600 mb-3">
          Welcome to AIVO
        </h2>
        <p className="text-gray-600 text-lg">Sign in to access your parent dashboard</p>
      </div>

      {error && (
        <div className="bg-linear-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 shadow-sm">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="email"
              {...register('email')}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white shadow-sm ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
              }`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white shadow-sm ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
              }`}
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-purple-50 rounded-r-2xl transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-purple-500 hover:text-purple-700" />
              ) : (
                <Eye className="h-5 w-5 text-purple-500 hover:text-purple-700" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between py-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-2"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setCurrentView('reset')}
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center shadow-lg"
        >
          {isSubmitting || isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-3 h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200" />
        </div>
        <div className="relative flex justify-center text-base">
          <span className="px-6 bg-white text-gray-500 font-medium">oder</span>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('signup')}
        className="w-full border-2 border-purple-500 text-purple-600 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 shadow-sm hover:shadow-md"
      >
        Create New Account
      </button>
    </div>
  );
};
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Phone, Lock, User, Calendar, Brain, ArrowRight, UserPlus, Key } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(12, 'Password must be at least 12 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  role: z.enum(['parent', 'teacher'], {
    errorMap: () => ({ message: 'Please select a role' })
  }),
  licenseCode: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Validate license code is required for teachers
  if (data.role === 'teacher' && (!data.licenseCode || data.licenseCode.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "District license code is required for teacher accounts",
  path: ["licenseCode"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { signup, error, clearError, loading } = useAuth();
  console.log('SignupForm: useAuth hook values:', { 
    hasSignup: typeof signup === 'function', 
    error, 
    loading 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    console.log('SignupForm.onSubmit called with:', data);
    clearError();

    try {
      const { confirmPassword, termsAccepted, ...signupData } = data;
      
      // Include license code for teachers, exclude for parents
      const finalData = data.role === 'teacher' 
        ? signupData 
        : { ...signupData, licenseCode: undefined };
      
      console.log('Calling signup with finalData:', finalData);
      await signup(finalData);
      console.log('Signup completed successfully');
      
      // If we get here without an error, signup was successful
      // But user may need to verify email before logging in
      onSuccess?.();
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.status === 409) {
        setFormError('email', {
          message: 'An account with this email already exists',
        });
      } else if (error.response?.status === 403 && data.role === 'teacher') {
        setFormError('licenseCode', {
          message: 'Invalid or expired district license code',
        });
      } else if (error.response?.status === 400) {
        // Handle password validation errors from backend
        const detail = error.response?.data?.detail;
        if (detail?.message?.includes('Password')) {
          setFormError('password', {
            message: detail.message || 'Password does not meet security requirements',
          });
        } else {
          setFormError('root', {
            message: detail?.message || 'Please check your information and try again',
          });
        }
      } else {
        setFormError('root', {
          message: error.response?.data?.message || 'Failed to create account',
        });
      }
    }
  };

  return (
    <div className={`w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-purple-200/50 p-8 border border-white/20 ${className}`}>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-300/30 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Join AIVO Learning
        </h1>
        <p className="text-gray-600 text-lg">Create your account to get started</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-800">I am a...</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'parent', label: 'Parent', description: 'Supporting my child\'s learning' },
              { value: 'teacher', label: 'Teacher', description: 'Educating students with district license' },
            ].map((role) => (
              <label
                key={role.value}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRole === role.value
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md shadow-purple-100 scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <input
                  {...register('role')}
                  type="radio"
                  value={role.value}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    selectedRole === role.value ? 'text-purple-700' : 'text-gray-900'
                  }`}>{role.label}</div>
                  <div className={`text-xs mt-1 ${
                    selectedRole === role.value ? 'text-purple-600' : 'text-gray-600'
                  }`}>{role.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="text-sm text-red-600 font-medium">{errors.role.message}</p>
          )}
        </div>

        {/* District License Code - Only for Teachers */}
        {selectedRole === 'teacher' && (
          <div className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              District License Code
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Enter the license code provided by your school district administrator
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="w-5 h-5 text-blue-400" />
              </div>
              <input
                {...register('licenseCode')}
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm font-mono tracking-wide ${
                  errors.licenseCode 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-blue-200 focus:border-blue-500 hover:border-blue-300'
                }`}
              />
            </div>
            {errors.licenseCode && (
              <p className="text-sm text-red-600 font-medium">{errors.licenseCode.message}</p>
            )}
            <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200">
              <p className="text-xs text-gray-700">
                <strong>Don't have a license code?</strong> Contact your school district administrator 
                or email <a href="mailto:districts@aivo.com" className="text-blue-600 hover:underline font-semibold">districts@aivo.com</a>
              </p>
            </div>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('firstName')}
                type="text"
                placeholder="Your first name"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.firstName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                }`}
                autoComplete="given-name"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-600 font-medium">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Last Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Your last name"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.lastName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                }`}
                autoComplete="family-name"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-600 font-medium">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="your.email@example.com"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                }`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                }`}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-800">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <input
              {...register('dateOfBirth')}
              type="date"
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                errors.dateOfBirth 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
              }`}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 font-medium">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 12 characters with special characters"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.password 
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
            {errors.password && (
              <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm ${
                  errors.confirmPassword 
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
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              {...register('termsAccepted')}
              type="checkbox"
              className="w-5 h-5 mt-0.5 rounded-lg border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-2"
            />
            <span className="ml-3 text-sm text-gray-700 leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-sm text-red-600 font-medium">{errors.termsAccepted.message}</p>
          )}
        </div>

        {/* Test API Connection Button */}
        <button
          type="button"
          onClick={async () => {
            console.log('Testing API connection...');
            try {
              const response = await fetch('http://localhost:8001/health');
              const data = await response.json();
              console.log('API Health Check Success:', data);
              alert('API connection works! ' + JSON.stringify(data));
            } catch (error) {
              console.error('API Health Check Failed:', error);
              alert('API connection failed: ' + (error instanceof Error ? error.message : String(error)));
            }
          }}
          className="w-full border-2 border-blue-500 text-blue-600 py-2 px-4 rounded-xl font-medium hover:bg-blue-50 mb-4"
        >
          Test API Connection
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          onClick={() => console.log('Submit button clicked, loading:', loading)}
          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/30 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center justify-center shadow-lg shadow-purple-200/50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-3 h-5 w-5" />
              Create Account
              <ArrowRight className="ml-3 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
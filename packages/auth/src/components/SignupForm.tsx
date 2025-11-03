import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@aivo/ui';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Phone, Lock, User, Calendar } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  role: z.enum(['parent', 'teacher', 'student'], {
    errorMap: () => ({ message: 'Please select a role' })
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: (data: { email: string; requiresVerification: boolean }) => void;
  className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { signup, error, clearError, loading } = useAuth();
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
    clearError();

    try {
      const { confirmPassword, termsAccepted, ...signupData } = data;
      await signup(signupData);
      onSuccess?.({
        email: data.email,
        requiresVerification: true
      });
    } catch (error: any) {
      if (error.response?.status === 409) {
        setFormError('email', {
          message: 'An account with this email already exists',
        });
      } else {
        setFormError('root', {
          message: error.response?.data?.message || 'Failed to create account',
        });
      }
    }
  };

  return (
    <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AIVO Learning</h1>
        <p className="text-gray-600">Create your account to get started</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">I am a...</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'parent', label: 'Parent', description: 'Supporting my child\'s learning' },
              { value: 'teacher', label: 'Teacher', description: 'Educating students' },
              { value: 'student', label: 'Student', description: 'Learning and growing' },
            ].map((role) => (
              <label
                key={role.value}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  selectedRole === role.value
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  {...register('role')}
                  type="radio"
                  value={role.value}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">{role.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{role.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('firstName')}
                type="text"
                placeholder="First name"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                autoComplete="given-name"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Last name"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                autoComplete="family-name"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('phone')}
                type="tel"
                placeholder="Enter your phone number"
                className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <input
              {...register('dateOfBirth')}
              type="date"
              className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-coral-500 focus:ring-1 focus:ring-coral-500 focus:outline-none transition-colors"
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
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
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <label className="flex items-start space-x-3">
            <input
              {...register('termsAccepted')}
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-coral-500 focus:ring-coral-500"
            />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="/terms" className="text-coral-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-coral-500 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-coral-500 font-medium hover:underline">
            Sign in here
          </a>
        </p>
      </form>
    </div>
  );
};
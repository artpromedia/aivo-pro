import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm, SignupForm, MFAVerification, PasswordReset } from '@aivo/auth';

type AuthFlow = 'login' | 'signup' | 'mfa' | 'reset' | 'success';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFlow = searchParams.get('mode') as AuthFlow || 'login';
  
  const [authFlow, setAuthFlow] = useState<AuthFlow>(initialFlow);
  const [tempToken, setTempToken] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>(searchParams.get('token') || '');

  const handleLoginSuccess = () => {
    // Redirect based on user role - for now, go to appropriate portal
    navigate('/dashboard'); // This could be dynamic based on user role
  };

  const handleSignupSuccess = () => {
    setAuthFlow('success');
  };

  const handleMFARequired = (token: string) => {
    setTempToken(token);
    setAuthFlow('mfa');
  };

  const handleMFASuccess = () => {
    navigate('/dashboard');
  };

  const handlePasswordResetSuccess = () => {
    setAuthFlow('login');
  };

  const renderAuthFlow = () => {
    switch (authFlow) {
      case 'login':
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <LoginForm
              onSuccess={handleLoginSuccess}
              onMFARequired={handleMFARequired}
            />
            <div className="text-center space-y-3">
              <button
                onClick={() => setAuthFlow('signup')}
                className="text-sm text-purple-600 hover:underline font-medium"
              >
                Don't have an account? Sign up for free
              </button>
              <br />
              <button
                onClick={() => setAuthFlow('reset')}
                className="text-sm text-gray-600 hover:text-purple-600 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </motion.div>
        );

      case 'signup':
        return (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <SignupForm onSuccess={handleSignupSuccess} />
            <div className="text-center">
              <button
                onClick={() => setAuthFlow('login')}
                className="text-sm text-purple-600 hover:underline font-medium"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </motion.div>
        );

      case 'mfa':
        return (
          <motion.div
            key="mfa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MFAVerification
              tempToken={tempToken}
              onSuccess={handleMFASuccess}
              onBack={() => setAuthFlow('login')}
            />
          </motion.div>
        );

      case 'reset':
        return (
          <motion.div
            key="reset"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PasswordReset
              resetToken={resetToken}
              onSuccess={handlePasswordResetSuccess}
              onBack={() => setAuthFlow('login')}
            />
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Please check your email to verify your account before signing in.
            </p>
            <button
              onClick={() => setAuthFlow('login')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Continue to Sign In
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {authFlow === 'login' && 'Welcome Back to AIVO'}
              {authFlow === 'signup' && 'Join the AIVO Learning Community'}
              {authFlow === 'mfa' && 'Secure Your Account'}
              {authFlow === 'reset' && 'Reset Your Password'}
              {authFlow === 'success' && 'Welcome to AIVO!'}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {authFlow === 'login' && 'Access your personalized learning dashboard and continue your journey.'}
              {authFlow === 'signup' && 'Create your account to unlock personalized AI-powered learning experiences.'}
              {authFlow === 'mfa' && 'Enter the verification code sent to your device to complete sign-in.'}
              {authFlow === 'reset' && 'Enter your email address and we\'ll send you a link to reset your password.'}
              {authFlow === 'success' && 'Your account has been created successfully!'}
            </motion.p>
          </div>

          {/* Auth Form */}
          <div className="flex justify-center">
            {renderAuthFlow()}
          </div>

          {/* Additional Info */}
          {authFlow === 'login' || authFlow === 'signup' ? (
            <motion.div
              className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security and FERPA compliance.</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Learning</h3>
                  <p className="text-gray-600 text-sm">Personalized curriculum that adapts to your unique learning style and pace.</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Family Support</h3>
                  <p className="text-gray-600 text-sm">Connect parents, teachers, and therapists for comprehensive support.</p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

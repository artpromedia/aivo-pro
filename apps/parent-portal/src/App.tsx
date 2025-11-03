import React, { useState } from 'react';
import { AuthProvider, useAuth, LoginForm, SignupForm, MFASetup, MFAVerification } from '@aivo/auth';

type AuthFlow = 'login' | 'signup' | 'mfa-setup' | 'mfa-verify' | 'dashboard';

const AuthenticatedApp: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [authFlow, setAuthFlow] = useState<AuthFlow>('login');
  const [tempToken, setTempToken] = useState<string>('');

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coral-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to AIVO Parent Portal! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Hello, {user.firstName}! Monitor your child's learning progress and achievements.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-coral-500 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Learning Progress</h3>
                <p className="text-white/80">Track your child's daily activities and achievements</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
                <p className="text-white/80">View detailed reports and learning analytics</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Communication</h3>
                <p className="text-white/80">Stay connected with teachers and school</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Settings</h3>
                <p className="text-white/80">Manage account and child profiles</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => logout()}
                className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = () => {
    // Authentication state will be handled by the provider
  };

  const handleLoginMFA = (token: string) => {
    setTempToken(token);
    setAuthFlow('mfa-verify');
  };

  const handleSignupSuccess = () => {
    setAuthFlow('mfa-setup');
  };

  const handleMFAComplete = () => {
    setAuthFlow('login');
  };

  const renderAuthFlow = () => {
    switch (authFlow) {
      case 'login':
        return (
          <div className="space-y-4">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onMFARequired={handleLoginMFA}
            />
            <div className="text-center">
              <button
                onClick={() => setAuthFlow('signup')}
                className="text-sm text-coral-500 hover:underline"
              >
                Need an account? Sign up here
              </button>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="space-y-4">
            <SignupForm onSuccess={handleSignupSuccess} />
            <div className="text-center">
              <button
                onClick={() => setAuthFlow('login')}
                className="text-sm text-coral-500 hover:underline"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </div>
        );

      case 'mfa-setup':
        return (
          <MFASetup
            onComplete={handleMFAComplete}
            onSkip={() => setAuthFlow('login')}
          />
        );

      case 'mfa-verify':
        return (
          <MFAVerification
            tempToken={tempToken}
            onSuccess={handleMFAComplete}
            onBack={() => setAuthFlow('login')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 to-pink-50 flex items-center justify-center p-4">
      {renderAuthFlow()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
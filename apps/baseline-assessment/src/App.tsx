import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConsentVerification } from './pages/ConsentVerification';
import { Welcome } from './pages/Welcome';
import { Assessment } from './pages/Assessment';
import { BreakScreen } from './pages/BreakScreen';
import { Complete } from './pages/Complete';
import { AssessmentProvider } from './providers/AssessmentProvider';

const queryClient = new QueryClient();

interface SessionData {
  childId: string;
  childName: string;
  grade: number;
  enrolledBy: 'parent' | 'teacher';
  districtLicense?: string;
  parentEmail?: string;
  teacherEmail?: string;
  consentStatus: {
    assessment: boolean;
    modelCloning: boolean;
  };
}

export default function App() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [consentVerified, setConsentVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get session info from URL params (passed from parent/teacher portal)
    const params = new URLSearchParams(window.location.search);
    const childId = params.get('childId');
    const token = params.get('token');
    const source = params.get('source') as 'parent' | 'teacher';
    const childName = params.get('childName');
    const grade = params.get('grade');
    
    if (childId && token) {
      validateSession(childId, token, source, childName, grade);
    } else {
      // If no params provided, show error
      console.error('Missing required parameters: childId and token');
      setError('This assessment must be accessed through the Parent or Teacher Portal.');
    }
  }, []);

  const validateSession = async (
    childId: string, 
    token: string, 
    source: 'parent' | 'teacher', 
    childName: string | null,
    grade: string | null
  ) => {
    try {
      // In production, this would validate with the API
      // For now, create session data from URL parameters
      setSessionData({
        childId,
        childName: childName || 'Student',
        grade: grade ? parseInt(grade) : 5,
        enrolledBy: source || 'parent',
        parentEmail: 'parent@example.com',
        consentStatus: {
          assessment: false,
          modelCloning: false,
        },
      });
    } catch (error) {
      console.error('Session validation failed:', error);
      setError('Failed to validate session. Please try again.');
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-coral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Required</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left">
            <p className="text-sm font-semibold text-gray-900 mb-3">To start an assessment:</p>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-coral-600 font-bold">1.</span>
                <span>Log in to your Parent Portal or Teacher Portal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-600 font-bold">2.</span>
                <span>Add a new child/student profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-600 font-bold">3.</span>
                <span>Follow the link to start the baseline assessment</span>
              </li>
            </ol>
          </div>
          <div className="mt-6 space-y-2">
            <a 
              href={import.meta.env.VITE_PARENT_PORTAL_URL || 'http://localhost:5174'} 
              className="block w-full px-6 py-3 bg-gradient-to-r from-coral-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go to Parent Portal
            </a>
            <a 
              href={import.meta.env.VITE_TEACHER_PORTAL_URL || 'http://localhost:5175'} 
              className="block w-full px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-coral-500 transition-all"
            >
              Go to Teacher Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AssessmentProvider sessionData={sessionData}>
          <Routes>
            {/* Consent Flow */}
            <Route path="/" element={
              !consentVerified ? (
                <Navigate to="/consent-verification" />
              ) : (
                <Navigate to="/welcome" />
              )
            } />
            <Route path="/consent-verification" element={
              <ConsentVerification 
                sessionData={sessionData}
                onVerified={() => setConsentVerified(true)}
              />
            } />
            
            {/* Assessment Flow */}
            <Route path="/welcome" element={
              consentVerified ? <Welcome /> : <Navigate to="/consent-verification" />
            } />
            <Route path="/assess" element={<Assessment />} />
            <Route path="/break" element={<BreakScreen />} />
            <Route path="/complete" element={<Complete />} />
          </Routes>
        </AssessmentProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
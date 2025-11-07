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
  
  useEffect(() => {
    // Get session info from URL params (passed from parent/teacher portal)
    const params = new URLSearchParams(window.location.search);
    const childId = params.get('childId');
    const token = params.get('token');
    const source = params.get('source') as 'parent' | 'teacher';
    
    if (childId && token) {
      validateSession(childId, token, source);
    }
  }, []);

  const validateSession = async (childId: string, token: string, source: 'parent' | 'teacher') => {
    try {
      // In production, this would validate with the API
      // For now, create mock session data
      setSessionData({
        childId,
        childName: 'Test Student',
        grade: 5,
        enrolledBy: source,
        parentEmail: 'parent@example.com',
        consentStatus: {
          assessment: false,
          modelCloning: false,
        },
      });
    } catch (error) {
      console.error('Session validation failed:', error);
    }
  };

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
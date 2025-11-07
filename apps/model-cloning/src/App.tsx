import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CloningProvider } from './providers/CloningProvider';
import DualConsent from './pages/DualConsent';
import ModelConfiguration from './pages/ModelConfiguration';
import CloningProcess from './pages/CloningProcess';
import ValidationResults from './pages/ValidationResults';
import Complete from './pages/Complete';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface SessionData {
  childId: string;
  childName: string;
  grade: number;
  enrolledBy: 'parent' | 'teacher';
  districtLicense?: string;
  parentEmail?: string;
  teacherEmail?: string;
  teacherName?: string;
  schoolName?: string;
  assessmentResults?: any;
}

// Validate and parse session from URL params
function validateSession(): SessionData | null {
  const params = new URLSearchParams(window.location.search);
  
  const childId = params.get('childId');
  const childName = params.get('childName');
  const grade = params.get('grade');
  const enrolledBy = params.get('enrolledBy') as 'parent' | 'teacher';
  const source = params.get('source');
  
  if (!childId || !childName || !grade || !enrolledBy || source !== 'baseline-assessment') {
    return null;
  }

  return {
    childId,
    childName,
    grade: parseInt(grade, 10),
    enrolledBy,
    districtLicense: params.get('districtLicense') || undefined,
    parentEmail: params.get('parentEmail') || undefined,
    teacherEmail: params.get('teacherEmail') || undefined,
    teacherName: params.get('teacherName') || undefined,
    schoolName: params.get('schoolName') || undefined,
    assessmentResults: params.get('assessmentData') 
      ? JSON.parse(decodeURIComponent(params.get('assessmentData')!))
      : undefined,
  };
}

function AppContent() {
  const location = useLocation();
  const sessionData = validateSession();

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Session</h1>
          <p className="text-gray-600 mb-6">
            This page requires valid session data from the baseline assessment.
            Please start from the parent or teacher portal.
          </p>
          <a
            href="http://localhost:5174"
            className="inline-block px-6 py-3 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors"
          >
            Return to Parent Portal
          </a>
        </div>
      </div>
    );
  }

  return (
    <CloningProvider sessionData={sessionData}>
      <Routes>
        <Route path="/" element={<Navigate to="/clone/consent" replace />} />
        <Route path="/clone/consent" element={<DualConsent />} />
        <Route path="/clone/configure" element={<ModelConfiguration />} />
        <Route path="/clone/process" element={<CloningProcess />} />
        <Route path="/clone/validation" element={<ValidationResults />} />
        <Route path="/clone/complete" element={<Complete />} />
        <Route path="*" element={<Navigate to="/clone/consent" replace />} />
      </Routes>
    </CloningProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

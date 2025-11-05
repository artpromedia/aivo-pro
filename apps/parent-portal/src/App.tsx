import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth, AuthContainer } from '@aivo/auth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { AddChild } from './pages/Children/AddChild';
import { ChildrenIndex } from './pages/Children';
import { ChildProfile } from './pages/Children/ChildProfile';
import { ChildSettings } from './pages/Children/ChildSettings';
import IEPDashboard from './pages/Children/IEPDashboard';
import { VirtualBrain } from './pages/VirtualBrain';
import { Suggestions } from './pages/Suggestions';
import { AccessManagement } from './pages/AccessManagement';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Messages } from './pages/Messages';
import { Billing } from './pages/Billing';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AuthenticatedApp: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading if auth is being initialized
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-300/30 animate-pulse mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-purple-600 font-semibold">Loading AIVO...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated && user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/children" element={<ChildrenIndex />} />
            <Route path="/children/add" element={<AddChild />} />
            <Route path="/children/:id" element={<ChildProfile />} />
            <Route path="/children/:id/settings" element={<ChildSettings />} />
            <Route path="/children/:id/iep" element={<IEPDashboard />} />
            <Route path="/virtual-brain" element={<VirtualBrain />} />
            <Route path="/virtual-brain/:childId" element={<VirtualBrain />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/access-management" element={<AccessManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/billing" element={<Billing />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    );
  }

  // Show auth container if not authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center p-6">
      <AuthContainer 
        initialView="login"
        onSuccess={() => window.location.reload()}
        className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
      />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
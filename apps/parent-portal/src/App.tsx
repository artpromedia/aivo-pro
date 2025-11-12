import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@aivo/auth';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const ChildrenIndex = lazy(() => import('./pages/Children').then(module => ({ default: module.ChildrenIndex })));
const AddChild = lazy(() => import('./pages/Children/AddChild').then(module => ({ default: module.AddChild })));
const ChildProfile = lazy(() => import('./pages/Children/ChildProfile').then(module => ({ default: module.ChildProfile })));
const ChildSettings = lazy(() => import('./pages/Children/ChildSettings').then(module => ({ default: module.ChildSettings })));
const IEPDashboard = lazy(() => import('./pages/Children/IEPDashboard'));
const VirtualBrain = lazy(() => import('./pages/VirtualBrain').then(module => ({ default: module.VirtualBrain })));
const Suggestions = lazy(() => import('./pages/Suggestions').then(module => ({ default: module.Suggestions })));
const AccessManagement = lazy(() => import('./pages/AccessManagement').then(module => ({ default: module.AccessManagement })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const Notifications = lazy(() => import('./pages/Notifications').then(module => ({ default: module.Notifications })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const Billing = lazy(() => import('./pages/Billing').then(module => ({ default: module.Billing })));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-purple-600">
      <div className="h-10 w-10 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" />
      <span className="font-semibold">Loading experience...</span>
    </div>
  </div>
);

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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={(
            <Suspense fallback={<PageLoader />}>
              <DashboardLayout />
            </Suspense>
          )}
        >
            <Route
              path="/dashboard"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              )}
            />
            <Route
              path="/children"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <ChildrenIndex />
                </Suspense>
              )}
            />
            <Route
              path="/children/add"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <AddChild />
                </Suspense>
              )}
            />
            <Route
              path="/children/:id"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <ChildProfile />
                </Suspense>
              )}
            />
            <Route
              path="/children/:id/settings"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <ChildSettings />
                </Suspense>
              )}
            />
            <Route
              path="/children/:id/iep"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <IEPDashboard />
                </Suspense>
              )}
            />
            <Route
              path="/virtual-brain"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <VirtualBrain />
                </Suspense>
              )}
            />
            <Route
              path="/virtual-brain/:childId"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <VirtualBrain />
                </Suspense>
              )}
            />
            <Route
              path="/suggestions"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Suggestions />
                </Suspense>
              )}
            />
            <Route
              path="/access-management"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <AccessManagement />
                </Suspense>
              )}
            />
            <Route
              path="/analytics"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Analytics />
                </Suspense>
              )}
            />
            <Route
              path="/notifications"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Notifications />
                </Suspense>
              )}
            />
            <Route
              path="/settings"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              )}
            />
            <Route
              path="/messages"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Messages />
                </Suspense>
              )}
            />
            <Route
              path="/billing"
              element={(
                <Suspense fallback={<PageLoader />}>
                  <Billing />
                </Suspense>
              )}
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
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
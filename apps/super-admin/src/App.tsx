import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import AIProviderManagement from './pages/AIProviderManagement';
import RBACManagement from './pages/RBACManagement';
import SalesPortal from './pages/SalesPortal';
import EnterpriseSales from './pages/EnterpriseSales';
import TechnicalSupport from './pages/TechnicalSupport';
import SystemMonitoring from './pages/SystemMonitoring';
import PlatformGovernance from './pages/PlatformGovernance';
import ResourceManagement from './pages/ResourceManagement';
import APIManagement from './pages/APIManagement';
import UserManagement from './pages/UserManagement';
import GlobalSearch from './pages/GlobalSearch';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { ConfirmDialogProvider } from './components/ConfirmDialogProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          console.error('App Error:', { error, errorInfo });
          // Send to error monitoring service
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ConfirmDialogProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ai-providers/*" element={<AIProviderManagement />} />
                  <Route path="/rbac/*" element={<RBACManagement />} />
                  <Route path="/sales/*" element={<SalesPortal />} />
                  <Route path="/enterprise-sales/*" element={<EnterpriseSales />} />
                  <Route path="/support/*" element={<TechnicalSupport />} />
                  <Route path="/governance/*" element={<SystemMonitoring />} />
                  <Route path="/platform-governance/*" element={<PlatformGovernance />} />
                  <Route path="/resources/*" element={<ResourceManagement />} />
                  <Route path="/api/*" element={<APIManagement />} />
                  <Route path="/users/*" element={<UserManagement />} />
                  
                  {/* Search Route */}
                  <Route path="/search" element={<GlobalSearch />} />
                  
                  {/* Catch-all 404 Route */}
                  <Route path="*" element={
                    <div className="p-6 text-center">
                      <h1 className="text-3xl font-bold text-white mb-4">404 - Page Not Found</h1>
                      <p className="text-gray-400 mb-4">The page you're looking for doesn't exist.</p>
                      <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  } />
                </Routes>
              </Layout>
            </Router>
          </ConfirmDialogProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
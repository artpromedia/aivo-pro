import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Brain, Shield, CreditCard, Headphones, 
  Activity, Server, Zap, Bell, Settings,
  LogOut, Search, User
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { usePlatformStore } from '@/stores/platformStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from './ToastProvider';
import { useConfirmDialog } from './ConfirmDialogProvider';
import CommandCenter from './CommandCenter';
import AlertBanner from './AlertBanner';
import AivoLogo from './AivoLogo';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Providers', href: '/ai-providers', icon: Brain },
  { name: 'Access Control', href: '/rbac', icon: Shield },
  { name: 'Enterprise Sales', href: '/sales', icon: CreditCard },
  { name: 'Support Center', href: '/support', icon: Headphones },
  { name: 'System Health', href: '/governance', icon: Activity },
  { name: 'Resources', href: '/resources', icon: Server },
  { name: 'API Gateway', href: '/api', icon: Zap },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm } = useConfirmDialog();
  const { 
    commandPaletteOpen, 
    toggleCommandPalette,
    criticalMode,
    criticalAlerts,
    isConnected 
  } = usePlatformStore();

  // Initialize WebSocket connection
  useWebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3001');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        navigate('/search');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleCommandPalette, navigate]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Critical Alert Banner */}
      <AnimatePresence>
        {criticalMode && criticalAlerts.length > 0 && (
          <AlertBanner alerts={criticalAlerts} />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <AivoLogo size="md" />
              <div>
                <h1 className="text-lg font-bold text-white">AIVO</h1>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-coral-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-300">
              <User className="w-5 h-5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-gray-400 truncate">admin@aivo.ai</p>
              </div>
              <button 
                onClick={async () => {
                  const confirmed = await confirm({
                    type: 'warning',
                    title: 'Logout Confirmation',
                    description: 'Are you sure you want to logout? Any unsaved changes will be lost.',
                    confirmText: 'Logout',
                    cancelText: 'Stay Logged In'
                  });
                  
                  if (confirmed) {
                    // Clear any stored auth tokens
                    localStorage.clear();
                    sessionStorage.clear();
                    // Navigate to login or home page
                    window.location.href = '/login';
                  }
                }}
                className="p-1 text-gray-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Bar */}
          <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800 sticky top-0 z-40">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-white">
                    {navigation.find(nav => location.pathname.startsWith(nav.href))?.name || 'Dashboard'}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <button
                    onClick={toggleCommandPalette}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                    <kbd className="ml-1 px-1.5 py-0.5 bg-gray-700 rounded text-xs">⌘K</kbd>
                  </button>

                  {/* Notifications */}
                  <button 
                    onClick={() => {
                      // Navigate to notifications page or open notifications panel
                      toast.info('Notifications panel opened successfully!');
                      navigate('/notifications');
                    }}
                    className="relative p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {criticalAlerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {criticalAlerts.length}
                      </span>
                    )}
                  </button>

                  {/* Settings */}
                  <button 
                    onClick={() => {
                      // Navigate to settings or open settings modal
                      navigate('/settings');
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandCenter open={commandPaletteOpen} onClose={() => toggleCommandPalette()} />
    </div>
  );
}
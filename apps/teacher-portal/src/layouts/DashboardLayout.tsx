import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Brain, 
  Target, 
  Activity, 
  Bell, 
  Settings,
  LogOut,
  User,
  CreditCard,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '@aivo/auth';

export const DashboardLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-purple-50 to-salmon-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-coral-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-salmon-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <div className="w-20 flex-shrink-0">
          <nav className="fixed top-0 left-0 h-full w-20 bg-gradient-to-b from-coral-500 via-purple-600 to-salmon-500 shadow-2xl z-50 flex flex-col items-center py-6">
            {/* Logo */}
            <Link to="/dashboard" className="w-12 h-12 bg-aivo-gradient rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Brain className="w-6 h-6 text-white" />
            </Link>

            {/* Navigation Items */}
            <div className="flex-1 flex flex-col gap-2 mt-8">
              <NavItem icon={Calendar} isActive={isActive('/dashboard')} to="/dashboard" />
              <NavItem icon={Users} isActive={isActive('/children')} to="/children" />
              <NavItem icon={FileText} isActive={isActive('/iep')} to="/children" title="IEP Management" />
              <NavItem icon={Brain} isActive={isActive('/virtual-brain')} to="/virtual-brain" />
              <NavItem icon={MessageCircle} isActive={isActive('/messages')} to="/messages" />
              <NavItem icon={Target} isActive={isActive('/suggestions')} to="/suggestions" />
              <NavItem icon={Activity} isActive={isActive('/analytics')} to="/analytics" />
              <NavItem icon={Bell} isActive={isActive('/notifications')} to="/notifications" />
              <NavItem icon={CreditCard} isActive={isActive('/billing')} to="/billing" />
              <NavItem icon={Settings} isActive={isActive('/settings')} to="/settings" />
            </div>

            {/* User Profile */}
            <div className="mt-auto space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white group hover:bg-white/30 transition-all">
                <User className="w-5 h-5" />
              </div>
              <button 
                onClick={logout}
                className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-200 transition-all group"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// NavItem Component
const NavItem: React.FC<{ icon: React.ComponentType<{ className?: string }>; isActive?: boolean; to?: string; title?: string }> = ({ 
  icon: Icon, 
  isActive = false, 
  to,
  title 
}) => {
  const sharedClasses = `p-3.5 rounded-2xl transition-all group relative ${
    isActive 
      ? 'bg-white/20 text-white shadow-lg scale-110' 
      : 'text-white/70 hover:text-white hover:bg-white/15 hover:scale-105'
  }`;

  const content = (
    <>
      <Icon className="w-5 h-5 group-hover:animate-gentle-bounce" />
      {isActive && (
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-sm"></div>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} title={title} className={sharedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" title={title} className={sharedClasses}>
      {content}
    </button>
  );
};
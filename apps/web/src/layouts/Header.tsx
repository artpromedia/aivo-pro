import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Features', href: '/features' },
  { name: 'AIVO Pad', href: '/aivo-pad', badge: 'New' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = null as { firstName?: string } | null; // For now, keep simple - can enable auth later

  const handleLoginClick = () => {
    // Navigate to auth page with login mode
    navigate('/auth?mode=login');
  };

  const handleStartLearningClick = () => {
    // Navigate to auth page with signup mode
    navigate('/auth?mode=signup');
  };

  const handleLogoutClick = async () => {
    try {
      // For now, just redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <nav className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AIVO Learning</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                  <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                  <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                  <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                  <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">AIVO</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative text-sm font-medium leading-6 transition-all duration-300 hover:scale-105 ${
                location.pathname === item.href
                  ? 'text-purple-600 border-b-2 border-purple-600 pb-1'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {item.name}
              {item.badge && (
                <span className="absolute -top-2 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {user?.firstName || 'Dashboard'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogoutClick}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleLoginClick}>
                Log in
              </Button>
              <Button 
                size="sm"
                onClick={handleStartLearningClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Start Learning
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 z-50" />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                        <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                        <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                        <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                        <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">AIVO</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 relative"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {item.badge && (
                          <span className="absolute top-1 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {user ? (
                      <>
                        <Button 
                          variant="ghost" 
                          className="w-full mb-3 flex items-center justify-center gap-2"
                          onClick={() => {
                            navigate('/dashboard');
                            setMobileMenuOpen(false);
                          }}
                        >
                          <User className="w-4 h-4" />
                          {user?.firstName || 'Dashboard'}
                        </Button>
                        <Button 
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            handleLogoutClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          className="w-full mb-3"
                          onClick={() => {
                            handleLoginClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Log in
                        </Button>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          onClick={() => {
                            handleStartLearningClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Start Learning
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

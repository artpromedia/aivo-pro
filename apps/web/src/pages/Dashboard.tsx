import React from 'react';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@aivo/auth';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  Bell,
  ArrowRight,
  Calendar,
  Award,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case UserRole.PARENT:
        return {
          title: 'Parent Dashboard',
          subtitle: "Track your child's learning progress and achievements",
          cards: [
            {
              icon: BookOpen,
              title: 'Learning Progress',
              description: 'View detailed progress across all subjects',
              action: 'View Progress',
              color: 'purple'
            },
            {
              icon: Target,
              title: 'IEP Goals',
              description: 'Monitor IEP goal completion and milestones',
              action: 'View Goals',
              color: 'blue'
            },
            {
              icon: Calendar,
              title: 'Schedule',
              description: 'Manage learning sessions and activities',
              action: 'View Schedule',
              color: 'green'
            },
            {
              icon: Users,
              title: 'Teacher Communication',
              description: 'Connect with teachers and therapists',
              action: 'Messages',
              color: 'orange'
            }
          ]
        };
      case UserRole.TEACHER:
        return {
          title: 'Teacher Dashboard',
          subtitle: 'Manage your students and track classroom progress',
          cards: [
            {
              icon: Users,
              title: 'My Students',
              description: 'View and manage all your students',
              action: 'View Students',
              color: 'purple'
            },
            {
              icon: BarChart3,
              title: 'Class Analytics',
              description: 'Track overall classroom performance',
              action: 'View Analytics',
              color: 'blue'
            },
            {
              icon: Target,
              title: 'IEP Management',
              description: 'Update and track IEP goals',
              action: 'Manage IEPs',
              color: 'green'
            },
            {
              icon: Bell,
              title: 'Notifications',
              description: 'Stay updated on student progress',
              action: 'View Alerts',
              color: 'orange'
            }
          ]
        };
      case UserRole.STUDENT:
        return {
          title: 'Student Dashboard',
          subtitle: 'Continue your personalized learning journey',
          cards: [
            {
              icon: BookOpen,
              title: 'My Lessons',
              description: 'Access your personalized curriculum',
              action: 'Start Learning',
              color: 'purple'
            },
            {
              icon: Award,
              title: 'Achievements',
              description: 'View badges and accomplishments',
              action: 'View Badges',
              color: 'blue'
            },
            {
              icon: BarChart3,
              title: 'My Progress',
              description: 'See how you are improving',
              action: 'View Progress',
              color: 'green'
            },
            {
              icon: Calendar,
              title: 'Schedule',
              description: 'Check your learning schedule',
              action: 'View Schedule',
              color: 'orange'
            }
          ]
        };
      default:
        return {
          title: 'Welcome to AIVO',
          subtitle: 'Your learning dashboard is being set up',
          cards: []
        };
    }
  };

  const { title, subtitle, cards } = getDashboardContent();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
      case 'blue':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'orange':
        return 'bg-orange-100 text-orange-600 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{subtitle}</p>
              {user && (
                <p className="text-sm text-purple-600 mt-2">
                  Welcome back, {user.firstName} {user.lastName}!
                </p>
              )}
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-12">
        {cards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${getColorClasses(card.color)}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {card.description}
                </p>
                <button className="text-purple-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  {card.action}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Setting Up Your Dashboard
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're preparing your personalized learning environment. This will be ready shortly!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return to Homepage
            </button>
          </motion.div>
        )}

        {/* Quick Stats - Show for all roles */}
        {cards.length > 0 && (
          <motion.div
            className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Overview</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">Engagement Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {user?.role === UserRole.TEACHER ? '24' : '12'}
                </div>
                <div className="text-gray-600">
                  {user?.role === UserRole.TEACHER ? 'Students' : 'Lessons Completed'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">8.5</div>
                <div className="text-gray-600">Average Performance</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
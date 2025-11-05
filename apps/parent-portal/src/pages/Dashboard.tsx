import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  Award, 
  MessageCircle, 
  Bell, 
  Calendar, 
  User, 
  Settings,
  Brain,
  Users,
  Target,
  BookOpen,
  Eye,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Activity,
  Heart,
  Star,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChildren } from '../hooks/useChildren';
import { useSuggestions } from '../hooks/useSuggestions';
import { useMockWebSocket } from '../hooks/useWebSocket';
import { ChildCard } from '../components/ChildCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { SuggestionAlert } from '../components/SuggestionAlert';
import { WeeklyProgressChart } from '../components/WeeklyProgressChart';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface DashboardStats {
  avgProgress: number;
  totalHours: number;
  skillsMastered: number;
  activeChildren: number;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { children, isLoading: childrenLoading } = useChildren();
  const { pendingSuggestions, isLoading: suggestionsLoading } = useSuggestions();
  
  // Mock WebSocket for real-time updates
  useMockWebSocket();

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Mock stats calculation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            avgProgress: children?.reduce((sum, child) => sum + child.progress.overall, 0) / (children?.length || 1) || 0,
            totalHours: children?.reduce((sum, child) => sum + child.weeklyStats.hoursLearned, 0) || 0,
            skillsMastered: children?.reduce((sum, child) => sum + child.weeklyStats.skillsMastered, 0) || 0,
            activeChildren: children?.length || 0,
          });
        }, 300);
      });
    },
    enabled: !!children,
  });

  const currentDate = new Date();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen">
      {/* Main Content Area */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-20 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(currentDate, 'EEEE, d MMMM yyyy')}
                  </span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent">
                  {greeting}, {user?.name?.split(' ')[0] || 'Parent'}! 
                  <span className="ml-2">👋</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your children's learning today
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/messages"
                className="flex items-center space-x-2 bg-gradient-to-r from-coral-100 to-purple-100 text-coral-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:from-coral-200 hover:to-purple-200 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AIVO Assistant</span>
              </Link>
              
              <Link 
                to="/notifications" 
                className="relative p-3 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:scale-105"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral-500 rounded-full shadow-sm"></span>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats && [
              { 
                label: 'Active Children', 
                value: stats.activeChildren.toString(), 
                icon: Users, 
                color: 'from-coral-400 to-coral-600',
                bg: 'bg-coral-50',
                text: 'text-coral-600'
              },
              { 
                label: 'Weekly Progress', 
                value: `${Math.round(stats.avgProgress)}%`, 
                icon: TrendingUp, 
                color: 'from-purple-400 to-purple-600',
                bg: 'bg-purple-50',
                text: 'text-purple-600'
              },
              { 
                label: 'Learning Hours', 
                value: `${stats.totalHours.toFixed(1)}h`, 
                icon: Clock, 
                color: 'from-pink-400 to-pink-600',
                bg: 'bg-pink-50',
                text: 'text-pink-600'
              },
              { 
                label: 'Skills Mastered', 
                value: stats.skillsMastered.toString(), 
                icon: Award, 
                color: 'from-yellow-400 to-orange-500',
                bg: 'bg-yellow-50',
                text: 'text-orange-600'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Pending Suggestions Alert */}
          {pendingSuggestions && pendingSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-coral-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">AI Suggestions Available</p>
                      <p className="text-white/90 text-sm">
                        {pendingSuggestions.length} new recommendations for your children
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/suggestions"
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Review All
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* IEP Actions Alert */}
          {children && children.some(child => child.hasIEP) && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">IEP Updates Available</p>
                      <p className="text-white/90 text-sm">
                        Review pending evaluations and consent forms for your children
                      </p>
                    </div>
                  </div>
                  <Link 
                    to={children.find(child => child.hasIEP) ? `/children/${children.find(child => child.hasIEP)?.id}/iep` : '/children'}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Manage IEPs
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Children Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Children Overview */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Children</h2>
                  <Link 
                    to="/children/add" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-coral-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-600 border border-white/20 backdrop-blur-sm"
                  >
                    <Plus className="w-6 h-6" />
                    Add Child
                  </Link>
                </div>

                {childrenLoading ? (
                  <div className="grid gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse shadow-sm"></div>
                    ))}
                  </div>
                ) : children?.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm p-12 text-center rounded-2xl shadow-sm border-2 border-dashed border-coral-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-coral-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Brain className="w-10 h-10 text-coral-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Add Your First Child
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Get started by adding your child's profile to create their personalized AI learning experience
                    </p>
                    <Link
                      to="/children/add"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-coral-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-600 border border-white/20 backdrop-blur-sm"
                    >
                      <Plus className="w-6 h-6" />
                      Add Child Profile
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {children?.map((child) => (
                      <ChildCard key={child.id} child={child} />
                    ))}
                  </div>
                )}
              </section>

              {/* Notifications Section - Following screenshot layout */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                
                {/* Active Lesson Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <span className="text-white text-opacity-90 text-sm font-medium">Class Time!</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Music 2b</h3>
                      <p className="text-white text-opacity-90 text-sm mb-4">in progress at 9:05 AM</p>
                      <Link 
                        to="/learner-app" 
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg inline-block text-center"
                      >
                        Start Lesson
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress Cards */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Award className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Art 3C</p>
                          <p className="text-sm text-gray-600">50% of homework completed</p>
                        </div>
                      </div>
                      <Link 
                        to="/analytics" 
                        className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-600 transition-all hover:scale-105 shadow-sm inline-block"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Art 2B</p>
                          <p className="text-sm text-gray-600">75% of homework completed</p>
                        </div>
                      </div>
                      <Link 
                        to="/analytics" 
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition-all hover:scale-105 shadow-sm inline-block"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                          <MessageCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Music 2B</p>
                          <p className="text-sm text-gray-600">25% of homework completed</p>
                        </div>
                      </div>
                      <Link 
                        to="/analytics" 
                        className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-600 transition-all hover:scale-105 shadow-sm inline-block"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Today's Tasks */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">To Do Today</h2>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold shadow-sm">M</div>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold shadow-sm">W</div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Teacher Conference Request</p>
                        <p className="text-sm text-gray-600">Ms. Rodriguez wants to schedule a meeting</p>
                      </div>
                    </div>
                    
                    <Link 
                      to="/messages" 
                      className="bg-gradient-to-r from-coral-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-coral-600 hover:to-purple-600 transition-all hover:scale-105 shadow-sm hover:shadow-md inline-block text-center"
                    >
                      Open Chat
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <TaskItem
                    type="art"
                    title="Art 3C"
                    description="Check 5 homework assignments"
                    priority="medium"
                  />
                  
                  <TaskItem
                    type="music"
                    title="Music 3C"
                    description="Prepare Chapter 9 exam"
                    priority="high"
                  />
                </div>
              </section>
            </div>

            {/* Right Sidebar - Schedule & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Schedule Panel - Following screenshot design */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Class Schedule</h3>
                  <div className="bg-gradient-to-r from-coral-100 to-purple-100 text-coral-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                    8:00
                  </div>
                </div>

                <div className="space-y-4">
                  <ScheduleItem
                    time="8:00 - 8:45"
                    subject="Art 2B"
                    isActive={false}
                  />
                  
                  <ScheduleItem
                    time="9:05 - 9:50"
                    subject="Music 2B"
                    isActive={true}
                    status="Now"
                  />
                  
                  <ScheduleItem
                    time="10:05 - 10:45"
                    subject="Art 3B"
                    isActive={false}
                  />
                  
                  <ScheduleItem
                    time="11:00 - 11:45"
                    subject="Art 1B"
                    isActive={false}
                  />
                  
                  <ScheduleItem
                    time="12:05 - 12:50"
                    subject="Art 2B"
                    isActive={false}
                  />
                  
                  <ScheduleItem
                    time="13:05 - 13:50"
                    subject="Music 2B"
                    isActive={false}
                  />
                </div>
              </div>

              {/* IEP Quick Access */}
              {children && children.some(child => child.hasIEP) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">IEP Management</h3>
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    {children.filter(child => child.hasIEP).map(child => (
                      <div key={child.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{child.firstName} {child.lastName}</p>
                            <p className="text-sm text-purple-600">IEP Active</p>
                          </div>
                          <Link
                            to={`/children/${child.id}/iep`}
                            className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-600 transition-all hover:scale-105"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-2 border-t border-purple-100">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Need an IEP for a child?</p>
                        <Link
                          to="/children"
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium underline"
                        >
                          Generate from Assessment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              {stats && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
                  <div className="space-y-4">
                    <StatItem
                      icon={TrendingUp}
                      label="Avg. Progress"
                      value={`${Math.round(stats.avgProgress)}%`}
                      color="green"
                    />
                    
                    <StatItem
                      icon={Clock}
                      label="Time Learning"
                      value={`${stats.totalHours.toFixed(1)}h`}
                      color="blue"
                    />
                    
                    <StatItem
                      icon={Award}
                      label="Skills Mastered"
                      value={stats.skillsMastered.toString()}
                      color="purple"
                    />
                  </div>
                </div>
              )}

              {/* Recent Activity Feed */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <ActivityFeed limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const EnhancedChildCard: React.FC<{ child: any }> = ({ child }) => (
  <motion.div
    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:scale-[1.02] group"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-aivo-gradient rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
          {child.name?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{child.name}</h3>
          <p className="text-sm text-gray-600">Grade {child.grade} • Age {child.age}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">Active Learning</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-coral-600">{child.progress?.overall || 0}%</p>
        <p className="text-xs text-gray-500">Overall Progress</p>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <p className="text-lg font-bold text-purple-600">{child.weeklyStats?.hoursLearned || 0}h</p>
        <p className="text-xs text-gray-500">This Week</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-pink-600">{child.weeklyStats?.skillsMastered || 0}</p>
        <p className="text-xs text-gray-500">Skills</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-coral-600">{child.weeklyStats?.streakDays || 0}</p>
        <p className="text-xs text-gray-500">Day Streak</p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3">
      <Link
        to={`/children/${child.id}`}
        className="flex-1 bg-gradient-to-r from-coral-50 to-purple-50 text-coral-700 px-4 py-3 rounded-xl font-semibold hover:from-coral-100 hover:to-purple-100 transition-all text-center hover:scale-105 shadow-sm hover:shadow-md"
      >
        View Profile
      </Link>
      <Link
        to={`/virtual-brain/${child.id}`}
        className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-coral-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-coral-600 transition-all hover:scale-105 shadow-sm hover:shadow-md"
        title="Virtual Brain"
      >
        <Brain className="w-5 h-5" />
      </Link>
    </div>
  </motion.div>
);

const ScheduleItem: React.FC<{
  time: string;
  subject: string;
  isActive?: boolean;
  status?: string;
}> = ({ time, subject, isActive, status }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
    isActive ? 'bg-indigo-500 text-white' : 'bg-gray-50 hover:bg-gray-100'
  }`}>
    <div>
      <p className={`text-sm ${isActive ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
        {time}
      </p>
      <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
        {subject}
      </p>
    </div>
    
    {status && (
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-indigo-100 text-indigo-700'
      }`}>
        {status}
      </div>
    )}
    

  </div>
);

const StatItem: React.FC<{
  icon: any;
  label: string;
  value: string;
  color: 'green' | 'blue' | 'purple';
}> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{
  type: 'art' | 'music';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}> = ({ type, title, description, priority }) => {
  const typeIcons = {
    art: '🎨',
    music: '🎵',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700 border-gray-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-coral-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
            {typeIcons[type]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${priorityColors[priority]} shadow-sm`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Link 
          to="/learner-app" 
          className="flex-1 bg-gradient-to-r from-coral-50 to-purple-50 text-coral-700 px-4 py-2 rounded-lg font-semibold hover:from-coral-100 hover:to-purple-100 transition-all hover:scale-105 text-sm inline-block text-center"
        >
          Start Task
        </Link>
        <Link 
          to="/analytics" 
          className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all hover:scale-105 text-sm font-semibold inline-block text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

// Helper functions
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
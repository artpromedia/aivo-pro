import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell,
  Check,
  X,
  Clock,
  User,
  BookOpen,
  Brain,
  Award,
  AlertTriangle,
  MessageCircle,
  Settings,
  Filter,
  MarkdownIcon,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@aivo/ui';

interface Notification {
  id: string;
  type: 'achievement' | 'progress' | 'suggestion' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  childName?: string;
  actionRequired?: boolean;
  data?: any;
}

export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'messages' | 'alerts'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'Emma has completed 5 consecutive math lessons with 90%+ accuracy. Great job!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
      priority: 'medium',
      childName: 'Emma Chen',
      actionRequired: false,
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'AI Learning Recommendation',
      message: 'Based on Emma\'s recent performance, we recommend advancing to Grade 5 mathematics.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      isRead: false,
      priority: 'high',
      childName: 'Emma Chen',
      actionRequired: true,
    },
    {
      id: '3',
      type: 'message',
      title: 'Message from Ms. Johnson',
      message: 'Emma showed excellent problem-solving skills in today\'s group activity. Keep up the great work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      isRead: true,
      priority: 'low',
      childName: 'Emma Chen',
      actionRequired: false,
    },
    {
      id: '4',
      type: 'progress',
      title: 'Weekly Progress Report',
      message: 'Your children completed 15.5 hours of learning this week with an average score of 87%.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true,
      priority: 'medium',
      actionRequired: false,
    },
    {
      id: '5',
      type: 'alert',
      title: 'Learning Session Reminder',
      message: 'Noah\'s scheduled learning session starts in 15 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
      priority: 'high',
      childName: 'Noah Johnson',
      actionRequired: false,
    },
    {
      id: '6',
      type: 'system',
      title: 'Platform Update Available',
      message: 'A new version of AIVO is available with enhanced AI features and performance improvements.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isRead: true,
      priority: 'low',
      actionRequired: false,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Award;
      case 'progress': return BookOpen;
      case 'suggestion': return Brain;
      case 'message': return MessageCircle;
      case 'system': return Settings;
      case 'alert': return AlertTriangle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'from-yellow-400 to-orange-500';
      case 'progress': return 'from-blue-400 to-blue-600';
      case 'suggestion': return 'from-purple-400 to-purple-600';
      case 'message': return 'from-green-400 to-green-600';
      case 'system': return 'from-gray-400 to-gray-600';
      case 'alert': return 'from-red-400 to-red-600';
      default: return 'from-coral-400 to-coral-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'achievements': return notification.type === 'achievement';
      case 'messages': return notification.type === 'message';
      case 'alerts': return notification.type === 'alert' || notification.priority === 'high';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with your children's learning progress and important updates
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 bg-white border-2 border-coral-200 text-coral-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-coral-50 hover:border-coral-300"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Read ({unreadCount})
            </button>
          )}
          
          <Link 
            to="/settings"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'achievement').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'message').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          {[
            { key: 'all', label: 'All Notifications' },
            { key: 'unread', label: 'Unread' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'messages', label: 'Messages' },
            { key: 'alerts', label: 'Alerts' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-coral-100 text-coral-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
          
          <div className="ml-auto text-sm text-gray-600">
            {filteredNotifications.length} notifications
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 hover:shadow-lg transition-all cursor-pointer ${
                !notification.isRead ? 'ring-2 ring-coral-200' : ''
              } ${getPriorityColor(notification.priority)} border-l-4`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getNotificationColor(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {notification.childName && (
                          <p className="text-sm text-coral-600 font-medium">
                            {notification.childName}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {notification.actionRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Action Required
                          </span>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          {new Date(notification.timestamp).toLocaleDateString()} {' '}
                          {new Date(notification.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {notification.actionRequired && (
                      <div className="mt-4 flex gap-3">
                        <button 
                          onClick={() => {
                            // Handle specific action based on notification type
                            switch(notification.type) {
                              case 'suggestion':
                                window.location.href = '/suggestions';
                                break;
                              case 'progress':
                                window.location.href = '/analytics';
                                break;
                              case 'message':
                                window.location.href = '/messages';
                                break;
                              default:
                                alert('Action completed!');
                            }
                          }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-700 border border-white/20"
                        >
                          Take Action
                        </button>
                        <button 
                          onClick={() => {
                            // Show detailed view or navigate to relevant page
                            alert(`Notification Details:\n\nType: ${notification.type}\nTime: ${notification.time}\nMessage: ${notification.message}`);
                          }}
                          className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:border-gray-300"
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-coral-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You're all caught up! New notifications will appear here."
              : `No ${filter} notifications to show.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
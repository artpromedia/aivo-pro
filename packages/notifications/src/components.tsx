/**
 * Notification Components
 */

import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotifications } from './hooks';
import type { Notification, NotificationType } from './manager';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
};

export interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

export function Toast({ notification, onClose }: ToastProps) {
  const Icon = iconMap[notification.type];
  const colors = colorMap[notification.type];

  return (
    <div
      className={`${colors.bg} ${colors.border} ${colors.text} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{notification.title}</h4>
          <p className="text-sm">{notification.message}</p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {notification.dismissible && (
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-75"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export function ToastContainer({ position = 'top-right', className = '' }: ToastContainerProps) {
  const { notifications, remove } = useNotifications();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2 ${className}`}>
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => remove(notification.id)}
        />
      ))}
    </div>
  );
}

export interface NotificationCenterProps {
  maxHeight?: string;
  className?: string;
}

export function NotificationCenter({ maxHeight = '400px', className = '' }: NotificationCenterProps) {
  const { notifications, remove, clear } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        No notifications
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <button
          onClick={clear}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Clear all
        </button>
      </div>
      
      <div style={{ maxHeight }} className="overflow-y-auto">
        {notifications.map(notification => {
          const Icon = iconMap[notification.type];
          const colors = colorMap[notification.type];

          return (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 ${colors.text}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  
                  {notification.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => remove(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

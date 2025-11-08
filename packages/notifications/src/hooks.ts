/**
 * Notification Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationManager, Notification } from './manager';

/**
 * Hook to use notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  const notify = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    return notificationManager.add(notification);
  }, []);

  const success = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return notificationManager.success(title, message, options);
  }, []);

  const error = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return notificationManager.error(title, message, options);
  }, []);

  const warning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return notificationManager.warning(title, message, options);
  }, []);

  const info = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return notificationManager.info(title, message, options);
  }, []);

  const remove = useCallback((id: string) => {
    notificationManager.remove(id);
  }, []);

  const clear = useCallback(() => {
    notificationManager.clear();
  }, []);

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  };
}

/**
 * Hook for simple toast notifications
 */
export function useToast() {
  const { success, error, warning, info } = useNotifications();

  return {
    success,
    error,
    warning,
    info,
  };
}

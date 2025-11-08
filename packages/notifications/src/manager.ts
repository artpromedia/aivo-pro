/**
 * Notification System - Store and Manager
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp?: Date;
}

type NotificationListener = (notifications: Notification[]) => void;

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private nextId = 1;

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.notifications);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  add(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = `notification-${this.nextId++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      dismissible: notification.dismissible ?? true,
    };

    this.notifications.push(newNotification);
    this.notify();

    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration || 5000);
    }

    return id;
  }

  remove(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.notify();
    }
  }

  clear(): void {
    this.notifications = [];
    this.notify();
  }

  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      type: 'error',
      title,
      message,
      duration: 0, // Don't auto-dismiss errors
      ...options,
    });
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }

  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.add({
      type: 'info',
      title,
      message,
      ...options,
    });
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getById(id: string): Notification | undefined {
    return this.notifications.find(n => n.id === id);
  }
}

export const notificationManager = new NotificationManager();
export { NotificationManager };

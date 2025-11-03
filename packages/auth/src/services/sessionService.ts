import { Session } from '../types/auth.types';
import { tokenService } from './tokenService';

interface SessionConfig {
  maxInactivityTime: number; // in milliseconds
  extendOnActivity: boolean;
  autoRefresh: boolean;
}

class SessionService {
  private session: Session | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private config: SessionConfig;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = {
      maxInactivityTime: 30 * 60 * 1000, // 30 minutes default
      extendOnActivity: true,
      autoRefresh: true,
      ...config,
    };

    // Set up activity listeners
    if (typeof window !== 'undefined') {
      this.setupActivityListeners();
    }
  }

  setSession(session: Session): void {
    this.session = session;
    this.updateLastActivity();
    this.startActivityTimer();
    this.scheduleTokenRefresh();
  }

  getSession(): Session | null {
    return this.session;
  }

  clearSession(): void {
    this.session = null;
    this.clearTimers();
    tokenService.clearTokens();
  }

  updateLastActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      
      if (this.config.extendOnActivity) {
        this.startActivityTimer();
      }
    }
  }

  isSessionValid(): boolean {
    if (!this.session) return false;

    const now = Date.now();
    const timeSinceActivity = now - this.session.lastActivity;
    const isWithinActivityWindow = timeSinceActivity < this.config.maxInactivityTime;
    const isNotExpired = now < this.session.expiresAt;

    return isWithinActivityWindow && isNotExpired;
  }

  getTimeUntilExpiry(): number {
    if (!this.session) return 0;
    
    const timeUntilTokenExpiry = this.session.expiresAt - Date.now();
    const timeUntilInactivityExpiry = 
      (this.session.lastActivity + this.config.maxInactivityTime) - Date.now();
    
    return Math.min(timeUntilTokenExpiry, timeUntilInactivityExpiry);
  }

  extendSession(additionalTime: number = 30 * 60 * 1000): void {
    if (this.session) {
      this.session.expiresAt = Math.max(
        this.session.expiresAt,
        Date.now() + additionalTime
      );
      this.updateLastActivity();
    }
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      this.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateLastActivity();
      }
    });
  }

  private startActivityTimer(): void {
    this.clearActivityTimer();
    
    this.activityTimer = setTimeout(() => {
      if (!this.isSessionValid()) {
        this.handleSessionExpiry();
      } else {
        this.startActivityTimer(); // Restart timer if session is still valid
      }
    }, 60000); // Check every minute
  }

  private scheduleTokenRefresh(): void {
    if (!this.config.autoRefresh || !this.session) return;

    this.clearRefreshTimer();
    
    const timeUntilRefresh = tokenService.getTimeUntilExpiry() - (10 * 60 * 1000); // 10 minutes before expiry
    
    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshTokens();
      }, timeUntilRefresh);
    }
  }

  private async refreshTokens(): Promise<void> {
    try {
      // This would typically call authService.refreshAccessToken()
      // For now, we'll just update the expiry time
      if (this.session) {
        this.session.expiresAt = Date.now() + (60 * 60 * 1000); // Extend by 1 hour
        this.scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleSessionExpiry();
    }
  }

  private handleSessionExpiry(): void {
    if (this.session) {
      // Emit session expired event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sessionExpired', {
          detail: { reason: 'inactivity' }
        }));
      }
      
      this.clearSession();
    }
  }

  private clearActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private clearTimers(): void {
    this.clearActivityTimer();
    this.clearRefreshTimer();
  }

  // Permission checking methods
  hasPermission(session: Session | null, permission: string): boolean {
    if (!session) return false;
    return session.permissions.includes(permission) || session.permissions.includes('*');
  }

  hasAnyPermission(session: Session | null, permissions: string[]): boolean {
    if (!session || !permissions.length) return false;
    return permissions.some(permission => this.hasPermission(session, permission));
  }

  hasAllPermissions(session: Session | null, permissions: string[]): boolean {
    if (!session || !permissions.length) return false;
    return permissions.every(permission => this.hasPermission(session, permission));
  }

  // Get session statistics
  getSessionStats() {
    if (!this.session) return null;

    const now = Date.now();
    const sessionDuration = now - (this.session.expiresAt - (60 * 60 * 1000)); // Assuming 1 hour tokens
    const timeSinceActivity = now - this.session.lastActivity;
    const timeUntilExpiry = this.getTimeUntilExpiry();

    return {
      sessionDuration,
      timeSinceActivity,
      timeUntilExpiry,
      isValid: this.isSessionValid(),
      user: this.session.user,
    };
  }
}

export const sessionService = new SessionService();

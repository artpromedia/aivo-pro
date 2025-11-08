export class ErrorReporter {
  private isOnline: boolean = navigator.onLine;
  private errorQueue: ErrorReport[] = [];
  private reportingEndpoint: string = '/api/v1/errors';
  
  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  async report(errorReport: Omit<ErrorReport, 'sessionId' | 'severity'>): Promise<void> {
    const fullReport: ErrorReport = {
      ...errorReport,
      sessionId: this.getSessionId(),
      severity: this.calculateSeverity(errorReport.error)
    };

    if (this.isOnline) {
      try {
        await this.sendReport(fullReport);
      } catch (sendError) {
        console.warn('Failed to send error report:', sendError);
        this.queueReport(fullReport);
      }
    } else {
      this.queueReport(fullReport);
    }

    // Log to console in development
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.error('Error Report:', fullReport);
    }
  }

  private async sendReport(report: ErrorReport): Promise<void> {
    const response = await fetch(this.reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthToken()
      },
      body: JSON.stringify(report)
    });

    if (!response.ok) {
      throw new Error(`Failed to send error report: ${response.status}`);
    }
  }

  private queueReport(report: ErrorReport): void {
    this.errorQueue.push(report);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('aivo_error_queue', JSON.stringify(this.errorQueue));
    } catch (error) {
      console.warn('Failed to persist error queue:', error);
    }
  }

  private handleOnline(): void {
    this.isOnline = true;
    this.flushErrorQueue();
  }

  private handleOffline(): void {
    this.isOnline = false;
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const reports = [...this.errorQueue];
    this.errorQueue = [];

    for (const report of reports) {
      try {
        await this.sendReport(report);
      } catch (error) {
        console.warn('Failed to send queued error report:', error);
        this.queueReport(report);
      }
    }

    // Update localStorage
    try {
      localStorage.setItem('aivo_error_queue', JSON.stringify(this.errorQueue));
    } catch (error) {
      console.warn('Failed to update error queue in localStorage:', error);
    }
  }

  private calculateSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (message.includes('chunk') || message.includes('network') || 
        message.includes('timeout') || message.includes('cors')) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity
    if (message.includes('cannot read') || message.includes('undefined') ||
        message.includes('null') || stack.includes('react')) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity
    if (message.includes('warning') || message.includes('deprecated')) {
      return ErrorSeverity.MEDIUM;
    }

    // Default to medium
    return ErrorSeverity.MEDIUM;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('aivo_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('aivo_session_id', sessionId);
    }
    return sessionId;
  }

  private getAuthToken(): string {
    return localStorage.getItem('aivo_auth_token') || '';
  }

  // Initialize from localStorage on startup
  initialize(): void {
    try {
      const stored = localStorage.getItem('aivo_error_queue');
      if (stored) {
        this.errorQueue = JSON.parse(stored);
        this.flushErrorQueue();
      }
    } catch (error) {
      console.warn('Failed to initialize error queue from localStorage:', error);
    }
  }

  // Get error statistics
  getStatistics(): { total: number; bySeverity: Record<string, number>; byPortal: Record<string, number> } {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: {} as Record<string, number>,
      byPortal: {} as Record<string, number>
    };

    this.errorQueue.forEach(report => {
      const severity = report.severity || ErrorSeverity.MEDIUM;
      const portal = report.portal || 'unknown';
      stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
      stats.byPortal[portal] = (stats.byPortal[portal] || 0) + 1;
    });

    return stats;
  }
}

// Import types from our types file
import { ErrorReport, ErrorSeverity } from '../types';
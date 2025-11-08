import { ErrorReport, ErrorSeverity } from '../types';

export interface LoggerConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  enableStorage: boolean;
  maxStoredErrors: number;
}

class ErrorLogger {
  private config: LoggerConfig = {
    enableConsole: true,
    enableRemote: true,
    enableStorage: true,
    maxStoredErrors: 50
  };

  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  async log(error: ErrorReport) {
    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(error);
    }

    // Local storage logging
    if (this.config.enableStorage) {
      this.logToStorage(error);
    }

    // Remote logging (could integrate with services like Sentry, LogRocket, etc.)
    if (this.config.enableRemote) {
      await this.logToRemote(error);
    }
  }

  private logToConsole(error: ErrorReport) {
    const level = this.getSeverityLevel(error.severity);
    const message = `[${error.portal}] ${error.error.message}`;
    
    switch (level) {
      case 'error':
        console.error(message, error);
        break;
      case 'warn':
        console.warn(message, error);
        break;
      default:
        console.log(message, error);
    }
  }

  private logToStorage(error: ErrorReport) {
    try {
      const key = 'aivo_error_logs';
      const existing = localStorage.getItem(key);
      const logs = existing ? JSON.parse(existing) : [];
      
      // Add new error
      logs.unshift({
        ...error,
        error: {
          message: error.error.message,
          stack: error.error.stack,
          name: error.error.name
        }
      });
      
      // Keep only the most recent errors
      if (logs.length > this.config.maxStoredErrors) {
        logs.splice(this.config.maxStoredErrors);
      }
      
      localStorage.setItem(key, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  private async logToRemote(error: ErrorReport) {
    try {
      // This would integrate with your error tracking service
      // For now, we'll just simulate the call
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...error,
          error: {
            message: error.error.message,
            stack: error.error.stack,
            name: error.error.name
          }
        })
      });
    } catch (e) {
      console.warn('Failed to send error to remote service:', e);
    }
  }

  private getSeverityLevel(severity?: ErrorSeverity): 'error' | 'warn' | 'log' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      default:
        return 'log';
    }
  }

  getStoredErrors(): ErrorReport[] {
    try {
      const existing = localStorage.getItem('aivo_error_logs');
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      console.warn('Failed to retrieve stored errors:', e);
      return [];
    }
  }

  clearStoredErrors() {
    try {
      localStorage.removeItem('aivo_error_logs');
    } catch (e) {
      console.warn('Failed to clear stored errors:', e);
    }
  }
}

export const errorLogger = new ErrorLogger();
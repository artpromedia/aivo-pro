import { Component, ErrorInfo, ReactNode, ComponentType } from 'react';
import { ErrorReporter } from '../reporting/ErrorReporter';
import { StateRecovery } from '../recovery/StateRecovery';
import { ErrorFallbackProps, ErrorReport, PortalName, RecoveryStatus } from '../types';
import { DefaultErrorFallback } from '../fallbacks/DefaultErrorFallback';

interface Props {
  children: ReactNode;
  portalName: string;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  recoveryStatus: RecoveryStatus;
  lastResetKeys?: Array<string | number>;
}

export class PortalErrorBoundary extends Component<Props, State> {
  private errorReporter = new ErrorReporter();
  private stateRecovery = new StateRecovery();
  private retryTimeout?: number;
  
  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      recoveryStatus: RecoveryStatus.IDLE,
      lastResetKeys: props.resetKeys
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      recoveryStatus: RecoveryStatus.IDLE
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // Reset error state if resetKeys changed
    if (props.resetOnPropsChange && props.resetKeys !== state.lastResetKeys) {
      return {
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
        recoveryStatus: RecoveryStatus.IDLE,
        lastResetKeys: props.resetKeys
      };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to console in development
    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.error('Portal Error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to monitoring service
    this.errorReporter.report({
      error,
      errorInfo,
      portal: this.props.portalName,
      userId: this.getCurrentUserId(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
      context: {
        portalName: this.props.portalName,
        isolate: this.props.isolate,
        resetKeys: this.props.resetKeys
      }
    });

    // Attempt automatic recovery for critical errors
    if (this.isCriticalError(error)) {
      this.attemptRecovery(error);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private isCriticalError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('chunk') ||
      message.includes('network') ||
      message.includes('loading') ||
      message.includes('timeout')
    );
  }

  private attemptRecovery = async (error: Error) => {
    this.setState({ recoveryStatus: RecoveryStatus.RECOVERING });
    
    try {
      const recovered = await this.stateRecovery.attemptRecovery(error);
      
      if (recovered) {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          recoveryStatus: RecoveryStatus.SUCCESS
        });
        
        // Reset after a short delay
        setTimeout(() => {
          this.setState({ recoveryStatus: RecoveryStatus.IDLE });
        }, 1000);
      } else {
        this.setState({ recoveryStatus: RecoveryStatus.FAILED });
      }
    } catch (recoveryError) {
      console.warn('Recovery attempt failed:', recoveryError);
      this.setState({ recoveryStatus: RecoveryStatus.FAILED });
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount >= 3) {
      // Too many retries, suggest reset
      this.handleReset();
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      recoveryStatus: RecoveryStatus.IDLE
    }));

    // Auto-retry with delay for network errors
    if (this.state.error?.message.includes('Network')) {
      this.retryTimeout = setTimeout(() => {
        if (this.state.hasError) {
          this.attemptRecovery(this.state.error!);
        }
      }, 2000);
    }
  };

  private handleReset = () => {
    // Clear all state and reload
    this.stateRecovery.clearAll();
    
    // If in iframe or embedded, notify parent
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'aivo:error-reset',
        portal: this.props.portalName
      }, '*');
    }
    
    window.location.reload();
  };

  private getCurrentUserId(): string | undefined {
    try {
      const userStr = localStorage.getItem('aivo_user_profile');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      // Ignore
    }
    return undefined;
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          recovering={this.state.recoveryStatus === RecoveryStatus.RECOVERING}
          portalName={this.props.portalName}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}
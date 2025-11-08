import { ErrorInfo as ReactErrorInfo } from 'react';

// Error types and interfaces
export interface ErrorReport {
  error: Error;
  errorInfo?: ReactErrorInfo;
  portal: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  retryCount: number;
  severity?: ErrorSeverity;
  context: Record<string, any>;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo?: ReactErrorInfo | null;
  onRetry: () => void;
  onReset: () => void;
  recovering: boolean;
  portalName: string;
  retryCount?: number;
}

export interface RecoveryStrategy {
  name: string;
  condition: (error: Error) => boolean;
  action: (error: Error) => Promise<boolean>;
}

// Portal names enum
export enum PortalName {
  WEB = 'web',
  PARENT_PORTAL = 'parent-portal',
  TEACHER_PORTAL = 'teacher-portal',
  LEARNER_APP = 'learner-app',
  DISTRICT_PORTAL = 'district-portal',
  SUPER_ADMIN = 'super-admin',
  BASELINE_ASSESSMENT = 'baseline-assessment',
  MODEL_CLONING = 'model-cloning',
  MOBILE = 'mobile'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Recovery status
export enum RecoveryStatus {
  IDLE = 'idle',
  RECOVERING = 'recovering',
  SUCCESS = 'success',
  FAILED = 'failed'
}
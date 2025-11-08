/**
 * AIVO Agent Services - TypeScript Type Definitions
 * 
 * This file contains type definitions for all AIVO agent services,
 * enabling type-safe integration from frontend applications.
 */

// ============================================================================
// TRAINING & ALIGNMENT AGENT (Port 8009)
// ============================================================================

export type GovernanceRule =
  | 'no_harmful_content'
  | 'age_appropriate'
  | 'bias_mitigation'
  | 'privacy_preserving'
  | 'explainable_decisions'
  | 'educational_alignment';

export interface AlignmentValidationRequest {
  model_id: string;
  output: string;
  context: Record<string, any>;
  rules?: GovernanceRule[];
}

export interface AlignmentValidationResponse {
  compliant: boolean;
  model_id: string;
  validations: Record<GovernanceRule, boolean>;
  violations: string[];
  recommendations: string[];
  timestamp: string;
}

export interface BiasMetrics {
  gender_bias: number; // 0-1
  racial_bias: number; // 0-1
  disability_bias: number; // 0-1
  socioeconomic_bias: number; // 0-1
  overall_bias_score: number; // 0-1
}

export interface BiasCheckRequest {
  model_id: string;
  output: string;
  context?: Record<string, any>;
}

export interface BiasCheckResponse {
  bias_detected: boolean;
  metrics: BiasMetrics;
  threshold: number;
  mitigation_strategy?: string;
}

export interface TrainingRequest {
  model_id: string;
  reason: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  data_sources?: string[];
  hyperparameters?: Record<string, any>;
}

export interface TrainingResponse {
  job_id: string;
  model_id: string;
  status: string;
  estimated_completion: string;
  priority: string;
}

export interface DriftCheckRequest {
  model_id: string;
  evaluation_window_days?: number; // 1-90
}

export interface DriftResponse {
  model_id: string;
  drift_score: number;
  threshold: number;
  drift_detected: boolean;
  degradation_percentage: number;
  recommendation: string;
  last_training_date: string;
}

export interface GovernanceReport {
  compliance_score: number;
  bias_metrics: BiasMetrics;
  alignment_checks_passed: number;
  violations_caught: number;
  models_monitored: number;
  models_retrained: number;
  last_audit: string;
  recommendations: string[];
}

// ============================================================================
// LANGUAGE TRANSLATOR AGENT (Port 8010)
// ============================================================================

export type TranslationContext =
  | 'general'
  | 'iep'
  | 'math'
  | 'reading'
  | 'writing'
  | 'science'
  | 'assessment'
  | 'interface';

export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
  context?: TranslationContext;
}

export interface TranslationResponse {
  original: string;
  translated: string;
  source_lang: string;
  target_lang: string;
  confidence: number;
  rtl: boolean;
}

export interface BatchTranslationItem {
  text: string;
  source: string;
  target: string;
  context?: string;
}

export interface BatchTranslationRequest {
  items: BatchTranslationItem[];
}

export interface BatchTranslationResponse {
  translations: TranslationResponse[];
}

export interface SupportedLanguagesResponse {
  languages: Record<string, string>;
  total: number;
  rtl_languages: string[];
}

export interface AudioTranslationRequest {
  text: string;
  language: string;
  voice?: 'male' | 'female' | 'neutral';
  speed?: number; // 0.5 - 2.0
  format?: 'mp3' | 'wav' | 'ogg';
}

export interface AudioTranslationResponse {
  audio_url: string;
  duration_seconds: number;
  format: string;
  size_bytes: number;
}

// ============================================================================
// BUSINESS MODEL AGENT (Port 8011)
// ============================================================================

export type SubscriptionPlan =
  | 'parent_single'
  | 'parent_family'
  | 'district_small'
  | 'district_medium'
  | 'district_enterprise';

export interface SubscriptionRequest {
  user_id: string;
  plan: SubscriptionPlan;
  payment_method: string;
}

export interface SubscriptionResponse {
  subscription_id: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled';
  trial_days_remaining?: number;
  current_period_end: string;
  plan: SubscriptionPlan;
}

export interface UpgradeRequest {
  subscription_id: string;
  new_plan: SubscriptionPlan;
}

export interface UpgradeResponse {
  subscription_id: string;
  new_plan: SubscriptionPlan;
  proration: number;
  effective_date: string;
}

export interface CancelRequest {
  subscription_id: string;
  reason: string;
  user_id: string;
}

export interface ChurnPrediction {
  user_id: string;
  churn_score: number; // 0-1
  risk_level: 'low' | 'medium' | 'high';
  interventions: RetentionIntervention[];
}

export interface RetentionIntervention {
  type: 'discount' | 'support' | 'education';
  value: any;
  expected_impact: number;
}

export interface LicenseAllocationRequest {
  district_id: string;
  count: number;
}

export interface LicenseUsageResponse {
  district_id: string;
  total_licenses: number;
  active_licenses: number;
  utilization_rate: number;
  inactive_licenses: number;
  recommendations: string[];
}

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  arpu: number; // Average Revenue Per User
  churn_rate: number;
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
  ltv_cac_ratio: number;
}

// ============================================================================
// NOTIFICATION AGENT (Port 8012)
// ============================================================================

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type NotificationType =
  | 'welcome'
  | 'learning_reminder'
  | 'progress_update'
  | 'iep_goal_achieved'
  | 'subscription_renewal'
  | 'system_alert'
  | 'feature_announcement';

export interface NotificationRequest {
  user_id: string;
  type: NotificationType;
  data: Record<string, any>;
  channels?: NotificationChannel[];
}

export interface NotificationResponse {
  email?: {
    channel: 'email';
    status: 'sent' | 'failed' | 'skipped';
    message_id?: string;
  };
  sms?: {
    channel: 'sms';
    status: 'sent' | 'failed' | 'skipped';
    message_sid?: string;
  };
  push?: {
    channel: 'push';
    status: 'sent' | 'failed' | 'skipped';
    success_count?: number;
    failure_count?: number;
  };
  in_app?: {
    channel: 'in_app';
    status: 'sent';
  };
}

export interface BatchNotificationRequest {
  user_ids: string[];
  type: NotificationType;
  data: Record<string, any>;
}

export interface BatchNotificationResponse {
  total: number;
  sent: number;
  failed: number;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours?: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

export interface ScheduleNotificationRequest {
  type: NotificationType;
  user_id: string;
  schedule: string; // cron expression
  channels: NotificationChannel[];
}

// ============================================================================
// ANALYTICS & INSIGHTS AGENT (Port 8013)
// ============================================================================

export interface PlatformKPIs {
  total_users: number;
  active_learners: number;
  learning_hours: number;
  iep_goals_achieved: number;
  platform_efficiency: number;
}

export interface TrendData {
  metric: string;
  period: 'daily' | 'weekly' | 'monthly';
  data: Array<{
    date: string;
    value: number;
  }>;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
}

export interface PredictionData {
  metric: string;
  predicted_value: number;
  confidence: number;
  date: string;
}

export interface AnalyticsDashboard {
  kpis: PlatformKPIs;
  trends: TrendData[];
  predictions: PredictionData[];
  recommendations: string[];
}

export interface LearningEffectiveness {
  mastery_rates: Record<string, number>;
  time_to_mastery: Record<string, number>;
  engagement_metrics: {
    avg_session_duration: number;
    sessions_per_week: number;
    completion_rate: number;
  };
  disability_performance: Record<string, {
    mastery_rate: number;
    avg_time: number;
  }>;
}

export interface EngagementMetrics {
  dau: number; // Daily Active Users
  wau: number; // Weekly Active Users
  mau: number; // Monthly Active Users
  retention_rate: number;
  session_metrics: {
    avg_duration: number;
    avg_sessions_per_user: number;
    bounce_rate: number;
  };
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ServiceHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, 'operational' | 'degraded' | 'down'>;
  timestamp: string;
}

export interface ErrorResponse {
  detail: string;
  status_code: number;
  timestamp: string;
}

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

export interface AgentServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  apiKey?: string;
}

export const AGENT_SERVICE_PORTS = {
  AIVO_BRAIN: 8001,
  BASELINE_ASSESSMENT: 8002,
  MODEL_CLONING: 8003,
  LEARNING_SESSION: 8004,
  FOCUS_MONITOR: 8005,
  HOMEWORK_HELPER: 8006,
  IEP_ASSISTANT: 8007,
  DISTRICT_DETECTION: 8008,
  TRAINING_ALIGNMENT: 8009,
  TRANSLATOR: 8010,
  BUSINESS_MODEL: 8011,
  NOTIFICATION: 8012,
  ANALYTICS_INSIGHTS: 8013,
  SAFETY_MODERATION: 8014,
  MODEL_MONITOR: 8015,
} as const;

export type AgentServiceName = keyof typeof AGENT_SERVICE_PORTS;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getServiceUrl(
  service: AgentServiceName,
  baseHost: string = 'localhost'
): string {
  const port = AGENT_SERVICE_PORTS[service];
  return `http://${baseHost}:${port}`;
}

export function isRTLLanguage(languageCode: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode);
}

export function formatBiasScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

export function getBiasLevel(score: number): 'low' | 'medium' | 'high' {
  if (score < 0.05) return 'low';
  if (score < 0.10) return 'medium';
  return 'high';
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

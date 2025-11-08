// Core platform types for Super Admin
export interface PlatformMetrics {
  revenue: {
    mrr: number;
    growth: number;
    total: number;
  };
  districts: {
    total: number;
    active: number;
    growth: number;
  };
  users: {
    total: number;
    activeDaily: number;
    activeMonthly: number;
    growth: number;
  };
  ai: {
    totalModels: number;
    accuracy: number;
    requestsToday: number;
    costToday: number;
  };
  system: {
    uptime: number;
    cpu: number;
    memory: number;
    latency: number;
  };
  support: {
    openTickets: number;
    critical: number;
    avgResponseTime: number;
    satisfaction: number;
  };
  api: {
    dailyCalls: number;
    growth: number;
    errorRate: number;
  };
  security: {
    score: number;
    threats: number;
    incidents: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'google' | 'anthropic' | 'meta' | 'custom';
  status: 'active' | 'degraded' | 'down' | 'standby';
  models: AIModel[];
  pricing: PricingTier;
  performance: PerformanceMetrics;
  failoverPriority: number;
  costToday: number;
  requestsToday: number;
  lastHealthCheck: Date;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  capabilities: string[];
  costPerToken: number;
  latency: number;
  accuracy: number;
}

export interface PricingTier {
  inputCost: number;
  outputCost: number;
  currency: 'USD';
  unit: 'per_1k_tokens' | 'per_request';
}

export interface PerformanceMetrics {
  latency: number;
  throughput: number;
  errorRate: number;
  availability: number;
}

export interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  component: string;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'acknowledge' | 'resolve' | 'escalate' | 'investigate';
  url?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  conditions?: Record<string, any>;
}

export interface EnterpriseClient {
  id: string;
  name: string;
  type: 'district' | 'school' | 'organization';
  status: 'active' | 'trial' | 'suspended' | 'terminated';
  licenseType: 'starter' | 'professional' | 'enterprise' | 'custom';
  seatCount: number;
  billing: BillingInfo;
  onboardingStatus: 'pending' | 'in-progress' | 'completed';
  supportTier: 'basic' | 'premium' | 'enterprise';
  customizations: ClientCustomization[];
}

export interface BillingInfo {
  plan: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  nextBilling: Date;
  status: 'active' | 'past_due' | 'cancelled';
}

export interface ClientCustomization {
  type: 'branding' | 'features' | 'integrations';
  config: Record<string, any>;
  enabled: boolean;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  client: string;
  assignee?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  responseTime?: number;
  resolutionTime?: number;
}

export interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'pending';
  score: number;
  lastAudit: Date;
  nextAudit: Date;
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'met' | 'partial' | 'not-met';
  evidence: string[];
  responsible: string;
}

export interface SystemResource {
  id: string;
  type: 'server' | 'database' | 'storage' | 'cdn';
  name: string;
  region: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  metrics: ResourceMetrics;
  cost: number;
  scalingPolicy?: ScalingPolicy;
}

export interface ResourceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
}

export interface ScalingPolicy {
  enabled: boolean;
  minInstances: number;
  maxInstances: number;
  targetMetric: 'cpu' | 'memory' | 'requests';
  threshold: number;
}

export interface APIEndpoint {
  id: string;
  path: string;
  method: string;
  status: 'active' | 'deprecated' | 'disabled';
  rateLimit: RateLimit;
  authentication: 'none' | 'api-key' | 'oauth' | 'jwt';
  usage: EndpointUsage;
}

export interface RateLimit {
  requests: number;
  window: number; // seconds
  burst: number;
}

export interface EndpointUsage {
  requestsToday: number;
  responseTime: number;
  errorRate: number;
  topClients: string[];
}
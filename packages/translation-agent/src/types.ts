import { z } from 'zod';

// Translation validation schemas
export const TranslationKeySchema = z.object({
  key: z.string(),
  value: z.string(),
  context: z.string().optional(),
  variables: z.array(z.string()).optional(),
  pluralization: z.boolean().optional(),
});

export const LocaleDataSchema = z.object({
  locale: z.string(),
  translations: z.record(z.any()),
  metadata: z.object({
    totalKeys: z.number(),
    coverage: z.number(),
    lastUpdated: z.string(),
  }).optional(),
});

export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(z.object({
    type: z.enum(['missing', 'syntax', 'grammar', 'cultural', 'consistency', 'formatting']),
    severity: z.enum(['error', 'warning', 'info']),
    key: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
  })),
  qualityScore: z.number().min(0).max(100),
});

export const TranslationSuggestionSchema = z.object({
  key: z.string(),
  locale: z.string(),
  currentValue: z.string(),
  suggestedValue: z.string(),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  aiModel: z.string(),
});

export const TranslationMetricsSchema = z.object({
  locale: z.string(),
  totalKeys: z.number(),
  translatedKeys: z.number(),
  coverage: z.number(),
  qualityScore: z.number(),
  lastValidated: z.string(),
  issues: z.number(),
});

// Types
export type TranslationKey = z.infer<typeof TranslationKeySchema>;
export type LocaleData = z.infer<typeof LocaleDataSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type TranslationSuggestion = z.infer<typeof TranslationSuggestionSchema>;
export type TranslationMetrics = z.infer<typeof TranslationMetricsSchema>;

export interface TranslationIssue {
  type: 'missing' | 'syntax' | 'grammar' | 'cultural' | 'consistency' | 'formatting';
  severity: 'error' | 'warning' | 'info';
  key: string;
  message: string;
  suggestion?: string;
}

export interface AITranslationConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: 'openai' | 'anthropic' | 'azure';
}

export interface TranslationContext {
  feature: string;
  userRole?: string;
  platform?: string;
  tone?: 'formal' | 'informal' | 'technical';
}

export interface TranslationEntry {
  key: string;
  value: string;
  locale: string;
  context?: string;
  variables?: string[];
}

export interface TranslationValidationResult {
  key: string;
  locale: string;
  isValid: boolean;
  score: number; // 0-100
  issues: TranslationIssue[];
  suggestions?: string[];
}

export type IssueType =
  | 'missing-variable'
  | 'extra-variable'
  | 'grammar'
  | 'tone'
  | 'length'
  | 'cultural'
  | 'context'
  | 'inconsistency'
  | 'formality'
  | 'rtl';

export type IssueSeverity = 'error' | 'warning' | 'info';

export interface TranslationQualityReport {
  locale: string;
  totalKeys: number;
  validatedKeys: number;
  averageScore: number;
  issuesByType: Record<IssueType, number>;
  issuesBySeverity: Record<IssueSeverity, number>;
  suggestions: TranslationSuggestion[];
}

export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  formalityLevel: 'informal' | 'neutral' | 'formal';
  culturalContext?: string[];
}

export interface AITranslationOptions {
  model?: string;
  temperature?: number;
  preserveVariables?: boolean;
  maintainTone?: boolean;
  culturalAdaptation?: boolean;
}

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

// ============================================================================
// TRANSLATOR SERVICE INTEGRATION TYPES
// ============================================================================

/**
 * Translation request to Translator Service (Port 8010)
 */
export interface TranslatorServiceRequest {
  text: string;
  source_lang: string;
  target_lang: string;
  context?: 'general' | 'iep' | 'math' | 'interface' | 'assessment';
}

/**
 * Translation response from Translator Service
 */
export interface TranslatorServiceResponse {
  original: string;
  translated: string;
  source_lang: string;
  target_lang: string;
  confidence: number;
  rtl: boolean;
}

/**
 * Batch translation request
 */
export interface BatchTranslationRequest {
  items: Array<{
    text: string;
    source: string;
    target: string;
    context?: string;
  }>;
}

/**
 * Batch translation response
 */
export interface BatchTranslationResponse {
  translations: TranslatorServiceResponse[];
}

/**
 * Document translation request (IEP, reports, etc.)
 */
export interface DocumentTranslationRequest {
  document_id: string;
  document: any; // structured document
  source_lang: string;
  target_lang: string;
  output_format?: 'json' | 'pdf' | 'docx';
}

/**
 * Supported languages
 */
export interface SupportedLanguagesResponse {
  languages: Record<string, string>;
  total: number;
  rtl_languages: string[];
}

/**
 * Supported languages with metadata
 */
export const SUPPORTED_LANGUAGES = {
  // Major Languages
  en: { name: 'English', native: 'English', rtl: false, family: 'major' },
  es: { name: 'Spanish', native: 'Español', rtl: false, family: 'major' },
  fr: { name: 'French', native: 'Français', rtl: false, family: 'major' },
  de: { name: 'German', native: 'Deutsch', rtl: false, family: 'major' },
  zh: { name: 'Chinese', native: '中文', rtl: false, family: 'major' },
  ar: { name: 'Arabic', native: 'العربية', rtl: true, family: 'major' },
  hi: { name: 'Hindi', native: 'हिन्दी', rtl: false, family: 'major' },
  
  // European Languages
  it: { name: 'Italian', native: 'Italiano', rtl: false, family: 'european' },
  pt: { name: 'Portuguese', native: 'Português', rtl: false, family: 'european' },
  ru: { name: 'Russian', native: 'Русский', rtl: false, family: 'european' },
  pl: { name: 'Polish', native: 'Polski', rtl: false, family: 'european' },
  nl: { name: 'Dutch', native: 'Nederlands', rtl: false, family: 'european' },
  sv: { name: 'Swedish', native: 'Svenska', rtl: false, family: 'european' },
  
  // Asian Languages
  ja: { name: 'Japanese', native: '日本語', rtl: false, family: 'asian' },
  ko: { name: 'Korean', native: '한국어', rtl: false, family: 'asian' },
  vi: { name: 'Vietnamese', native: 'Tiếng Việt', rtl: false, family: 'asian' },
  th: { name: 'Thai', native: 'ไทย', rtl: false, family: 'asian' },
  id: { name: 'Indonesian', native: 'Bahasa Indonesia', rtl: false, family: 'asian' },
  ms: { name: 'Malay', native: 'Bahasa Melayu', rtl: false, family: 'asian' },
  
  // RTL Languages
  he: { name: 'Hebrew', native: 'עברית', rtl: true, family: 'rtl' },
  fa: { name: 'Persian', native: 'فارسی', rtl: true, family: 'rtl' },
  ur: { name: 'Urdu', native: 'اردو', rtl: true, family: 'rtl' },
  
  // African Languages
  sw: { name: 'Swahili', native: 'Kiswahili', rtl: false, family: 'african' },
  yo: { name: 'Yoruba', native: 'Yorùbá', rtl: false, family: 'african' },
  zu: { name: 'Zulu', native: 'isiZulu', rtl: false, family: 'african' },
  am: { name: 'Amharic', native: 'አማርኛ', rtl: false, family: 'african' },
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Education-specific terminology context
 */
export interface EducationTerminology {
  term: string;
  category: 'iep' | 'disability' | 'assessment' | 'curriculum' | 'behavioral';
  translations: Record<string, string>;
  definition?: string;
}

/**
 * Common IEP terminology
 */
export const IEP_TERMINOLOGY: Record<string, EducationTerminology> = {
  'iep': {
    term: 'IEP',
    category: 'iep',
    translations: {
      es: 'PEI (Programa Educativo Individualizado)',
      fr: 'PEI (Programme Éducatif Individualisé)',
      de: 'IEP (Individueller Bildungsplan)',
      zh: 'IEP (个性化教育计划)',
      ar: 'IEP (برنامج التعليم الفردي)',
    },
    definition: 'Individualized Education Program',
  },
  '504_plan': {
    term: '504 Plan',
    category: 'iep',
    translations: {
      es: 'Plan 504',
      fr: 'Plan 504',
      de: '504-Plan',
      zh: '504计划',
      ar: 'خطة 504',
    },
    definition: 'Section 504 accommodation plan',
  },
  'accommodation': {
    term: 'Accommodation',
    category: 'iep',
    translations: {
      es: 'Adaptación',
      fr: 'Aménagement',
      de: 'Anpassung',
      zh: '调整',
      ar: 'تكييف',
    },
  },
  'modification': {
    term: 'Modification',
    category: 'iep',
    translations: {
      es: 'Modificación',
      fr: 'Modification',
      de: 'Modifikation',
      zh: '修改',
      ar: 'تعديل',
    },
  },
};

/**
 * Translation context types for education
 */
export type EducationContext =
  | 'general'
  | 'iep'
  | 'math'
  | 'reading'
  | 'writing'
  | 'science'
  | 'social_studies'
  | 'behavioral'
  | 'assessment'
  | 'progress_report'
  | 'parent_communication'
  | 'teacher_notes'
  | 'interface';

/**
 * Audio translation request
 */
export interface AudioTranslationRequest {
  text: string;
  language: string;
  voice?: 'male' | 'female' | 'neutral';
  speed?: number; // 0.5 - 2.0
  format?: 'mp3' | 'wav' | 'ogg';
}

/**
 * Audio translation response
 */
export interface AudioTranslationResponse {
  audio_url: string;
  duration_seconds: number;
  format: string;
  size_bytes: number;
}

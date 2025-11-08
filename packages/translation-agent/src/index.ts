// Export all public APIs
export { AITranslationService } from './ai-service';
export { TranslationValidator } from './validator';
export { TranslationManager } from './manager';
export { AITranslationAgent } from './ai-agent';
export { TranslationReporter } from './reporter';
export { SUPPORTED_LOCALES } from './locales';

export type {
  TranslationKey,
  LocaleData,
  ValidationResult,
  TranslationSuggestion,
  TranslationMetrics,
  TranslationIssue,
  AITranslationConfig,
  TranslationContext,
  TranslationEntry,
  TranslationValidationResult,
  IssueType,
  IssueSeverity,
  TranslationQualityReport,
  LocaleConfig,
  AITranslationOptions,
} from './types';

export {
  TranslationKeySchema,
  LocaleDataSchema,
  ValidationResultSchema,
  TranslationSuggestionSchema,
  TranslationMetricsSchema,
} from './types';

// Re-export utilities
export {
  parseTranslationFiles,
  loadTranslations,
  flattenTranslations,
  extractVariables,
  findMissingKeys,
  findExtraKeys,
  calculateCoverage,
} from './utils';

import type {
  LocaleData,
  ValidationResult,
  TranslationIssue,
  TranslationMetrics,
} from './types';

type TranslationTree = Record<string, unknown>;
const isTranslationRecord = (value: unknown): value is TranslationTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export class TranslationValidator {
  /**
   * Validate a locale's translations against reference locale
   */
  validateLocale(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): ValidationResult {
    const issues: TranslationIssue[] = [];

    // Flatten both objects for comparison
    const referenceFlat = this.flattenObject(referenceLocale.translations);
    const localeFlat = this.flattenObject(localeData.translations);

    // Check for missing keys
    for (const key of Object.keys(referenceFlat)) {
      if (!localeFlat[key]) {
        issues.push({
          type: 'missing',
          severity: 'error',
          key,
          message: `Missing translation for key: ${key}`,
          suggestion: `Add translation for "${referenceFlat[key]}"`,
        });
      }
    }

    // Check for extra keys (not in reference)
    for (const key of Object.keys(localeFlat)) {
      if (!referenceFlat[key]) {
        issues.push({
          type: 'consistency',
          severity: 'warning',
          key,
          message: `Extra key not in reference locale: ${key}`,
          suggestion: 'Remove this key or add it to reference locale',
        });
      }
    }

    // Validate variable placeholders
    for (const key of Object.keys(referenceFlat)) {
      if (localeFlat[key]) {
        const refVars = this.extractVariables(referenceFlat[key]);
        const localeVars = this.extractVariables(localeFlat[key]);

        if (!this.arraysEqual(refVars, localeVars)) {
          issues.push({
            type: 'syntax',
            severity: 'error',
            key,
            message: `Variable mismatch in ${key}. Expected: {${refVars.join(', ')}} Got: {${localeVars.join(', ')}}`,
            suggestion: `Ensure all variables ${refVars.map((v) => `{${v}}`).join(', ')} are present`,
          });
        }
      }
    }

    // Check for empty translations
    for (const [key, value] of Object.entries(localeFlat)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        issues.push({
          type: 'missing',
          severity: 'error',
          key,
          message: `Empty translation for key: ${key}`,
          suggestion: 'Provide a translation value',
        });
      }
    }

    // Check formatting consistency (punctuation)
    for (const key of Object.keys(referenceFlat)) {
      if (localeFlat[key]) {
        const refEnding = this.getEnding(referenceFlat[key]);
        const localeEnding = this.getEnding(localeFlat[key]);

        if (
          refEnding &&
          localeEnding &&
          this.isPunctuation(refEnding) &&
          refEnding !== localeEnding
        ) {
          issues.push({
            type: 'formatting',
            severity: 'info',
            key,
            message: `Punctuation mismatch in ${key}. Reference ends with "${refEnding}", translation ends with "${localeEnding}"`,
            suggestion: `Consider ending with "${refEnding}" for consistency`,
          });
        }
      }
    }

    const qualityScore = this.calculateQualityScore(issues, localeFlat, referenceFlat);

    return {
      isValid: issues.filter((i) => i.severity === 'error').length === 0,
      issues,
      qualityScore,
    };
  }

  /**
   * Calculate translation coverage percentage
   */
  calculateCoverage(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): number {
    const referenceKeys = Object.keys(this.flattenObject(referenceLocale.translations));
    const localeKeys = Object.keys(this.flattenObject(localeData.translations));

    const translatedKeys = referenceKeys.filter((key) =>
      localeKeys.includes(key)
    ).length;

    return (translatedKeys / referenceKeys.length) * 100;
  }

  /**
   * Get metrics for a locale
   */
  getMetrics(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): TranslationMetrics {
    const validation = this.validateLocale(localeData, referenceLocale);
    const referenceFlat = this.flattenObject(referenceLocale.translations);
    const localeFlat = this.flattenObject(localeData.translations);

    const totalKeys = Object.keys(referenceFlat).length;
    const translatedKeys = Object.keys(referenceFlat).filter(
      (key) => localeFlat[key]
    ).length;

    return {
      locale: localeData.locale,
      totalKeys,
      translatedKeys,
      coverage: (translatedKeys / totalKeys) * 100,
      qualityScore: validation.qualityScore,
      lastValidated: new Date().toISOString(),
      issues: validation.issues.filter((i: TranslationIssue) => i.severity === 'error').length,
    };
  }

  /**
   * Find missing keys in target locale
   */
  findMissingKeys(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): string[] {
    const referenceKeys = Object.keys(this.flattenObject(referenceLocale.translations));
    const localeKeys = Object.keys(this.flattenObject(localeData.translations));

    return referenceKeys.filter((key) => !localeKeys.includes(key));
  }

  /**
   * Check consistency across all locales
   */
  checkConsistency(locales: LocaleData[]): {
    consistent: boolean;
    discrepancies: Array<{
      locale: string;
      missingKeys: string[];
      extraKeys: string[];
    }>;
  } {
    if (locales.length === 0) {
      return { consistent: true, discrepancies: [] };
    }

    const referenceKeys = Object.keys(
      this.flattenObject(locales[0].translations)
    );
    const discrepancies: Array<{
      locale: string;
      missingKeys: string[];
      extraKeys: string[];
    }> = [];

    for (let i = 1; i < locales.length; i++) {
      const localeKeys = Object.keys(this.flattenObject(locales[i].translations));

      const missingKeys = referenceKeys.filter(
        (key) => !localeKeys.includes(key)
      );
      const extraKeys = localeKeys.filter(
        (key) => !referenceKeys.includes(key)
      );

      if (missingKeys.length > 0 || extraKeys.length > 0) {
        discrepancies.push({
          locale: locales[i].locale,
          missingKeys,
          extraKeys,
        });
      }
    }

    return {
      consistent: discrepancies.length === 0,
      discrepancies,
    };
  }

  // Helper methods
  private flattenObject(
    obj: TranslationTree,
    prefix = ''
  ): Record<string, string> {
    return Object.entries(obj).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (isTranslationRecord(value)) {
          Object.assign(acc, this.flattenObject(value, newKey));
        } else {
          acc[newKey] = String(value);
        }
        return acc;
      },
      {}
    );
  }

  private extractVariables(text: string): string[] {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map((m) => m.slice(1, -1)) : [];
  }

  private arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  }

  private getEnding(text: string): string {
    return text.trim().slice(-1);
  }

  private isPunctuation(char: string): boolean {
    return /[.!?;:,]/.test(char);
  }

  private calculateQualityScore(
    issues: TranslationIssue[],
    localeFlat: Record<string, string>,
    referenceFlat: Record<string, string>
  ): number {
    const totalKeys = Object.keys(referenceFlat).length;
    const errors = issues.filter((i) => i.severity === 'error').length;
    const warnings = issues.filter((i) => i.severity === 'warning').length;

    // Start with 100 and deduct points
    let score = 100;

    // Deduct more for errors than warnings
    score -= (errors / totalKeys) * 50; // Up to 50 points for errors
    score -= (warnings / totalKeys) * 30; // Up to 30 points for warnings

    return Math.max(0, Math.round(score));
  }
}

import type { LocaleData, TranslationMetrics } from './types';
import { TranslationValidator } from './validator';

type TranslationTree = Record<string, unknown>;
const isTranslationRecord = (value: unknown): value is TranslationTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export class TranslationManager {
  private validator: TranslationValidator;
  private locales: Map<string, LocaleData>;
  private referenceLocale: string;

  constructor(referenceLocale = 'en') {
    this.validator = new TranslationValidator();
    this.locales = new Map();
    this.referenceLocale = referenceLocale;
  }

  /**
   * Register a locale with its translations
   */
  registerLocale(locale: string, translations: TranslationTree): void {
    this.locales.set(locale, {
      locale,
      translations,
      metadata: {
        totalKeys: Object.keys(this.flattenObject(translations)).length,
        coverage: 100,
        lastUpdated: new Date().toISOString(),
      },
    });
  }

  /**
   * Get all registered locales
   */
  getLocales(): string[] {
    return Array.from(this.locales.keys());
  }

  /**
   * Get metrics for all locales
   */
  getAllMetrics(): TranslationMetrics[] {
    const reference = this.locales.get(this.referenceLocale);
    if (!reference) {
      throw new Error(`Reference locale ${this.referenceLocale} not found`);
    }

    const metrics: TranslationMetrics[] = [];

    for (const [locale, data] of this.locales.entries()) {
      if (locale === this.referenceLocale) {
        // Reference locale always has 100% coverage
        metrics.push({
          locale,
          totalKeys: data.metadata!.totalKeys,
          translatedKeys: data.metadata!.totalKeys,
          coverage: 100,
          qualityScore: 100,
          lastValidated: new Date().toISOString(),
          issues: 0,
        });
      } else {
        metrics.push(this.validator.getMetrics(data, reference));
      }
    }

    return metrics;
  }

  /**
   * Validate all locales
   */
  validateAll(): Record<
    string,
    {
      isValid: boolean;
      coverage: number;
      qualityScore: number;
      issueCount: number;
    }
  > {
    const reference = this.locales.get(this.referenceLocale);
    if (!reference) {
      throw new Error(`Reference locale ${this.referenceLocale} not found`);
    }

    const results: Record<
      string,
      {
        isValid: boolean;
        coverage: number;
        qualityScore: number;
        issueCount: number;
      }
    > = {};

    for (const [locale, data] of this.locales.entries()) {
      if (locale === this.referenceLocale) continue;

      const validation = this.validator.validateLocale(data, reference);
      const coverage = this.validator.calculateCoverage(data, reference);

      results[locale] = {
        isValid: validation.isValid,
        coverage,
        qualityScore: validation.qualityScore,
        issueCount: validation.issues.length,
      };
    }

    return results;
  }

  /**
   * Find missing translations across all locales
   */
  findAllMissingKeys(): Record<string, string[]> {
    const reference = this.locales.get(this.referenceLocale);
    if (!reference) {
      throw new Error(`Reference locale ${this.referenceLocale} not found`);
    }

    const missingByLocale: Record<string, string[]> = {};

    for (const [locale, data] of this.locales.entries()) {
      if (locale === this.referenceLocale) continue;

      const missing = this.validator.findMissingKeys(data, reference);
      if (missing.length > 0) {
        missingByLocale[locale] = missing;
      }
    }

    return missingByLocale;
  }

  /**
   * Generate a translation report
   */
  generateReport(): {
    summary: {
      totalLocales: number;
      referenceLocale: string;
      averageCoverage: number;
      averageQuality: number;
    };
    locales: TranslationMetrics[];
    missingKeys: Record<string, string[]>;
    recommendations: string[];
  } {
    const metrics = this.getAllMetrics();
    const missingKeys = this.findAllMissingKeys();

    const nonRefMetrics = metrics.filter((m) => m.locale !== this.referenceLocale);

    const avgCoverage =
      nonRefMetrics.reduce((sum, m) => sum + m.coverage, 0) /
      (nonRefMetrics.length || 1);

    const avgQuality =
      nonRefMetrics.reduce((sum, m) => sum + m.qualityScore, 0) /
      (nonRefMetrics.length || 1);

    const recommendations: string[] = [];

    // Generate recommendations
    for (const metric of nonRefMetrics) {
      if (metric.coverage < 80) {
        recommendations.push(
          `${metric.locale}: Low coverage (${metric.coverage.toFixed(1)}%). Add ${metric.totalKeys - metric.translatedKeys} missing translations.`
        );
      }
      if (metric.qualityScore < 70) {
        recommendations.push(
          `${metric.locale}: Quality score below threshold (${metric.qualityScore}). Review and improve translations.`
        );
      }
      if (metric.issues > 10) {
        recommendations.push(
          `${metric.locale}: ${metric.issues} validation errors found. Fix critical issues first.`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('All translations are in good shape! 🎉');
    }

    return {
      summary: {
        totalLocales: this.locales.size,
        referenceLocale: this.referenceLocale,
        averageCoverage: Math.round(avgCoverage * 10) / 10,
        averageQuality: Math.round(avgQuality * 10) / 10,
      },
      locales: metrics,
      missingKeys,
      recommendations,
    };
  }

  /**
   * Export translations in different formats
   */
  exportTranslations(
    locale: string,
    format: 'json' | 'flat' | 'csv'
  ): string {
    const data = this.locales.get(locale);
    if (!data) {
      throw new Error(`Locale ${locale} not found`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(data.translations, null, 2);

      case 'flat': {
        const flat = this.flattenObject(data.translations);
        return JSON.stringify(flat, null, 2);
      }

      case 'csv': {
        const flat = this.flattenObject(data.translations);
        const rows = [['Key', 'Value']];
        for (const [key, value] of Object.entries(flat)) {
          rows.push([key, String(value)]);
        }
        return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      }

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

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
}

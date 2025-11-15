import type { TranslationEntry } from './types';

type TranslationTree = Record<string, unknown>;
const isTranslationRecord = (value: unknown): value is TranslationTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const hasDefaultExport = (value: unknown): value is { default: unknown } =>
  typeof value === 'object' && value !== null && 'default' in value;

/**
 * Flatten nested translation object into dot-notation keys
 */
export function flattenTranslations(
  obj: TranslationTree,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isTranslationRecord(value)) {
      Object.assign(result, flattenTranslations(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}

/**
 * Parse translations into TranslationEntry format
 */
export function parseTranslationFiles(
  translations: Record<string, string>,
  locale: string
): TranslationEntry[] {
  return Object.entries(translations).map(([key, value]) => ({
    key,
    value,
    locale,
  }));
}

/**
 * Load translations from a module
 */
export async function loadTranslations(
  localePath: string
): Promise<TranslationTree> {
  try {
    const moduleExports: unknown = await import(localePath);
    const normalized = hasDefaultExport(moduleExports)
      ? moduleExports.default
      : moduleExports;

    if (isTranslationRecord(normalized)) {
      return normalized;
    }

    console.warn(
      `Loaded translations from ${localePath} but data was not an object; returning empty record.`
    );
    return {};
  } catch (error) {
    console.error(`Failed to load translations from ${localePath}:`, error);
    return {};
  }
}

/**
 * Extract variables from translation string
 */
export function extractVariables(value: string): string[] {
  const matches = value.match(/\{([^}]+)\}/g);
  return matches ? matches.map((m) => m.slice(1, -1)) : [];
}

/**
 * Compare two translation objects and find missing keys
 */
export function findMissingKeys(
  reference: Record<string, string>,
  translation: Record<string, string>
): string[] {
  const refKeys = Object.keys(reference);
  const transKeys = new Set(Object.keys(translation));

  return refKeys.filter((key) => !transKeys.has(key));
}

/**
 * Compare two translation objects and find extra keys
 */
export function findExtraKeys(
  reference: Record<string, string>,
  translation: Record<string, string>
): string[] {
  const refKeys = new Set(Object.keys(reference));
  const transKeys = Object.keys(translation);

  return transKeys.filter((key) => !refKeys.has(key));
}

/**
 * Calculate translation coverage percentage
 */
export function calculateCoverage(
  reference: Record<string, string>,
  translation: Record<string, string>
): number {
  const refCount = Object.keys(reference).length;
  if (refCount === 0) return 0;

  const transCount = Object.keys(translation).length;
  return Math.min((transCount / refCount) * 100, 100);
}

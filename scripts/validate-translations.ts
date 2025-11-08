#!/usr/bin/env node

/**
 * Translation Validation Script
 * Validates all translations in the learner-app
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

const LOCALES_PATH = join(process.cwd(), 'apps', 'learner-app', 'src', 'locales');
const REFERENCE_LOCALE = 'en';
const TARGET_LOCALES = ['es', 'fr', 'zh', 'ar'];

async function main() {
  console.log('\n🔍 AIVO Translation Validation\n');
  console.log('═'.repeat(60));

  // Load reference translations
  const referenceTranslations = await loadLocaleFile(REFERENCE_LOCALE);
  const referenceFlat = flattenObject(referenceTranslations);
  const referenceKeys = Object.keys(referenceFlat);

  console.log(`\n📝 Reference Locale: ${REFERENCE_LOCALE}`);
  console.log(`📊 Total Keys: ${referenceKeys.length}\n`);

  let hasErrors = false;

  // Validate each locale
  for (const locale of TARGET_LOCALES) {
    try {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`Validating: ${locale.toUpperCase()}`);
      console.log(`${'─'.repeat(60)}\n`);

      const translations = await loadLocaleFile(locale);
      const flat = flattenObject(translations);
      
      const issues: string[] = [];
      const warnings: string[] = [];
      let score = 100;

      // Check for missing keys
      for (const key of referenceKeys) {
        if (!flat[key]) {
          issues.push(`❌ Missing key: ${key}`);
          score -= 10;
        } else {
          // Check variables
          const refVars = extractVariables(referenceFlat[key]);
          const transVars = extractVariables(flat[key]);
          
          const missing = refVars.filter(v => !transVars.includes(v));
          if (missing.length > 0) {
            issues.push(`❌ Missing variables in "${key}": {${missing.join(', ')}}`);
            score -= 5;
          }

          const extra = transVars.filter(v => !refVars.includes(v));
          if (extra.length > 0) {
            warnings.push(`⚠️  Extra variables in "${key}": {${extra.join(', ')}}`);
            score -= 2;
          }

          // Check length difference with language-specific thresholds
          const ratio = flat[key].length / referenceFlat[key].length;
          const lengthThresholds = getLanguageLengthThresholds(locale);
          
          // Be more lenient for very short reference strings (< 10 chars)
          // as they can naturally vary more (e.g., "Email" vs "Correo Electrónico")
          const isShortReference = referenceFlat[key].length < 10;
          const adjustedMax = isShortReference ? lengthThresholds.max * 1.5 : lengthThresholds.max;
          
          if (ratio > adjustedMax || ratio < lengthThresholds.min) {
            warnings.push(`⚠️  Unusual length for "${key}" (${Math.round(ratio * 100)}% of reference)`);
            score -= 1;
          }
        }
      }

      // Check for extra keys
      const translatedKeys = Object.keys(flat);
      for (const key of translatedKeys) {
        if (!referenceFlat[key]) {
          warnings.push(`⚠️  Extra key not in reference: ${key}`);
          score -= 1;
        }
      }

      const coverage = (translatedKeys.length / referenceKeys.length) * 100;
      score = Math.max(0, score);

      // Print results
      console.log(`📊 Quality Score: ${score.toFixed(1)}/100`);
      console.log(`📝 Coverage: ${coverage.toFixed(1)}%`);
      console.log(`✅ Valid Keys: ${translatedKeys.length}/${referenceKeys.length}\n`);

      if (issues.length > 0) {
        console.log(`🚫 Issues (${issues.length}):`);
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log('');
        hasErrors = true;
      }

      if (warnings.length > 0) {
        console.log(`⚠️  Warnings (${warnings.length}):`);
        warnings.slice(0, 5).forEach(warning => console.log(`   ${warning}`));
        if (warnings.length > 5) {
          console.log(`   ... and ${warnings.length - 5} more`);
        }
        console.log('');
      }

      if (issues.length === 0 && warnings.length === 0) {
        console.log('✨ Perfect! No issues found.\n');
      }

      const grade = getGrade(score);
      console.log(`🎯 Grade: ${grade.emoji} ${grade.label}\n`);

    } catch (error) {
      console.error(`❌ Error validating ${locale}:`, error);
      hasErrors = true;
    }
  }

  console.log('═'.repeat(60));
  console.log('\n✅ Validation complete!\n');

  if (hasErrors) {
    console.log('⚠️  Some translations have critical issues.\n');
    process.exit(1);
  }

  process.exit(0);
}

function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}

function extractVariables(text: string): string[] {
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.slice(1, -1)) : [];
}

function getLanguageLengthThresholds(locale: string): { min: number; max: number } {
  // Different languages have natural length variations
  const thresholds: Record<string, { min: number; max: number }> = {
    // Chinese: typically 50-70% shorter than English
    zh: { min: 0.15, max: 0.85 },
    // Japanese: similar to Chinese
    ja: { min: 0.15, max: 0.85 },
    // Korean: similar to Chinese/Japanese
    ko: { min: 0.15, max: 0.85 },
    // Spanish/French: typically 20-30% longer than English
    es: { min: 0.5, max: 2.5 },
    fr: { min: 0.5, max: 3.0 },
    pt: { min: 0.5, max: 2.5 },
    it: { min: 0.5, max: 2.5 },
    // German: can be much longer
    de: { min: 0.5, max: 3.0 },
    // Arabic: similar to English but can vary more
    ar: { min: 0.4, max: 2.5 },
    // Russian: similar to English
    ru: { min: 0.5, max: 2.0 },
    // Default for other languages
    default: { min: 0.3, max: 2.5 },
  };

  return thresholds[locale] || thresholds.default;
}

function getGrade(score: number): { emoji: string; label: string } {
  if (score >= 95) return { emoji: '🌟', label: 'Excellent' };
  if (score >= 85) return { emoji: '✨', label: 'Very Good' };
  if (score >= 75) return { emoji: '👍', label: 'Good' };
  if (score >= 60) return { emoji: '⚠️', label: 'Fair' };
  return { emoji: '❌', label: 'Poor' };
}

async function loadLocaleFile(locale: string): Promise<Record<string, any>> {
  const filePath = join(LOCALES_PATH, `${locale}.ts`);

  try {
    const content = await readFile(filePath, 'utf-8');

    // Extract the exported object
    const match = content.match(/export const \w+ = ({[\s\S]+});/);
    if (!match) {
      throw new Error(`Could not parse locale file: ${filePath}`);
    }

    // Parse the object
    const obj = eval(`(${match[1]})`);
    return obj;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    return {};
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

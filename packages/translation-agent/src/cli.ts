#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { TranslationManager } from './manager';
import { AITranslationService } from './ai-service';
import type { LocaleData } from './types';

interface CLIConfig {
  localesDir: string;
  referenceLocale: string;
  openaiApiKey?: string;
}

class TranslationCLI {
  private manager: TranslationManager;
  private aiService: AITranslationService | null = null;
  private config: CLIConfig;

  constructor(config: CLIConfig) {
    this.config = config;
    this.manager = new TranslationManager(config.referenceLocale);

    if (config.openaiApiKey) {
      this.aiService = new AITranslationService({
        apiKey: config.openaiApiKey,
      });
    }
  }

  /**
   * Load all translation files from directory
   */
  async loadTranslations(): Promise<void> {
    const files = readdirSync(this.config.localesDir).filter((f: string) =>
      f.endsWith('.json')
    );

    console.log(`📁 Loading translations from ${this.config.localesDir}...`);

    for (const file of files) {
      const locale = file.replace('.json', '');
      const filePath = join(this.config.localesDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);

      this.manager.registerLocale(locale, translations);
      console.log(`  ✓ Loaded ${locale}`);
    }

    console.log(`\n✅ Loaded ${files.length} locales\n`);
  }

  /**
   * Validate all translations
   */
  async validate(): Promise<void> {
    console.log('🔍 Validating translations...\n');

    const results = this.manager.validateAll();

    for (const [locale, result] of Object.entries(results)) {
      const status = result.isValid ? '✅' : '❌';
      console.log(`${status} ${locale.toUpperCase()}`);
      console.log(`   Coverage: ${result.coverage.toFixed(1)}%`);
      console.log(`   Quality Score: ${result.qualityScore}/100`);
      console.log(`   Issues: ${result.issueCount}`);
      console.log('');
    }
  }

  /**
   * Generate full report
   */
  async report(): Promise<void> {
    console.log('📊 Translation Report\n');
    console.log('='.repeat(60));

    const report = this.manager.generateReport();

    console.log('\n📈 Summary:');
    console.log(`   Total Locales: ${report.summary.totalLocales}`);
    console.log(`   Reference: ${report.summary.referenceLocale}`);
    console.log(`   Average Coverage: ${report.summary.averageCoverage}%`);
    console.log(`   Average Quality: ${report.summary.averageQuality}/100`);

    console.log('\n🌍 Locales:');
    for (const locale of report.locales) {
      const coverage = locale.coverage.toFixed(1);
      const bar = this.createProgressBar(locale.coverage);
      console.log(
        `   ${locale.locale}: ${bar} ${coverage}% (${locale.translatedKeys}/${locale.totalKeys} keys)`
      );
    }

    if (Object.keys(report.missingKeys).length > 0) {
      console.log('\n⚠️  Missing Keys:');
      for (const [locale, keys] of Object.entries(report.missingKeys)) {
        console.log(`   ${locale}: ${keys.length} missing`);
        if (keys.length <= 5) {
          keys.forEach((key) => console.log(`      - ${key}`));
        } else {
          keys.slice(0, 3).forEach((key) => console.log(`      - ${key}`));
          console.log(`      ... and ${keys.length - 3} more`);
        }
      }
    }

    console.log('\n💡 Recommendations:');
    report.recommendations.forEach((rec) => console.log(`   • ${rec}`));

    console.log('\n' + '='.repeat(60) + '\n');
  }

  /**
   * Find missing translations
   */
  async missing(): Promise<void> {
    console.log('🔎 Finding missing translations...\n');

    const missingByLocale = this.manager.findAllMissingKeys();

    if (Object.keys(missingByLocale).length === 0) {
      console.log('✅ All translations are complete!\n');
      return;
    }

    for (const [locale, keys] of Object.entries(missingByLocale)) {
      console.log(`\n${locale.toUpperCase()} - ${keys.length} missing:`);
      keys.forEach((key) => console.log(`  - ${key}`));
    }

    console.log('');
  }

  /**
   * AI-powered translation suggestions
   */
  async suggest(locale: string): Promise<void> {
    if (!this.aiService) {
      console.error('❌ AI service not configured. Set OPENAI_API_KEY environment variable.');
      return;
    }

    console.log(`🤖 Generating AI suggestions for ${locale}...\n`);

    const locales = this.manager.getLocales();
    if (!locales.includes(locale)) {
      console.error(`❌ Locale ${locale} not found`);
      return;
    }

    const referenceLocale = this.config.referenceLocale;
    const reference: LocaleData = {
      locale: referenceLocale,
      translations: {},
    };

    const target: LocaleData = {
      locale,
      translations: {},
    };

    console.log('⏳ This may take a few moments...\n');

    const suggestions = await this.aiService.suggestImprovements(target, reference);

    if (suggestions.length === 0) {
      console.log('✅ No improvements suggested. Translations look good!\n');
      return;
    }

    console.log(`Found ${suggestions.length} suggestions:\n`);

    for (const suggestion of suggestions.slice(0, 10)) {
      console.log(`📝 ${suggestion.key}`);
      console.log(`   Current: "${suggestion.currentValue}"`);
      console.log(`   Suggested: "${suggestion.suggestedValue}"`);
      console.log(`   Reason: ${suggestion.reason}`);
      console.log(`   Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`);
      console.log('');
    }

    if (suggestions.length > 10) {
      console.log(`... and ${suggestions.length - 10} more suggestions\n`);
    }
  }

  /**
   * Export translations
   */
  async export(locale: string, format: 'json' | 'flat' | 'csv', output: string): Promise<void> {
    console.log(`📤 Exporting ${locale} as ${format}...\n`);

    try {
      const content = this.manager.exportTranslations(locale, format);
      writeFileSync(output, content, 'utf-8');
      console.log(`✅ Exported to ${output}\n`);
    } catch (error) {
      console.error(`❌ Export failed: ${error}`);
    }
  }

  private createProgressBar(percentage: number, width = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: CLIConfig = {
    localesDir: process.env.LOCALES_DIR || resolve(process.cwd(), 'src/locales'),
    referenceLocale: process.env.REFERENCE_LOCALE || 'en',
    openaiApiKey: process.env.OPENAI_API_KEY,
  };

  const cli = new TranslationCLI(config);

  try {
    await cli.loadTranslations();

    switch (command) {
      case 'validate':
        await cli.validate();
        break;

      case 'report':
        await cli.report();
        break;

      case 'missing':
        await cli.missing();
        break;

      case 'suggest':
        await cli.suggest(args[1] || 'es');
        break;

      case 'export':
        await cli.export(
          args[1] || 'en',
          (args[2] as any) || 'json',
          args[3] || 'translations.json'
        );
        break;

      default:
        console.log(`
🌐 AIVO Translation Agent CLI

Usage:
  translation-agent <command> [options]

Commands:
  validate              Validate all translations
  report                Generate full translation report
  missing               Show missing translation keys
  suggest <locale>      Get AI-powered suggestions (requires OPENAI_API_KEY)
  export <locale> <format> <output>  Export translations

Environment Variables:
  LOCALES_DIR          Path to locales directory (default: ./src/locales)
  REFERENCE_LOCALE     Reference locale (default: en)
  OPENAI_API_KEY       OpenAI API key for AI features

Examples:
  translation-agent validate
  translation-agent report
  translation-agent missing
  translation-agent suggest es
  translation-agent export en flat translations.json
        `);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { TranslationCLI };

# @aivo/translation-agent

AI-powered translation validation and management for the AIVO Learning Platform.

## Features

- ✅ **Automated Validation**: Validates translations for missing keys,
  variables, and quality
- 🤖 **AI-Powered Analysis**: Uses OpenAI to suggest improvements and catch
  context issues
- 📊 **Quality Scoring**: Generates quality reports with grades and metrics
- 🌍 **Multi-Language Support**: Supports en, es, fr, zh, ar, de, ja, pt
- 🔄 **RTL Support**: Special validation for right-to-left languages like Arabic
- 📝 **Comprehensive Reports**: Text, JSON, and Markdown export formats

## Installation

```bash
pnpm add @aivo/translation-agent
```

## Usage

### Basic Validation

```typescript
import { TranslationValidator } from '@aivo/translation-agent';

const validator = new TranslationValidator();
const result = validator.validateLocale(localeData, referenceLocale);

console.log(`Quality Score: ${result.qualityScore}/100`);
console.log(`Issues Found: ${result.issues.length}`);
```

### AI-Powered Analysis

```typescript
import { AITranslationAgent } from '@aivo/translation-agent';

const agent = new AITranslationAgent(process.env.OPENAI_API_KEY);

// Analyze a translation
const suggestion = await agent.analyzeQuality(entry, referenceEntry);

// Generate new translation
const translation = await agent.suggestTranslation(referenceEntry, 'es');
```

### Quality Reports

```typescript
import { TranslationReporter } from '@aivo/translation-agent';

const reporter = new TranslationReporter();
const report = reporter.generateReport('es', results, suggestions);

// Print to console
console.log(reporter.formatReport(report));

// Export as JSON
fs.writeFileSync('report.json', reporter.exportJSON(report));

// Export as Markdown
fs.writeFileSync('report.md', reporter.exportMarkdown(report));
```

## Validation Script

Run validation on all translations:

```bash
pnpm validate:translations
```

This will check all locale files in `apps/learner-app/src/locales/` and report:
- Missing keys
- Missing or extra variables
- Length discrepancies
- Quality score per language
- Overall grade

## Supported Issue Types

- `missing-variable` - Required variables missing from translation
- `extra-variable` - Unknown variables in translation
- `grammar` - Grammar or syntax issues
- `tone` - Inappropriate tone or formality
- `length` - Unusual length compared to reference
- `cultural` - Cultural appropriateness concerns
- `context` - Missing or incorrect context
- `inconsistency` - Inconsistent with other translations
- `formality` - Wrong formality level for language
- `rtl` - Right-to-left text issues

## Issue Severities

- **Error**: Critical issues that must be fixed
- **Warning**: Issues that should be reviewed
- **Info**: Suggestions for improvement

## Quality Grading

- 🌟 **Excellent** (95-100): Outstanding quality
- ✨ **Very Good** (85-94): High quality with minor improvements possible
- 👍 **Good** (75-84): Solid translation with some areas to improve
- ⚠️ **Fair** (60-74): Functional but needs improvement
- ❌ **Poor** (<60): Significant issues found

## Locale Configuration

The package includes configuration for 8 languages:

| Code | Language | Direction | Formality |
|------|----------|-----------|-----------|
| `en` | English | LTR | Neutral |
| `es` | Spanish | LTR | Neutral |
| `fr` | French | LTR | Formal |
| `zh` | Chinese | LTR | Neutral |
| `ar` | Arabic | RTL | Formal |
| `de` | German | LTR | Formal |
| `ja` | Japanese | LTR | Formal |
| `pt` | Portuguese | LTR | Neutral |

## API Reference

### TranslationValidator

```typescript
class TranslationValidator {
  validateLocale(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): ValidationResult;
  
  // ... other methods
}
```

### AITranslationAgent

```typescript
class AITranslationAgent {
  constructor(apiKey?: string, model?: string);
  
  isAvailable(): boolean;
  
  analyzeQuality(
    entry: TranslationEntry,
    referenceEntry: TranslationEntry
  ): Promise<TranslationSuggestion | null>;
  
  suggestTranslation(
    referenceEntry: TranslationEntry,
    targetLocale: string,
    options?: AITranslationOptions
  ): Promise<string | null>;
  
  analyzeBatch(
    entries: TranslationEntry[],
    referenceEntries: Map<string, TranslationEntry>
  ): Promise<TranslationSuggestion[]>;
}
```

### TranslationReporter

```typescript
class TranslationReporter {
  generateReport(
    locale: string,
    results: TranslationValidationResult[],
    suggestions?: TranslationSuggestion[]
  ): TranslationQualityReport;
  
  formatReport(report: TranslationQualityReport): string;
  exportJSON(report: TranslationQualityReport): string;
  exportMarkdown(report: TranslationQualityReport): string;
}
```

## Environment Variables

```bash
# Optional: For AI-powered features
OPENAI_API_KEY=sk-...
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Validate Translations
  run: pnpm validate:translations
```

This will fail the build if translation quality is below 60%.

## Contributing

When adding new languages:

1. Add locale configuration to `src/locales.ts`
2. Create translation file in `apps/learner-app/src/locales/`
3. Run `pnpm validate:translations` to check quality
4. Address any issues reported

## License

MIT

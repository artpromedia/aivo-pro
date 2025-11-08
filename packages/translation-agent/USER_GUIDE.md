# AI Translation Agent - User Guide

## Overview

The AI Translation Agent is a comprehensive system that ensures translation
quality across all languages in the AIVO Learning Platform. It provides
automated validation, AI-powered suggestions, and quality monitoring.

## What It Does

### 1. **Automated Validation** ✅
- Checks for missing translation keys
- Validates variable placeholders (e.g., `{name}`, `{count}`)
- Detects length discrepancies
- Identifies potential issues with RTL (right-to-left) languages

### 2. **Quality Scoring** 📊
- Assigns a quality score (0-100) to each language
- Grades translations: Excellent, Very Good, Good, Fair, Poor
- Tracks coverage percentage
- Monitors issue counts by type and severity

### 3. **AI-Powered Analysis** 🤖
- Uses OpenAI to analyze translation quality
- Suggests improvements for tone, grammar, and cultural appropriateness
- Generates new translations based on context
- Provides confidence scores for suggestions

### 4. **Dashboard Monitoring** 📈
- Visual dashboard showing translation quality across all languages
- Real-time metrics and issue tracking
- Export reports in multiple formats (Text, JSON, Markdown)

## Quick Start

### Running Validation

```bash
# Validate all translations
pnpm validate:translations
```

This will check:
- Spanish (es)
- French (fr)
- Chinese (zh)
- Arabic (ar)

Against the English (en) reference.

### Expected Output

```
🔍 AIVO Translation Validation

════════════════════════════════════════════════════════════

📝 Reference Locale: en
📊 Total Keys: 53

────────────────────────────────────────────────────────────
Validating: ES
────────────────────────────────────────────────────────────

📊 Quality Score: 99.0/100
📝 Coverage: 100.0%
✅ Valid Keys: 53/53

⚠️  Warnings (1):
   ⚠️  Unusual length for "profile.email" (360% of reference)

🎯 Grade: 🌟 Excellent
```

## Understanding the Results

### Quality Score
- **95-100** 🌟 Excellent: Outstanding quality, ready for production
- **85-94** ✨ Very Good: High quality with minor improvements possible
- **75-84** 👍 Good: Solid translation with some areas to improve
- **60-74** ⚠️ Fair: Functional but needs improvement
- **<60** ❌ Poor: Significant issues, review required

### Coverage
- Percentage of keys translated vs. reference locale
- 100% = all keys translated
- <100% = some keys missing

### Issues

#### Errors (Critical)
- Missing translation keys
- Missing required variables
- Empty translations
- Placeholder text (TODO, TRANSLATE, etc.)

#### Warnings (Review Recommended)
- Extra variables not in reference
- Unusual length (too short or too long)
- Extra keys not in reference

#### Info (Suggestions)
- RTL text considerations
- Cultural context notes
- Formality level suggestions

## Using AI Features

### Setup

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)

2. Add to environment:
```bash
export OPENAI_API_KEY=sk-...
```

### Analyze Translation Quality

```typescript
import { AITranslationAgent } from '@aivo/translation-agent';

const agent = new AITranslationAgent(process.env.OPENAI_API_KEY);

const suggestion = await agent.analyzeQuality(
  { key: 'common.welcome', value: 'Bienvenido', locale: 'es' },
  { key: 'common.welcome', value: 'Welcome', locale: 'en' }
);

console.log(suggestion);
// {
//   key: 'common.welcome',
//   locale: 'es',
//   currentValue: 'Bienvenido',
//   suggestedValue: 'Bienvenido',
//   reason: 'Translation is accurate and natural',
//   confidence: 0.95,
//   aiModel: 'gpt-4o-mini'
// }
```

### Generate New Translations

```typescript
const translation = await agent.suggestTranslation(
  {
    key: 'dashboard.welcome',
    value: 'Welcome back, {name}!',
    locale: 'en',
    context: 'Greeting message on dashboard'
  },
  'es',
  {
    maintainTone: true,
    culturalAdaptation: true
  }
);

console.log(translation);
// "¡Bienvenido de nuevo, {name}!"
```

## Translation Dashboard

View the translation quality dashboard:

1. Start the super-admin app:

```bash
pnpm dev --filter super-admin
```

2. Navigate to Translation Dashboard

3. See real-time metrics:

   - Average quality score across all languages
   - Language count
   - Total issues to review

4. Click on any language to see detailed issues

## Best Practices

### 1. **Regular Validation**
Run `pnpm validate:translations` before every commit to catch issues early.

### 2. **Fix Errors First**
Address critical errors (❌) before warnings (⚠️).

### 3. **Preserve Variables**
Always include the same variables as the reference:
```typescript
// ✅ Correct
en: "Hello, {name}!"
es: "¡Hola, {name}!"

// ❌ Wrong
en: "Hello, {name}!"
es: "¡Hola!"  // Missing {name}
```

### 4. **Mind the Length**
Translations should be roughly similar in length:
- Spanish/French: typically 20-30% longer than English
- Chinese: typically 50-70% shorter than English
- Arabic: similar to English

Extreme differences may indicate missing text or over-translation.

### 5. **Cultural Context**
Consider cultural appropriateness:
- Formality levels (French, Japanese)
- Religious context (Arabic)
- Idioms and expressions
- Color meanings
- Number formats

### 6. **RTL Languages**
For Arabic:
- Test UI layout in RTL mode
- Check number placement
- Verify icon directions
- Test text alignment

## CI/CD Integration

Add to `.github/workflows/validate.yml`:

```yaml
name: Validate Translations

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - name: Validate Translations
        run: pnpm validate:translations
```

This will:
- Run on every push and PR
- Fail the build if quality is below 60%
- Show issues in the CI logs

## Troubleshooting

### "Missing key" errors
Add the missing key to the translation file.

### "Missing variable" errors
Ensure all `{variables}` from the reference are included.

### "Unusual length" warnings
Review the translation - it may be too verbose or too brief.

### "Extra key" warnings
Remove the key or add it to the reference locale (English).

### AI features not working
- Check that `OPENAI_API_KEY` is set
- Verify API key is valid
- Check API quota/billing

## Adding New Languages

1. Add locale configuration to `packages/translation-agent/src/locales.ts`:

```typescript
pt: {
  code: 'pt',
  name: 'Portuguese',
  nativeName: 'Português',
  direction: 'ltr',
  formalityLevel: 'neutral',
  culturalContext: ['western', 'latin'],
},
```

2. Create translation file `apps/learner-app/src/locales/pt.ts`

3. Add to available locales in `App.tsx`:

```typescript
availableLocales={['en', 'es', 'fr', 'zh', 'ar', 'pt']}
```

4. Update validation script to include new locale

5. Run validation:

```bash
pnpm validate:translations
```

## Support

For issues or questions:
- Check the [README](../README.md)
- Review the [API documentation](../README.md#api-reference)
- Run with `--help` flag for CLI options

## Next Steps

- [ ] Implement CI/CD workflow
- [ ] Add pluralization support
- [ ] Create comprehensive test suite
- [ ] Add more languages (German, Japanese, Portuguese)
- [ ] Integrate with professional translation services

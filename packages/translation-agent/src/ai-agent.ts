import OpenAI from 'openai';
import type {
  TranslationEntry,
  TranslationSuggestion,
  AITranslationOptions,
  LocaleConfig,
} from './types';
import { SUPPORTED_LOCALES } from './locales';

export class AITranslationAgent {
  private client: OpenAI | null = null;
  private model: string;

  constructor(apiKey?: string, model = 'gpt-4o-mini') {
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
    this.model = model;
  }

  /**
   * Check if AI features are available
   */
  isAvailable(): boolean {
    return this.client !== null;
  }

  /**
   * Analyze translation quality using AI
   */
  async analyzeQuality(
    entry: TranslationEntry,
    referenceEntry: TranslationEntry
  ): Promise<TranslationSuggestion | null> {
    if (!this.client) {
      return null;
    }

    const locale = SUPPORTED_LOCALES[entry.locale];
    if (!locale) {
      throw new Error(`Unsupported locale: ${entry.locale}`);
    }

    const prompt = this.buildQualityAnalysisPrompt(entry, referenceEntry, locale);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert translator and localization specialist. ' +
              'Analyze translations for accuracy, cultural appropriateness, tone, and naturalness.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');

      return {
        key: entry.key,
        locale: entry.locale,
        currentValue: entry.value,
        suggestedValue: result.suggestion || entry.value,
        reason: result.reason || 'AI analysis completed',
        confidence: result.confidence || 0.8,
        aiModel: this.model,
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return null;
    }
  }

  /**
   * Generate translation suggestion
   */
  async suggestTranslation(
    referenceEntry: TranslationEntry,
    targetLocale: string,
    options: AITranslationOptions = {}
  ): Promise<string | null> {
    if (!this.client) {
      return null;
    }

    const locale = SUPPORTED_LOCALES[targetLocale];
    if (!locale) {
      throw new Error(`Unsupported locale: ${targetLocale}`);
    }

    const prompt = this.buildTranslationPrompt(referenceEntry, locale, options);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional translator specializing in software localization. ' +
              'Provide accurate, natural translations that preserve meaning and tone.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: options.temperature || 0.3,
      });

      return response.choices[0]?.message?.content?.trim() || null;
    } catch (error) {
      console.error('Translation generation failed:', error);
      return null;
    }
  }

  /**
   * Batch analyze multiple translations
   */
  async analyzeBatch(
    entries: TranslationEntry[],
    referenceEntries: Map<string, TranslationEntry>
  ): Promise<TranslationSuggestion[]> {
    const suggestions: TranslationSuggestion[] = [];

    for (const entry of entries) {
      const ref = referenceEntries.get(entry.key);
      if (!ref) continue;

      const suggestion = await this.analyzeQuality(entry, ref);
      if (suggestion && suggestion.confidence > 0.7) {
        suggestions.push(suggestion);
      }
    }

    return suggestions;
  }

  /**
   * Build prompt for quality analysis
   */
  private buildQualityAnalysisPrompt(
    entry: TranslationEntry,
    referenceEntry: TranslationEntry,
    locale: LocaleConfig
  ): string {
    return `
Analyze this translation and suggest improvements if needed.

Reference (${this.getReferenceLocaleName()}): "${referenceEntry.value}"
Translation (${locale.nativeName}): "${entry.value}"

Context: ${entry.context || 'General UI text'}
Key: ${entry.key}

Language characteristics:
- Direction: ${locale.direction.toUpperCase()}
- Formality: ${locale.formalityLevel}
- Cultural context: ${locale.culturalContext?.join(', ') || 'General'}

Evaluate:
1. Accuracy: Does it convey the same meaning?
2. Naturalness: Does it sound natural to native speakers?
3. Tone: Does it maintain appropriate formality?
4. Cultural appropriateness: Is it suitable for the target culture?
5. Variables: Are all {variables} preserved correctly?

Return a JSON object with:
{
  "isGood": boolean,
  "suggestion": "improved translation (only if needed)",
  "reason": "explanation of what was improved or why it's good",
  "confidence": number (0-1)
}
`.trim();
  }

  /**
   * Build prompt for translation generation
   */
  private buildTranslationPrompt(
    referenceEntry: TranslationEntry,
    locale: LocaleConfig,
    options: AITranslationOptions
  ): string {
    const variables = this.extractVariables(referenceEntry.value);

    return `
Translate this text to ${locale.nativeName}:

Text: "${referenceEntry.value}"
Context: ${referenceEntry.context || 'Software UI element'}
Key: ${referenceEntry.key}

Requirements:
- Target language: ${locale.nativeName} (${locale.code})
- Direction: ${locale.direction.toUpperCase()}
- Formality level: ${locale.formalityLevel}
- Cultural context: ${locale.culturalContext?.join(', ') || 'General'}
${variables.length > 0 ? `- MUST preserve these variables exactly: ${variables.join(', ')}` : ''}
${options.maintainTone ? '- Maintain the same tone as the original' : ''}
${options.culturalAdaptation ? '- Adapt idioms and expressions for the target culture' : ''}

Provide ONLY the translated text, nothing else.
`.trim();
  }

  /**
   * Extract variables from text
   */
  private extractVariables(value: string): string[] {
    const matches = value.match(/\{([^}]+)\}/g);
    return matches || [];
  }

  /**
   * Get reference locale name
   */
  private getReferenceLocaleName(): string {
    return SUPPORTED_LOCALES.en?.nativeName || 'English';
  }
}

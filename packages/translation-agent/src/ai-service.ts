import OpenAI from 'openai';
import type {
  AITranslationConfig,
  TranslationSuggestion,
  TranslationContext,
  LocaleData,
} from './types';

type NestedTranslations = Record<string, unknown>;
function isPlainObject(value: unknown): value is NestedTranslations {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export class AITranslationService {
  private client: OpenAI;
  private model: string;
  private temperature: number;

  constructor(config: AITranslationConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
    this.model = config.model || 'gpt-4o';
    this.temperature = config.temperature || 0.3;
  }

  /**
   * Translate a key to a target language using AI
   */
  async translateKey(
    key: string,
    sourceValue: string,
    sourceLocale: string,
    targetLocale: string,
    context?: TranslationContext
  ): Promise<string> {
    const prompt = this.buildTranslationPrompt(
      key,
      sourceValue,
      sourceLocale,
      targetLocale,
      context
    );

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('translation'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.temperature,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content?.trim() || sourceValue;
  }

  /**
   * Validate translation quality and cultural appropriateness
   */
  async validateTranslation(
    key: string,
    value: string,
    locale: string,
    sourceValue: string,
    context?: TranslationContext
  ): Promise<{
    isValid: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `
Validate this translation for quality and cultural appropriateness:

Translation Key: ${key}
Source (English): ${sourceValue}
Target Language: ${locale}
Translation: ${value}
${context ? `Context: Feature="${context.feature}", Tone="${context.tone}"` : ''}

Analyze:
1. Accuracy - Does it convey the same meaning?
2. Grammar - Is it grammatically correct?
3. Cultural fit - Is it culturally appropriate for ${locale}?
4. Tone - Does it match the intended tone?
5. Variables - Are placeholders like {name} preserved correctly?

Provide:
- Valid: true/false
- Score: 0-100
- Issues: List any problems
- Suggestions: Improvements if needed

Format as JSON:
{
  "isValid": boolean,
  "score": number,
  "issues": string[],
  "suggestions": string[]
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('validation'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      isValid: result.isValid ?? true,
      score: result.score ?? 100,
      issues: result.issues ?? [],
      suggestions: result.suggestions ?? [],
    };
  }

  /**
   * Generate improvement suggestions for translations
   */
  async suggestImprovements(
    localeData: LocaleData,
    referenceLocale: LocaleData
  ): Promise<TranslationSuggestion[]> {
    const suggestions: TranslationSuggestion[] = [];

    const keys = Object.keys(this.flattenObject(referenceLocale.translations));

    for (const key of keys) {
      const sourceValue = this.getNestedValue(referenceLocale.translations, key);
      const currentValue = this.getNestedValue(localeData.translations, key);

      if (typeof sourceValue !== 'string' || typeof currentValue !== 'string') {
        continue;
      }

      const validation = await this.validateTranslation(
        key,
        currentValue,
        localeData.locale,
        sourceValue
      );

      if (validation.score < 80 && validation.suggestions.length > 0) {
        suggestions.push({
          key,
          locale: localeData.locale,
          currentValue,
          suggestedValue: validation.suggestions[0],
          reason: validation.issues.join('; '),
          confidence: validation.score / 100,
          aiModel: this.model,
        });
      }
    }

    return suggestions;
  }

  /**
   * Batch translate missing keys
   */
  async batchTranslate(
    missingKeys: string[],
    sourceLocale: LocaleData,
    targetLocale: string,
    context?: TranslationContext
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};

    for (const key of missingKeys) {
      const sourceValue = this.getNestedValue(sourceLocale.translations, key);
      if (typeof sourceValue === 'string') {
        const translated = await this.translateKey(
          key,
          sourceValue,
          sourceLocale.locale,
          targetLocale,
          context
        );
        translations[key] = translated;
      }
    }

    return translations;
  }

  /**
   * Check for cultural sensitivity issues
   */
  async checkCulturalSensitivity(
    value: string,
    locale: string
  ): Promise<{
    safe: boolean;
    concerns: string[];
    alternatives: string[];
  }> {
    const prompt = `
Analyze this text for cultural sensitivity in ${locale}:

Text: "${value}"

Check for:
1. Offensive language or slurs
2. Cultural stereotypes
3. Religious sensitivity
4. Gender bias
5. Regional appropriateness

Provide:
- Safe: true/false
- Concerns: List any issues
- Alternatives: Better phrases if needed

Format as JSON:
{
  "safe": boolean,
  "concerns": string[],
  "alternatives": string[]
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a cultural sensitivity expert analyzing translations for appropriateness.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      safe: result.safe ?? true,
      concerns: result.concerns ?? [],
      alternatives: result.alternatives ?? [],
    };
  }

  // Helper methods
  private buildTranslationPrompt(
    key: string,
    sourceValue: string,
    sourceLocale: string,
    targetLocale: string,
    context?: TranslationContext
  ): string {
    return `
Translate the following text from ${sourceLocale} to ${targetLocale}:

Translation Key: ${key}
Text: "${sourceValue}"
${context ? `\nContext:\n- Feature: ${context.feature}\n- Tone: ${context.tone || 'neutral'}\n- Platform: ${context.platform || 'web'}` : ''}

Requirements:
1. Preserve any variables in curly braces like {name}, {count}
2. Match the tone (${context?.tone || 'professional'})
3. Keep the same formatting (punctuation, capitalization)
4. Be culturally appropriate for ${targetLocale}
5. Return ONLY the translated text, no explanations

Translation:`;
  }

  private getSystemPrompt(task: 'translation' | 'validation'): string {
    if (task === 'translation') {
      return `You are an expert translator specializing in educational technology platforms. 
You understand context, maintain consistent terminology, and produce natural-sounding translations 
that are culturally appropriate. You preserve technical terms, variable placeholders, and formatting.`;
    }

    return `You are a translation quality expert. You validate translations for accuracy, 
grammar, cultural appropriateness, and consistency. You provide constructive feedback and 
actionable suggestions for improvement.`;
  }

  private flattenObject(
    obj: NestedTranslations,
    prefix = ''
  ): NestedTranslations {
    return Object.entries(obj).reduce<NestedTranslations>((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (isPlainObject(value)) {
        Object.assign(acc, this.flattenObject(value, newKey));
      } else {
        acc[newKey] = value;
      }
      return acc;
    }, {});
  }

  private getNestedValue(obj: NestedTranslations, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (isPlainObject(current)) {
        return current[key];
      }
      return undefined;
    }, obj);
  }
}

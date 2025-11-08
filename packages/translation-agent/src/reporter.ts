import type {
  TranslationValidationResult,
  TranslationQualityReport,
  TranslationSuggestion,
  IssueType,
  IssueSeverity,
} from './types';

export class TranslationReporter {
  /**
   * Generate a quality report for a locale
   */
  generateReport(
    locale: string,
    results: TranslationValidationResult[],
    suggestions: TranslationSuggestion[] = []
  ): TranslationQualityReport {
    const validatedKeys = results.length;
    const totalKeys = validatedKeys; // This would be the total keys in the app

    // Calculate average score
    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / (results.length || 1);

    // Count issues by type
    const issuesByType: Record<IssueType, number> = {
      'missing-variable': 0,
      'extra-variable': 0,
      grammar: 0,
      tone: 0,
      length: 0,
      cultural: 0,
      context: 0,
      inconsistency: 0,
      formality: 0,
      rtl: 0,
    };

    // Count issues by severity
    const issuesBySeverity: Record<IssueSeverity, number> = {
      error: 0,
      warning: 0,
      info: 0,
    };

    for (const result of results) {
      for (const issue of result.issues) {
        const issueType = issue.type as IssueType;
        issuesByType[issueType] = (issuesByType[issueType] || 0) + 1;
        issuesBySeverity[issue.severity] =
          (issuesBySeverity[issue.severity] || 0) + 1;
      }
    }

    return {
      locale,
      totalKeys,
      validatedKeys,
      averageScore: Math.round(averageScore * 10) / 10,
      issuesByType,
      issuesBySeverity,
      suggestions,
    };
  }

  /**
   * Format report as text
   */
  formatReport(report: TranslationQualityReport): string {
    const lines: string[] = [];

    lines.push(`\n╔═══════════════════════════════════════════════════╗`);
    lines.push(`║  Translation Quality Report - ${report.locale.toUpperCase()}              ║`);
    lines.push(`╚═══════════════════════════════════════════════════╝\n`);

    // Overall metrics
    lines.push(`📊 Overall Quality Score: ${report.averageScore}/100`);
    lines.push(`📝 Validated Keys: ${report.validatedKeys}/${report.totalKeys}`);
    lines.push(
      `✅ Coverage: ${Math.round((report.validatedKeys / report.totalKeys) * 100)}%\n`
    );

    // Issues by severity
    lines.push(`🔍 Issues by Severity:`);
    lines.push(`   • Errors:   ${report.issuesBySeverity.error}`);
    lines.push(`   • Warnings: ${report.issuesBySeverity.warning}`);
    lines.push(`   • Info:     ${report.issuesBySeverity.info}\n`);

    // Issues by type (only show non-zero)
    const nonZeroIssues = Object.entries(report.issuesByType)
      .filter(([, count]) => (count as number) > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number));

    if (nonZeroIssues.length > 0) {
      lines.push(`📋 Issues by Type:`);
      for (const [type, count] of nonZeroIssues) {
        lines.push(`   • ${this.formatIssueType(type)}: ${count}`);
      }
      lines.push('');
    }

    // AI Suggestions
    if (report.suggestions.length > 0) {
      lines.push(`💡 AI Suggestions (${report.suggestions.length}):\n`);
      const topSuggestions = report.suggestions
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 5);

      for (const suggestion of topSuggestions) {
        lines.push(`   Key: ${suggestion.key}`);
        lines.push(`   Current:  "${suggestion.currentValue}"`);
        lines.push(`   Suggested: "${suggestion.suggestedValue}"`);
        lines.push(
          `   Reason: ${suggestion.reason} (Confidence: ${Math.round(suggestion.confidence * 100)}%)\n`
        );
      }
    }

    // Quality grade
    const grade = this.getQualityGrade(report.averageScore);
    lines.push(`\n🎯 Quality Grade: ${grade.emoji} ${grade.label}`);
    lines.push(`   ${grade.description}\n`);

    return lines.join('\n');
  }

  /**
   * Format issue type as human-readable
   */
  private formatIssueType(type: string): string {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get quality grade based on score
   */
  private getQualityGrade(score: number): {
    emoji: string;
    label: string;
    description: string;
  } {
    if (score >= 95) {
      return {
        emoji: '🌟',
        label: 'Excellent',
        description: 'Outstanding translation quality!',
      };
    } else if (score >= 85) {
      return {
        emoji: '✨',
        label: 'Very Good',
        description: 'High quality with minor improvements possible.',
      };
    } else if (score >= 75) {
      return {
        emoji: '👍',
        label: 'Good',
        description: 'Solid translation with some areas to improve.',
      };
    } else if (score >= 60) {
      return {
        emoji: '⚠️',
        label: 'Fair',
        description: 'Functional but needs improvement.',
      };
    } else {
      return {
        emoji: '❌',
        label: 'Poor',
        description: 'Significant issues found. Review required.',
      };
    }
  }

  /**
   * Export report as JSON
   */
  exportJSON(report: TranslationQualityReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report as Markdown
   */
  exportMarkdown(report: TranslationQualityReport): string {
    const lines: string[] = [];

    lines.push(`# Translation Quality Report - ${report.locale.toUpperCase()}\n`);

    lines.push(`## Overall Metrics\n`);
    lines.push(`- **Quality Score**: ${report.averageScore}/100`);
    lines.push(
      `- **Validated Keys**: ${report.validatedKeys}/${report.totalKeys}`
    );
    lines.push(
      `- **Coverage**: ${Math.round((report.validatedKeys / report.totalKeys) * 100)}%\n`
    );

    lines.push(`## Issues by Severity\n`);
    lines.push(`| Severity | Count |`);
    lines.push(`|----------|-------|`);
    lines.push(`| Error    | ${report.issuesBySeverity.error} |`);
    lines.push(`| Warning  | ${report.issuesBySeverity.warning} |`);
    lines.push(`| Info     | ${report.issuesBySeverity.info} |\n`);

    const nonZeroIssues = Object.entries(report.issuesByType)
      .filter(([, count]) => (count as number) > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number));

    if (nonZeroIssues.length > 0) {
      lines.push(`## Issues by Type\n`);
      lines.push(`| Type | Count |`);
      lines.push(`|------|-------|`);
      for (const [type, count] of nonZeroIssues) {
        lines.push(`| ${this.formatIssueType(type)} | ${count} |`);
      }
      lines.push('');
    }

    if (report.suggestions.length > 0) {
      lines.push(`## AI Suggestions\n`);
      for (const suggestion of report.suggestions.slice(0, 10)) {
        lines.push(`### ${suggestion.key}\n`);
        lines.push(`**Current**: ${suggestion.currentValue}\n`);
        lines.push(`**Suggested**: ${suggestion.suggestedValue}\n`);
        lines.push(
          `**Reason**: ${suggestion.reason} ` +
            `(Confidence: ${Math.round(suggestion.confidence * 100)}%)\n`
        );
      }
    }

    return lines.join('\n');
  }
}

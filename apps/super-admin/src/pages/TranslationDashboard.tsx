import { useState } from 'react';
import { Globe, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

interface TranslationMetric {
  locale: string;
  name: string;
  nativeName: string;
  score: number;
  coverage: number;
  issues: {
    errors: number;
    warnings: number;
    info: number;
  };
  lastValidated: string;
}

export function TranslationDashboard() {
  const [metrics] = useState<TranslationMetric[]>([
    {
      locale: 'en',
      name: 'English',
      nativeName: 'English',
      score: 100,
      coverage: 100,
      issues: { errors: 0, warnings: 0, info: 0 },
      lastValidated: new Date().toISOString(),
    },
    {
      locale: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      score: 99,
      coverage: 100,
      issues: { errors: 0, warnings: 1, info: 0 },
      lastValidated: new Date().toISOString(),
    },
    {
      locale: 'fr',
      name: 'French',
      nativeName: 'Français',
      score: 99,
      coverage: 100,
      issues: { errors: 0, warnings: 1, info: 0 },
      lastValidated: new Date().toISOString(),
    },
    {
      locale: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      score: 75,
      coverage: 100,
      issues: { errors: 0, warnings: 25, info: 0 },
      lastValidated: new Date().toISOString(),
    },
    {
      locale: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      score: 99,
      coverage: 100,
      issues: { errors: 0, warnings: 1, info: 0 },
      lastValidated: new Date().toISOString(),
    },
  ]);

  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);

  // Log selected locale for debugging
  if (selectedLocale) {
    console.log('Selected locale:', selectedLocale);
  }

  const getGradeColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeEmoji = (score: number) => {
    if (score >= 95) return '🌟';
    if (score >= 85) return '✨';
    if (score >= 75) return '👍';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  const getGradeLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Very Good';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const averageScore = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
  const totalIssues = metrics.reduce(
    (sum, m) => sum + m.issues.errors + m.issues.warnings,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-coral-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Translation Quality Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor and manage translations across all supported languages
          </p>
        </div>

        {/* Overall Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Quality</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {averageScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Across {metrics.length} languages
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {metrics.length}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Fully supported</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalIssues}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">To review</p>
          </div>
        </div>

        {/* Languages Table */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Language Translation Status
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Quality Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Validated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {metrics.map((metric) => (
                  <tr
                    key={metric.locale}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLocale(metric.locale)}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getGradeEmoji(metric.score)}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {metric.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {metric.nativeName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getGradeColor(metric.score)}`}>
                          {metric.score}
                        </span>
                        <span className="text-sm text-gray-500">/ 100</span>
                      </div>
                      <div className={`text-xs ${getGradeColor(metric.score)}`}>
                        {getGradeLabel(metric.score)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all"
                            style={{ width: `${metric.coverage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {metric.coverage}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-2">
                        {metric.issues.errors > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            <XCircle className="h-3 w-3" />
                            {metric.issues.errors}
                          </span>
                        )}
                        {metric.issues.warnings > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            <AlertTriangle className="h-3 w-3" />
                            {metric.issues.warnings}
                          </span>
                        )}
                        {metric.issues.errors === 0 &&
                          metric.issues.warnings === 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              <CheckCircle className="h-3 w-3" />
                              None
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(metric.lastValidated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            className="rounded-lg bg-coral-500 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-coral-600"
            onClick={() => alert('Running validation...')}
          >
            Run Validation
          </button>
          <button
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            onClick={() => alert('Exporting report...')}
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

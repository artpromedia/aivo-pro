/**
 * Example Dashboard with translations
 */

import { useTranslation, FormattedNumber, FormattedDate } from '@aivo/i18n';

export function TranslatedDashboard() {
  const { t, formatNumber, formatDate } = useTranslation();

  const stats = {
    lessonsCompleted: 24,
    hoursLearned: 48.5,
    streakDays: 7,
  };

  const lastActivity = new Date();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('dashboard.title')}
      </h1>

      <p className="text-lg mb-8">
        {t('dashboard.welcome', { name: 'Student' })}
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">
            {t('dashboard.stats.lessonsCompleted')}
          </h3>
          <p className="text-3xl font-bold">
            <FormattedNumber value={stats.lessonsCompleted} />
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">
            {t('dashboard.stats.hoursLearned')}
          </h3>
          <p className="text-3xl font-bold">
            {formatNumber(stats.hoursLearned, { 
              minimumFractionDigits: 1,
              maximumFractionDigits: 1 
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">
            {t('dashboard.stats.streakDays')}
          </h3>
          <p className="text-3xl font-bold">
            {stats.streakDays}
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Last activity: <FormattedDate value={lastActivity} />
      </div>
    </div>
  );
}

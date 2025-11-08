/**
 * Language Switcher Component
 */

import { Globe } from 'lucide-react';
import { LocaleSwitcher, useLocale, useTranslation } from '@aivo/i18n';

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-gray-600" />
      <LocaleSwitcher className="border-gray-300 text-sm" />
    </div>
  );
}

// Alternative: Button version
export function LanguageButtons() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Language / Idioma / Langue / 语言 / اللغة</h3>
      <LocaleSwitcher />
    </div>
  );
}

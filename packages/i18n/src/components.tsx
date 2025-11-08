/**
 * I18n Components
 */

import { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';
import { useLocale } from './hooks';
import type { Locale } from './provider';

export interface TranslateProps {
  id: string;
  values?: Record<string, any>;
  defaultMessage?: string;
}

export function Translate({ id, values, defaultMessage }: TranslateProps) {
  return <FormattedMessage id={id} values={values} defaultMessage={defaultMessage} />;
}

export interface LocaleSwitcherProps {
  className?: string;
  buttonClassName?: string;
}

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
  ar: 'العربية',
};

export function LocaleSwitcher({ className = '', buttonClassName = '' }: LocaleSwitcherProps) {
  const { locale, setLocale, availableLocales } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className={`
        px-3 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-coral
        ${className}
      `}
    >
      {availableLocales.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_NAMES[loc]}
        </option>
      ))}
    </select>
  );
}

export interface LocaleButtonsProps {
  className?: string;
  buttonClassName?: string;
}

export function LocaleButtons({ className = '', buttonClassName = '' }: LocaleButtonsProps) {
  const { locale, setLocale, availableLocales } = useLocale();

  return (
    <div className={`flex gap-2 ${className}`}>
      {availableLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${
              locale === loc
                ? 'bg-coral text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
            ${buttonClassName}
          `}
        >
          {LOCALE_NAMES[loc]}
        </button>
      ))}
    </div>
  );
}

// Re-export commonly used react-intl components
export { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime };

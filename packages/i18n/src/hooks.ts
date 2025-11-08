/**
 * I18n Hooks
 */

import { useIntl } from 'react-intl';
import { useI18n } from './provider';

export function useTranslation() {
  const intl = useIntl();
  const { locale } = useI18n();

  const t = (id: string, values?: Record<string, any>) => {
    return intl.formatMessage({ id }, values);
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return intl.formatNumber(value, options);
  };

  const formatDate = (value: Date | number, options?: Intl.DateTimeFormatOptions) => {
    return intl.formatDate(value, options);
  };

  const formatTime = (value: Date | number, options?: Intl.DateTimeFormatOptions) => {
    return intl.formatTime(value, options);
  };

  const formatRelativeTime = (value: number, unit: Intl.RelativeTimeFormatUnit) => {
    return intl.formatRelativeTime(value, unit);
  };

  const formatCurrency = (value: number, currency: string) => {
    return intl.formatNumber(value, { style: 'currency', currency });
  };

  return {
    t,
    locale,
    formatNumber,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatCurrency,
  };
}

export function useLocale() {
  const { locale, setLocale, availableLocales } = useI18n();

  return {
    locale,
    setLocale,
    availableLocales,
  };
}

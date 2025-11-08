/**
 * @aivo/i18n
 * Internationalization with react-intl
 */

export { I18nProvider, useI18n } from './provider';
export type { Locale, Messages, LocaleData, I18nProviderProps } from './provider';

export { useTranslation, useLocale } from './hooks';

export {
  Translate,
  LocaleSwitcher,
  LocaleButtons,
  FormattedMessage,
  FormattedNumber,
  FormattedDate,
  FormattedTime,
} from './components';

export type { TranslateProps, LocaleSwitcherProps, LocaleButtonsProps } from './components';

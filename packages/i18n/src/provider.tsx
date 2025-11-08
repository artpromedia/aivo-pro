/**
 * I18n Provider and Context
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

export type Locale = 'en' | 'es' | 'fr' | 'zh' | 'ar';

export interface Messages {
  [key: string]: string | Messages;
}

export interface LocaleData {
  locale: Locale;
  messages: Messages;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  availableLocales: Locale[];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
  locales: Record<Locale, Messages>;
  availableLocales?: Locale[];
}

export function I18nProvider({
  children,
  defaultLocale = 'en',
  locales,
  availableLocales = ['en'],
}: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const flattenMessages = (messages: Messages, prefix = ''): Record<string, string> => {
    return Object.keys(messages).reduce((acc, key) => {
      const value = messages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        acc[prefixedKey] = value;
      } else {
        Object.assign(acc, flattenMessages(value as Messages, prefixedKey));
      }

      return acc;
    }, {} as Record<string, string>);
  };

  const messages = flattenMessages(locales[locale] || locales[defaultLocale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, messages, availableLocales }}>
      <ReactIntlProvider locale={locale} messages={messages} defaultLocale={defaultLocale}>
        {children}
      </ReactIntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

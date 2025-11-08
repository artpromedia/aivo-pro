# Multi-Language Support Implementation

## Overview

Multi-language support has been implemented using the `@aivo/i18n` package
with support for **5 languages**:

- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇨🇳 Chinese (zh)
- 🇸🇦 Arabic (ar)

## Implementation

### 1. Translation Files

All translations are located in `apps/learner-app/src/locales/`:

```
src/locales/
├── index.ts    # Exports all translations
├── en.ts       # English
├── es.ts       # Spanish
├── fr.ts       # French
├── zh.ts       # Chinese (Simplified)
└── ar.ts       # Arabic
```

### 2. App Integration

The app is wrapped with `I18nProvider` in `App.tsx`:

```tsx
<I18nProvider
  defaultLocale="en"
  locales={{ en, es, fr, zh, ar }}
  availableLocales={['en', 'es', 'fr', 'zh', 'ar']}
>
  {/* Your app */}
</I18nProvider>
```

### 3. Usage Examples

#### Using the useTranslation hook:

```tsx
import { useTranslation } from '@aivo/i18n';

function MyComponent() {
  const { t, formatNumber, formatDate } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome', { name: 'John' })}</p>
      <span>{formatNumber(1234.56)}</span>
    </div>
  );
}
```

#### Using FormattedMessage component:

```tsx
import { FormattedMessage, FormattedNumber } from '@aivo/i18n';

function Stats() {
  return (
    <div>
      <h2>
        <FormattedMessage id="dashboard.stats.lessonsCompleted" />
      </h2>
      <p>
        <FormattedNumber value={24} />
      </p>
    </div>
  );
}
```

#### Language Switcher Component:

```tsx
import { LocaleSwitcher } from '@aivo/i18n';

function Settings() {
  return (
    <div>
      <h3>Choose Language</h3>
      <LocaleSwitcher />
    </div>
  );
}
```

### 4. Available Translation Keys

Current translation structure:

```typescript
{
  common: {
    welcome, hello, goodbye, yes, no, save, cancel, 
    delete, edit, close, loading, error, success
  },
  nav: {
    home, dashboard, courses, progress, settings, 
    profile, logout
  },
  dashboard: {
    title, welcome, continueLesson, recentActivity, 
    achievements,
    stats: {
      lessonsCompleted, hoursLearned, streakDays
    }
  },
  courses: {
    title, allCourses, inProgress, completed, 
    startCourse, continueCourse, viewDetails
  },
  lessons: {
    title, next, previous, complete, quiz, resources
  },
  profile: {
    title, personalInfo, name, email, language, 
    timezone, updateProfile
  },
  settings: {
    title, notifications, appearance, privacy, 
    language
  }
}
```

### 5. Formatting Options

#### Numbers:
```tsx
const { formatNumber } = useTranslation();

formatNumber(1234.56);  // 1,234.56
formatNumber(1234.56, { 
  minimumFractionDigits: 2,
  maximumFractionDigits: 2 
});
```

#### Dates:
```tsx
const { formatDate } = useTranslation();

formatDate(new Date());  // Nov 8, 2025
formatDate(new Date(), { 
  year: 'numeric',
  month: 'long',
  day: 'numeric' 
});
```

#### Currency:
```tsx
const { formatCurrency } = useTranslation();

formatCurrency(99.99, 'USD');  // $99.99
```

#### Relative Time:
```tsx
const { formatRelativeTime } = useTranslation();

formatRelativeTime(-1, 'day');   // yesterday
formatRelativeTime(2, 'hour');   // in 2 hours
```

## Adding New Translations

To add a new translation key:

1. Add it to all language files (`en.ts`, `es.ts`, `fr.ts`, `zh.ts`, `ar.ts`)
2. Use nested structure for organization
3. Access with dot notation: `t('section.subsection.key')`

Example:

```typescript
// en.ts
export const en = {
  newSection: {
    greeting: 'Hello, {name}!',
    message: 'You have {count} new notifications',
  }
};

// es.ts
export const es = {
  newSection: {
    greeting: '¡Hola, {name}!',
    message: 'Tienes {count} notificaciones nuevas',
  }
};

// Usage
t('newSection.greeting', { name: 'Maria' });
t('newSection.message', { count: 5 });
```

## RTL Support (Arabic)

The i18n package automatically handles RTL (Right-to-Left) text direction
for Arabic. You can add CSS to your components:

```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

## Best Practices

1. **Always provide fallback text**: Use `defaultMessage` prop
2. **Keep keys organized**: Use nested structure by feature/page
3. **Avoid hardcoded strings**: Extract all user-facing text
4. **Use variables**: For dynamic content like names, counts
5. **Test all languages**: Ensure UI doesn't break with longer text
6. **Consider pluralization**: Use proper plural forms per language
7. **Store locale preference**: Save user's choice in localStorage

## Language Switcher Location

The language switcher is available in:
- **Profile Menu**: Dropdown selector in the top-right profile menu
- **Settings Page**: Can be added to a dedicated language/region settings page

## Testing

To test different languages:

1. Open the app
2. Click on Profile Menu (top right)
3. Find the Language section
4. Select a language from the dropdown
5. The entire app will update to show content in the selected language

## Future Enhancements

- Add more languages (Japanese, German, Portuguese, etc.)
- Implement professional translation service integration
- Add context-aware translations
- Support for regional variations (en-US vs en-GB)
- Pluralization rules per language
- Gender-specific translations where needed

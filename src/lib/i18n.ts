import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';
import uzMessages from '../../messages/uz.json';

export const locales = ['uz', 'ru', 'en'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'uz';
export const localeCookieName = 'beb-locale';

export type AppMessages = typeof uzMessages;

const messageMap: Record<AppLocale, AppMessages> = {
  uz: uzMessages,
  ru: ruMessages,
  en: enMessages,
};

export function isValidLocale(value: string | null | undefined): value is AppLocale {
  return Boolean(value && locales.includes(value as AppLocale));
}

export function getMessages(locale: AppLocale): AppMessages {
  return messageMap[locale];
}

export function getMessageValue(
  messages: AppMessages,
  key: string
): string {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, messages);

  return typeof value === 'string' ? value : key;
}

export function formatMessage(
  template: string,
  values?: Record<string, string | number>
): string {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

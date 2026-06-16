import { cookies } from 'next/headers';
import {
  defaultLocale,
  formatMessage,
  getMessageValue,
  getMessages,
  isValidLocale,
  localeCookieName,
  type AppMessages,
  type AppLocale,
} from '@/lib/i18n';

export async function getLocaleFromRequest(): Promise<AppLocale> {
  const cookieStore = cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isValidLocale(locale) ? locale : defaultLocale;
}

export async function getRequestMessages(): Promise<AppMessages> {
  const locale = await getLocaleFromRequest();
  return getMessages(locale);
}

export async function getTranslator() {
  const messages = await getRequestMessages();

  return (key: string, values?: Record<string, string | number>) =>
    formatMessage(getMessageValue(messages, key), values);
}

import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, getMessages } from '@/lib/i18n';
import { getLocaleFromRequest } from '@/lib/i18n-server';

export default getRequestConfig(async () => {
  const locale = await getLocaleFromRequest();

  return {
    locale: locale || defaultLocale,
    messages: getMessages(locale),
  };
});

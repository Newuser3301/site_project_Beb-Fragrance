// src/app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liveSettings, setLiveSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setLiveSettings(data);
        }
      })
      .catch((err) => console.error('Failed to load contact settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const validation = contactSchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        const key = `validation${field.charAt(0).toUpperCase() + field.slice(1)}`;
        fieldErrors[field] = t(key);
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errorMessage'));
      }

      toast.success(t('successMessage'));
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('errorMessage')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const phone = liveSettings?.contact_phone || CONTACT_PHONE;
  const email = liveSettings?.contact_email || CONTACT_EMAIL;
  const address = liveSettings?.contact_address || CONTACT_ADDRESS;

  const contactInfo = [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Phone, label: tCommon('contact'), value: phone, href: `tel:${phone}` },
    { icon: MapPin, label: t('hoursLabel'), value: address, href: '#' },
    { icon: Clock, label: t('hoursLabel'), value: t('hoursValue'), href: '#' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          {t('description')}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('formName')}
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={t('placeholderName')}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('formEmail')}
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={t('placeholderEmail')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('formSubject')}
              </label>
              <input
                type="text"
                name="subject"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                placeholder={t('placeholderSubject')}
              />
              {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('formMessage')}
              </label>
              <textarea
                name="message"
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                placeholder={t('placeholderMessage')}
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>
            <Button type="submit" variant="luxury" isLoading={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {t('buttonSend')}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-850 dark:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 dark:bg-gold-500/10">
                  <item.icon className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
                    {item.label}
                  </p>
                  {item.href !== '#' ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-450"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">{item.value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

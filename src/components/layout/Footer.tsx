'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FOOTER_LINKS,
  SOCIAL_LINKS,
} from '@/lib/constants';

const socialLinks = [
  { label: 'Facebook', href: SOCIAL_LINKS.facebook, icon: Facebook },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram, icon: Instagram },
  { label: 'Twitter', href: SOCIAL_LINKS.twitter, icon: Twitter },
  { label: 'Pinterest', href: SOCIAL_LINKS.pinterest, icon: Pin },
];

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className={cn('bg-[#6d415c] text-white', className)}>
      <div className="container-beb py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-semibold tracking-[0.14em] text-white"
            >
              BEB FRAGRANCE
            </Link>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/65">
              {t('tagline')}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(255,255,255,0.68)]">
              {t('description')}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] px-4 py-2 text-xs text-[rgba(255,255,255,0.8)] transition-colors hover:border-[rgba(255,255,255,0.4)] hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-xs text-[rgba(255,255,255,0.68)] transition-colors hover:border-[rgba(255,255,255,0.4)] hover:text-white"
              >
                {CONTACT_PHONE}
              </a>
              <p className="max-w-xs text-xs leading-5 text-[rgba(255,255,255,0.52)]">
                {CONTACT_ADDRESS}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {t('shop')}
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[rgba(255,255,255,0.65)] transition-colors hover:text-[#D4A843]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {t('about')}
            </h3>
            <ul className="space-y-3">
              {[
                { label: t('ourStory'), href: '/about' },
                { label: t('premiumCollections'), href: '/products?featured=true' },
                { label: t('bestSellers'), href: '/products?sort=bestseller' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[rgba(255,255,255,0.65)] transition-colors hover:text-[#D4A843]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.5)] transition-all hover:border-[rgba(255,255,255,0.4)] hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {t('customerCare')}
            </h3>
            <ul className="space-y-3">
              {[...FOOTER_LINKS.help, ...FOOTER_LINKS.legal].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[rgba(255,255,255,0.65)] transition-colors hover:text-[#D4A843]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-10 border-t border-[rgba(255,255,255,0.1)]" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[rgba(255,255,255,0.4)]">
            {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[rgba(255,255,255,0.6)]"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[rgba(255,255,255,0.4)] transition-colors hover:text-[rgba(255,255,255,0.6)]"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

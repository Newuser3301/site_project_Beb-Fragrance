// src/app/robots.ts
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/cart',
          '/checkout',
          '/orders/*',
          '/wishlist',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

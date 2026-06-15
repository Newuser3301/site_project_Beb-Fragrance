// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/constants';
import { canUseDatabase, logFallbackOnce } from '@/lib/app-mode';
import { mockCategories, mockProducts } from '@/lib/mock-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic pages from database — wrap in try-catch to handle missing DB gracefully
  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  if (await canUseDatabase()) {
    try {
      const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      });

      categoryPages = categories.map((cat) => ({
        url: `${SITE_URL}/categories/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      logFallbackOnce(
        'sitemap.categories',
        'Failed to fetch categories for sitemap. Using mock categories instead.',
        error
      );
    }

    try {
      const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
      });

      productPages = products.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      logFallbackOnce(
        'sitemap.products',
        'Failed to fetch products for sitemap. Using mock products instead.',
        error
      );
    }
  }

  if (categoryPages.length === 0) {
    categoryPages = mockCategories.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  if (productPages.length === 0) {
    productPages = mockProducts.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  return [...staticPages, ...categoryPages, ...productPages];
}

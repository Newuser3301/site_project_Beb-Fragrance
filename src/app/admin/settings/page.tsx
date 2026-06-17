// src/app/admin/settings/page.tsx
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SettingsClientPage } from './SettingsClient';

export const metadata: Metadata = {
  title: 'Settings | Beb Fragrance Admin',
  description: 'Manage site configurations and content',
};

export default async function AdminSettingsPage() {
  const [settingsList, categories] = await Promise.all([
    prisma.setting.findMany().catch(() => []),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, image: true },
      orderBy: { sortOrder: 'asc' },
    }).catch(() => []),
  ]);

  const settings = settingsList.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage general configurations, homepage hero layout, categories, and promo banners.
        </p>
      </div>

      <SettingsClientPage initialSettings={settings} initialCategories={categories} />
    </div>
  );
}

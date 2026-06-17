// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

function getGroupForKey(key: string): string {
  if (key.startsWith('hero_')) return 'hero';
  if (key.startsWith('social_') || key.startsWith('site_') || key.startsWith('contact_')) return 'general';
  if (key.startsWith('promo_')) return 'banners';
  return 'general';
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [settingsList, categories] = await Promise.all([
      prisma.setting.findMany(),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, image: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    const settings = settingsList.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ settings, categories });
  } catch (error) {
    console.error('[GET /api/admin/settings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { settings = {}, categoryImages = [] } = body;

    // 1. Bulk update settings key-value entries
    for (const [key, value] of Object.entries(settings)) {
      if (typeof key !== 'string' || typeof value !== 'string') continue;
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          group: getGroupForKey(key),
        },
      });
    }

    // 2. Bulk update category images
    for (const cat of categoryImages) {
      if (!cat.id || typeof cat.image !== 'string') continue;
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: cat.image },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/admin/settings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

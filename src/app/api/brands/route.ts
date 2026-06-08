import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ items: brands });
  } catch (error) {
    console.error('GET /api/brands error:', error);
    return NextResponse.json(
      { error: 'Brendlarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

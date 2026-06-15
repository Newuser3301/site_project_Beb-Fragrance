import { NextResponse } from 'next/server';
import { canUseDatabase, logFallbackOnce } from '@/lib/app-mode';
import { mockProducts } from '@/lib/mock-store';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    if (!(await canUseDatabase())) {
      return NextResponse.json({
        items: [
          {
            id: 'brand-beb',
            name: 'Beb Fragrance',
            slug: 'beb-fragrance',
            logo: null,
            _count: { products: mockProducts.length },
          },
        ],
      });
    }

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
    logFallbackOnce(
      'api.brands',
      'Brands API failed. Returning mock brand data.',
      error
    );
    return NextResponse.json({
      items: [
        {
          id: 'brand-beb',
          name: 'Beb Fragrance',
          slug: 'beb-fragrance',
          logo: null,
          _count: { products: mockProducts.length },
        },
      ],
    });
  }
}

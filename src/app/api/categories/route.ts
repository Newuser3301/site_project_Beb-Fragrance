import { NextResponse } from 'next/server';
import { canUseDatabase, logFallbackOnce } from '@/lib/app-mode';
import { mockCategories } from '@/lib/mock-store';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    if (!(await canUseDatabase())) {
      return NextResponse.json({
        items: mockCategories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          _count: { products: 0 },
        })),
      });
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ items: categories });
  } catch (error) {
    logFallbackOnce(
      'api.categories',
      'Categories API failed. Returning mock categories.',
      error
    );
    return NextResponse.json({
      items: mockCategories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        _count: { products: 0 },
      })),
    });
  }
}

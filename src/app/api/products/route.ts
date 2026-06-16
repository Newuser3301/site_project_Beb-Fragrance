import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  buildProductCreateData,
  findOrCreateBrand,
  formatProductResponse,
  isValidImageUrl,
  productInclude,
} from '@/lib/product-helpers';
import { slugify } from '@/lib/utils';
import {
  mapGenderToPrisma,
  productSchema,
  searchParamsSchema,
} from '@/lib/validations';
import { canUseDatabase, logFallbackOnce } from '@/lib/app-mode';
import { getMockProducts } from '@/lib/mock-store';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

function buildWhereClause(
  params: ReturnType<typeof searchParamsSchema.parse>
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (params.category) {
    where.category = {
      OR: [{ slug: params.category }, { id: params.category }],
    };
  }

  if (params.gender) {
    where.gender = mapGenderToPrisma(params.gender);
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { brand: { name: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  if (params.brand) {
    where.brand = {
      OR: [{ slug: params.brand }, { id: params.brand }, { name: params.brand }],
    };
  }

  if (
    params.volume !== undefined ||
    params.minPrice !== undefined ||
    params.maxPrice !== undefined
  ) {
    where.variants = {
      some: {
        isActive: true,
        ...(params.volume !== undefined ? { sizeMl: params.volume } : {}),
        ...(params.minPrice !== undefined || params.maxPrice !== undefined
          ? {
              price: {
                ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
                ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
              },
            }
          : {}),
      },
    };
  }

  if (params.exclude) {
    where.NOT = {
      OR: [{ id: params.exclude }, { slug: params.exclude }],
    };
  }

  return where;
}

function buildOrderBy(
  sort: string
): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'price-asc':
      return { variants: { _count: 'asc' } };
    case 'price-desc':
      return { variants: { _count: 'desc' } };
    case 'name-asc':
      return { name: 'asc' };
    case 'name-desc':
      return { name: 'desc' };
    case 'bestseller':
      return [{ isBestseller: 'desc' }, { createdAt: 'desc' }];
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = searchParamsSchema.safeParse(rawParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Noto\'g\'ri qidiruv parametrlari',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const params = parseResult.data;
    if (!(await canUseDatabase())) {
      return NextResponse.json(getMockProducts(params));
    }

    const where = buildWhereClause(params);
    const skip = (params.page - 1) * params.limit;
    const isPriceSort =
      params.sort === 'price-asc' || params.sort === 'price-desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        ...(isPriceSort
          ? {}
          : {
              skip,
              take: params.limit,
              orderBy: buildOrderBy(params.sort),
            }),
      }),
      prisma.product.count({ where }),
    ]);

    let sortedProducts = products;

    if (isPriceSort) {
      const sorted = [...products].sort((a, b) => {
        const activeVariantsA = a.variants.filter((variant) => variant.isActive);
        const activeVariantsB = b.variants.filter((variant) => variant.isActive);
        const priceA = activeVariantsA[0] ? Number(activeVariantsA[0].price) : 0;
        const priceB = activeVariantsB[0] ? Number(activeVariantsB[0].price) : 0;
        return params.sort === 'price-asc' ? priceA - priceB : priceB - priceA;
      });

      sortedProducts = sorted.slice(skip, skip + params.limit);
    }

    const totalPages = Math.ceil(total / params.limit);
    const hasMore = params.page < totalPages;

    const productIds = sortedProducts.map((product) => product.id);
    const reviewStats =
      productIds.length > 0
        ? await prisma.review.groupBy({
            by: ['productId'],
            where: {
              productId: { in: productIds },
              isApproved: true,
            },
            _avg: { rating: true },
            _count: { rating: true },
          })
        : [];

    const statsMap = new Map(
      reviewStats.map((stat) => [
        stat.productId,
        {
          averageRating: stat._avg.rating
            ? Math.round(stat._avg.rating * 10) / 10
            : 0,
          reviewCount: stat._count.rating,
        },
      ])
    );

    return NextResponse.json({
      items: sortedProducts.map((product) => {
        const formatted = formatProductResponse(product);
        const stats = statsMap.get(product.id);
        return {
          ...formatted,
          averageRating: stats?.averageRating ?? 0,
          reviewCount: stats?.reviewCount ?? 0,
        };
      }),
      total,
      page: params.page,
      totalPages,
      hasMore,
    });
  } catch (error) {
    logFallbackOnce(
      'api.products.get',
      'Products API query failed. Falling back to mock products.',
      error
    );
    const fallbackParams = searchParamsSchema.parse({});
    return NextResponse.json(getMockProducts(fallbackParams));
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    if (!ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validatsiya xatosi',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const invalidImages = data.images.filter((url) => !isValidImageUrl(url));
    if (invalidImages.length > 0) {
      return NextResponse.json(
        { error: 'Noto\'g\'ri rasm URL formati', invalidUrls: invalidImages },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kategoriya topilmadi' },
        { status: 404 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug: slugify(data.name) },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Bu nomdagi mahsulot allaqachon mavjud' },
        { status: 409 }
      );
    }

    const brand = await findOrCreateBrand(prisma, data.brand);

    const product = await prisma.product.create({
      data: buildProductCreateData(data, brand.id),
      include: productInclude,
    });

    return NextResponse.json(formatProductResponse(product), { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Mahsulot yaratishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

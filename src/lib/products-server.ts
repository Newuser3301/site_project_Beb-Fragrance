import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  formatProductResponse,
  productDetailInclude,
  productInclude,
  type ProductDisplay,
} from '@/lib/product-helpers';
import {
  getMockCategoryBySlug,
  getMockProductBySlug,
  getMockProducts,
  mockCategories,
  mockProducts,
} from '@/lib/mock-store';
import type { ReviewWithUser } from '@/types';
import { mapGenderToPrisma, type GenderInput } from '@/lib/validations';
import { canUseDatabase, logFallbackOnce } from '@/lib/app-mode';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  gender?: GenderInput;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  brand?: string;
  brands?: string[];
  volume?: number;
  featured?: boolean;
  bestseller?: boolean;
  exclude?: string;
}

export interface ProductsResult {
  items: Array<
    ProductDisplay & {
      averageRating: number;
      reviewCount: number;
    }
  >;
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductDetailResult extends ProductDisplay {
  averageRating: number;
  reviewCount: number;
  reviews?: ReviewWithUser[];
}

function buildWhereClause(query: ProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (query.category) {
    where.category = {
      OR: [{ slug: query.category }, { id: query.category }],
    };
  }

  if (query.gender) {
    where.gender = mapGenderToPrisma(query.gender);
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { brand: { name: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  if (query.brands && query.brands.length > 0) {
    where.brand = { name: { in: query.brands } };
  } else if (query.brand) {
    where.brand = {
      OR: [{ slug: query.brand }, { id: query.brand }, { name: query.brand }],
    };
  }

  if (query.featured) {
    where.isFeatured = true;
  }

  if (query.bestseller) {
    where.isBestseller = true;
  }

  if (
    query.volume !== undefined ||
    query.minPrice !== undefined ||
    query.maxPrice !== undefined
  ) {
    where.variants = {
      some: {
        isActive: true,
        ...(query.volume !== undefined ? { sizeMl: query.volume } : {}),
        ...(query.minPrice !== undefined || query.maxPrice !== undefined
          ? {
              price: {
                ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
                ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
              },
            }
          : {}),
      },
    };
  }

  if (query.exclude) {
    where.NOT = {
      OR: [{ id: query.exclude }, { slug: query.exclude }],
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
    case 'name-asc':
      return { name: 'asc' };
    case 'name-desc':
      return { name: 'desc' };
    case 'bestseller':
      return [{ isBestseller: 'desc' }, { createdAt: 'desc' }];
    case 'price-asc':
    case 'price-desc':
      return { createdAt: 'desc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

async function attachReviewStats(
  products: Prisma.ProductGetPayload<{ include: typeof productInclude }>[]
) {
  const productIds = products.map((product) => product.id);

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

  return products.map((product) => {
    const formatted = formatProductResponse(product);
    const stats = statsMap.get(product.id);
    return {
      ...formatted,
      averageRating: stats?.averageRating ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
    };
  });
}

export async function fetchProducts(
  query: ProductsQuery = {}
): Promise<ProductsResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;

  try {
    if (!(await canUseDatabase())) {
      return getMockProducts(query);
    }

    const sort = query.sort ?? 'newest';
    const where = buildWhereClause(query);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        skip,
        take: limit,
        orderBy: buildOrderBy(sort),
      }),
      prisma.product.count({ where }),
    ]);

    let sortedProducts = products;

    if (sort === 'price-asc' || sort === 'price-desc') {
      sortedProducts = [...products].sort((a, b) => {
        const priceA = a.variants[0] ? Number(a.variants[0].price) : 0;
        const priceB = b.variants[0] ? Number(b.variants[0].price) : 0;
        return sort === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
    }

    const items = await attachReviewStats(sortedProducts);
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch (error) {
    logFallbackOnce(
      'products-server.fetchProducts',
      'Product catalog query failed. Serving mock products instead.',
      error
    );
    return getMockProducts(query);
  }
}

export async function fetchProductBySlug(
  slug: string
): Promise<ProductDetailResult | null> {
  try {
    if (!(await canUseDatabase())) {
      return getMockProductBySlug(slug) as ProductDetailResult | null;
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: productDetailInclude,
    });

    if (!product) {
      return null;
    }

    const [aggregate, reviewCount] = await Promise.all([
      prisma.review.aggregate({
        where: { productId: product.id, isApproved: true },
        _avg: { rating: true },
      }),
      prisma.review.count({
        where: { productId: product.id, isApproved: true },
      }),
    ]);

    const formatted = formatProductResponse(product);

    return {
      ...formatted,
      averageRating: aggregate._avg.rating
        ? Math.round(aggregate._avg.rating * 10) / 10
        : 0,
      reviewCount,
      reviews: 'reviews' in product ? product.reviews : [],
    };
  } catch (error) {
    logFallbackOnce(
      'products-server.fetchProductBySlug',
      `Product detail query failed for "${slug}". Serving mock product instead.`,
      error
    );
    return getMockProductBySlug(slug) as ProductDetailResult | null;
  }
}

export async function fetchCategoryBySlug(slug: string) {
  try {
    if (!(await canUseDatabase())) {
      return getMockCategoryBySlug(slug);
    }

    return await prisma.category.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
    });
  } catch (error) {
    logFallbackOnce(
      'products-server.fetchCategoryBySlug',
      `Category query failed for "${slug}". Serving mock category instead.`,
      error
    );
    return getMockCategoryBySlug(slug);
  }
}

export async function fetchCategories() {
  try {
    if (!(await canUseDatabase())) {
      return mockCategories;
    }

    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    logFallbackOnce(
      'products-server.fetchCategories',
      'Category query failed. Serving mock categories instead.',
      error
    );
    return mockCategories;
  }
}

export async function fetchFeaturedProducts(limit: number = 4) {
  const result = await fetchProducts({ featured: true, limit, page: 1 });
  return result.items;
}

export async function fetchBestsellerProducts(limit: number = 4) {
  const result = await fetchProducts({
    bestseller: true,
    limit,
    page: 1,
    sort: 'bestseller',
  });
  return result.items;
}

export async function fetchProductSlugs() {
  try {
    if (!(await canUseDatabase())) {
      return mockProducts.map((product) => ({ slug: product.slug }));
    }

    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      take: 100,
    });
    return products.map((product) => ({ slug: product.slug }));
  } catch (error) {
    logFallbackOnce(
      'products-server.fetchProductSlugs',
      'Product slug query failed. Serving mock slugs instead.',
      error
    );
    return mockProducts.map((product) => ({ slug: product.slug }));
  }
}

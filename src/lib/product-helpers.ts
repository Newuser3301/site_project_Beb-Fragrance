import type { Prisma } from '@prisma/client';
import {
  mapGenderFromPrisma,
  mapGenderToPrisma,
  mapNotesToPrisma,
  type ProductInput,
  type ProductUpdateInput,
} from '@/lib/validations';
import { slugify } from '@/lib/utils';

export const productInclude = {
  category: true,
  brand: true,
  images: {
    orderBy: { sortOrder: 'asc' as const },
  },
  variants: {
    where: { isActive: true },
    orderBy: { price: 'asc' as const },
  },
  notes: true,
} satisfies Prisma.ProductInclude;

export const productDetailInclude = {
  ...productInclude,
  reviews: {
    where: { isApproved: true },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

type ProductDetail = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;

export type ProductDisplay = ReturnType<typeof formatProductResponse>;

export function formatProductResponse(product: ProductWithRelations | ProductDetail) {
  const primaryVariant = product.variants[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    sku: product.sku,
    gender: mapGenderFromPrisma(product.gender),
    fragranceFamily: product.fragranceFamily,
    concentration: product.concentration,
    price: primaryVariant ? Number(primaryVariant.price) : 0,
    comparePrice: primaryVariant?.comparePrice
      ? Number(primaryVariant.comparePrice)
      : null,
    stock: primaryVariant?.stock ?? 0,
    volume: primaryVariant?.sizeMl ?? 0,
    brand: product.brand.name,
    brandId: product.brandId,
    category: product.category,
    categoryId: product.categoryId,
    featured: product.isFeatured,
    isActive: product.isActive,
    isNewArrival: product.isNewArrival,
    isBestseller: product.isBestseller,
    images: product.images.map((image) => image.url),
    notes: product.notes.map((note) => note.name),
    notesDetailed: product.notes.map((note) => ({
      name: note.name,
      type: note.type,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      sku: variant.sku,
      size: variant.size,
      sizeMl: variant.sizeMl,
      price: Number(variant.price),
      comparePrice: variant.comparePrice ? Number(variant.comparePrice) : null,
      stock: variant.stock,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    ...('reviews' in product
      ? {
          reviews: product.reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: review.createdAt,
            user: review.user,
          })),
        }
      : {}),
  };
}

export async function findOrCreateBrand(
  prisma: Prisma.TransactionClient | import('@prisma/client').PrismaClient,
  brandName: string
) {
  const slug = slugify(brandName);

  return prisma.brand.upsert({
    where: { name: brandName },
    update: {},
    create: {
      name: brandName,
      slug,
      isActive: true,
    },
  });
}

export function buildProductCreateData(
  data: ProductInput,
  brandId: string
): Prisma.ProductCreateInput {
  const productSlug = slugify(data.name);
  const productSku = `BF-${productSlug.toUpperCase().replace(/-/g, '')}-${data.volume}`;

  return {
    name: data.name,
    slug: productSlug,
    description: data.description,
    shortDescription: data.description.slice(0, 150),
    sku: productSku,
    gender: mapGenderToPrisma(data.gender),
    isFeatured: data.featured,
    isActive: true,
    brand: { connect: { id: brandId } },
    category: { connect: { id: data.categoryId } },
    images: {
      create: data.images.map((url, index) => ({
        url,
        alt: data.name,
        isPrimary: index === 0,
        sortOrder: index,
      })),
    },
    variants: {
      create: {
        name: `${data.volume}ml`,
        sku: `${productSku}-VAR`,
        size: `${data.volume}ml`,
        sizeMl: data.volume,
        price: data.price,
        comparePrice: data.comparePrice,
        stock: data.stock,
        isActive: true,
      },
    },
    notes: {
      create: mapNotesToPrisma(data.notes),
    },
  };
}

export function buildProductUpdateData(
  data: ProductUpdateInput
): Prisma.ProductUpdateInput {
  const updateData: Prisma.ProductUpdateInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
    updateData.slug = slugify(data.name);
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
    updateData.shortDescription = data.description.slice(0, 150);
  }

  if (data.gender !== undefined) {
    updateData.gender = mapGenderToPrisma(data.gender);
  }

  if (data.featured !== undefined) {
    updateData.isFeatured = data.featured;
  }

  if (data.categoryId !== undefined) {
    updateData.category = { connect: { id: data.categoryId } };
  }

  return updateData;
}

export function buildVariantUpdateData(
  data: ProductUpdateInput
): Prisma.ProductVariantUpdateInput | null {
  if (
    data.price === undefined &&
    data.comparePrice === undefined &&
    data.stock === undefined &&
    data.volume === undefined
  ) {
    return null;
  }

  const variantUpdate: Prisma.ProductVariantUpdateInput = {};

  if (data.price !== undefined) {
    variantUpdate.price = data.price;
  }

  if (data.comparePrice !== undefined) {
    variantUpdate.comparePrice = data.comparePrice;
  }

  if (data.stock !== undefined) {
    variantUpdate.stock = data.stock;
  }

  if (data.volume !== undefined) {
    variantUpdate.sizeMl = data.volume;
    variantUpdate.size = `${data.volume}ml`;
    variantUpdate.name = `${data.volume}ml`;
  }

  return variantUpdate;
}

export function calculateAverageRating(
  reviews: Array<{ rating: number }>
): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function calculateDiscountPercent(
  price: number,
  comparePrice: number | null
): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

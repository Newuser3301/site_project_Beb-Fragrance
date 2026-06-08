// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

// ── Validation Schemas ──────────────────────────────────────────────
const productCreateSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().optional(),
  description: z.string().min(10).max(5000),
  brand: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).default('UNISEX'),
  volume: z.number().int().min(1).default(50),
  notes: z.array(z.string().min(1)).max(10).optional().default([]),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).min(1).max(5),
});

const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().min(1),
});

// ── Helper: ensure unique slug ──────────────────────────────────────
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;
  while (true) {
    const existing = await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return slug;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
}

// ── GET ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10));
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('categoryId') ?? '';
    const gender = searchParams.get('gender') ?? '';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (gender) where.gender = gender;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          images: { where: { isPrimary: true }, take: 1 },
          variants: { orderBy: { price: 'asc' }, take: 1 },
          _count: { select: { variants: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[GET /api/admin/products]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Ensure or find brand
    let brand = await prisma.brand.findFirst({
      where: { name: { equals: data.brand, mode: 'insensitive' } },
    });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: data.brand, slug: slugify(data.brand) },
      });
    }

    // Generate unique slug + sku
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    const sku = `BF-${Date.now().toString(36).toUpperCase()}`;
    const variantSku = `${sku}-${data.volume}ML`;

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          slug: uniqueSlug,
          sku,
          description: data.description,
          brandId: brand!.id,
          categoryId: data.categoryId,
          gender: data.gender,
          isFeatured: data.isFeatured,
          isActive: true,
        },
      });

      // Create variant
      await tx.productVariant.create({
        data: {
          productId: newProduct.id,
          name: `${data.volume}ml`,
          sku: variantSku,
          size: `${data.volume}ml`,
          sizeMl: data.volume,
          price: data.price,
          stock: data.stock,
          isActive: true,
        },
      });

      // Create images
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url, idx) => ({
            productId: newProduct.id,
            url,
            alt: `${data.name} - ${idx + 1}`,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        });
      }

      // Create notes
      const validNotes = data.notes.filter((n) => n.trim());
      if (validNotes.length > 0) {
        await tx.productNote.createMany({
          data: validNotes.map((note, idx) => ({
            productId: newProduct.id,
            name: note.trim(),
            type: idx === 0 ? 'TOP' : idx === 1 ? 'MIDDLE' : 'BASE',
          })),
        });
      }

      return newProduct;
    });

    return NextResponse.json(
      { product, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/admin/products]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── PUT ─────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, brand: brandName, slug, images, notes, stock, price, volume, ...rest } =
      parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = await prisma.$transaction(async (tx) => {
      let brandId = existing.brandId;
      if (brandName) {
        let brand = await tx.brand.findFirst({
          where: { name: { equals: brandName, mode: 'insensitive' } },
        });
        if (!brand) {
          brand = await tx.brand.create({
            data: { name: brandName, slug: slugify(brandName) },
          });
        }
        brandId = brand.id;
      }

      let finalSlug = existing.slug;
      if (slug) finalSlug = await ensureUniqueSlug(slugify(slug), id);

      const { categoryId, gender, isFeatured } = rest;

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(rest.name !== undefined ? { name: rest.name } : {}),
          ...(rest.description !== undefined ? { description: rest.description } : {}),
          slug: finalSlug,
          brandId,
          ...(categoryId ? { categoryId } : {}),
          ...(gender ? { gender } : {}),
          ...(isFeatured !== undefined ? { isFeatured } : {}),
        },
      });

      // Update variant
      if (price !== undefined || stock !== undefined || volume !== undefined) {
        const variant = await tx.productVariant.findFirst({ where: { productId: id } });
        if (variant) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              ...(price !== undefined ? { price } : {}),
              ...(stock !== undefined ? { stock } : {}),
              ...(volume !== undefined
                ? { size: `${volume}ml`, sizeMl: volume, name: `${volume}ml` }
                : {}),
            },
          });
        }
      }

      if (images && images.length > 0) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((url, idx) => ({
            productId: id,
            url,
            alt: `Product image ${idx + 1}`,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        });
      }

      if (notes !== undefined) {
        await tx.productNote.deleteMany({ where: { productId: id } });
        const validNotes = notes.filter((n) => n.trim());
        if (validNotes.length > 0) {
          await tx.productNote.createMany({
            data: validNotes.map((note, idx) => ({
              productId: id,
              name: note.trim(),
              type: idx === 0 ? 'TOP' : idx === 1 ? 'MIDDLE' : 'BASE',
            })),
          });
        }
      }

      return updated;
    });

    return NextResponse.json({ product, message: 'Product updated successfully' });
  } catch (error) {
    console.error('[PUT /api/admin/products]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE ──────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id } = z.object({ id: z.string().min(1) }).parse(body);

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/admin/products]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

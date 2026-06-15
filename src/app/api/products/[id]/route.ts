import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  buildProductUpdateData,
  buildVariantUpdateData,
  findOrCreateBrand,
  formatProductResponse,
  isValidImageUrl,
  productDetailInclude,
  productInclude,
} from '@/lib/product-helpers';
import { productUpdateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        isActive: true,
      },
      include: productDetailInclude,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatProductResponse(product));
  } catch (error) {
    console.error(`GET /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Mahsulotni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    if (!ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        variants: { take: 1, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parseResult = productUpdateSchema.safeParse(body);

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

    if (data.images) {
      const invalidImages = data.images.filter((url) => !isValidImageUrl(url));
      if (invalidImages.length > 0) {
        return NextResponse.json(
          { error: 'Noto\'g\'ri rasm URL formati', invalidUrls: invalidImages },
          { status: 400 }
        );
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Kategoriya topilmadi' },
          { status: 404 }
        );
      }
    }

    if (data.brand) {
      const brand = await findOrCreateBrand(prisma, data.brand);
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: { brandId: brand.id },
      });
    }

    const productUpdateData = buildProductUpdateData(data);
    const variantUpdateData = buildVariantUpdateData(data);

    await prisma.$transaction(async (tx) => {
      if (Object.keys(productUpdateData).length > 0) {
        await tx.product.update({
          where: { id: existingProduct.id },
          data: productUpdateData,
        });
      }

      if (variantUpdateData && existingProduct.variants[0]) {
        await tx.productVariant.update({
          where: { id: existingProduct.variants[0].id },
          data: variantUpdateData,
        });
      }

      if (data.images) {
        await tx.productImage.deleteMany({
          where: { productId: existingProduct.id },
        });

        await tx.productImage.createMany({
          data: data.images.map((url, index) => ({
            productId: existingProduct.id,
            url,
            alt: data.name || existingProduct.name,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        });
      }

      if (data.notes) {
        await tx.productNote.deleteMany({
          where: { productId: existingProduct.id },
        });

        const noteTypes = ['TOP', 'MIDDLE', 'BASE'] as const;
        await tx.productNote.createMany({
          data: data.notes.map((name, index) => ({
            productId: existingProduct.id,
            name,
            type: noteTypes[index % noteTypes.length],
          })),
        });
      }
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id: existingProduct.id },
      include: productInclude,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Yangilangan mahsulot topilmadi' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatProductResponse(updatedProduct));
  } catch (error) {
    console.error(`PUT /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Mahsulotni yangilashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    if (!ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: existingProduct.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Mahsulotni o\'chirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

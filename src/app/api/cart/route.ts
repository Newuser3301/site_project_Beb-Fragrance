// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10),
});

const removeItemSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
});

// GET /api/cart — user's cart items
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                brand: { select: { name: true } },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      brand: item.product.brand.name,
      image: item.product.images[0]?.url ?? '',
      price: Number(item.variant.price),
      volume: item.variant.size,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('[GET /api/cart]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cart — add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = addItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = parsed.data;

    // Check product and variant exist
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, productId, isActive: true },
    });

    if (!variant) {
      return NextResponse.json({ error: 'Product variant not found' }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} items available in stock` },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.user.id } });
    }

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });

    let cartItem;
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > variant.stock) {
        return NextResponse.json(
          { error: `Cannot add more than ${variant.stock} items` },
          { status: 400 }
        );
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId, quantity },
      });
    }

    return NextResponse.json({ success: true, cartItem }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/cart]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/cart — update item quantity
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const schema = z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().min(0).max(10),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    const { variantId, quantity } = parsed.data;

    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, variantId },
      });
      return NextResponse.json({ success: true, removed: true });
    }

    const updated = await prisma.cartItem.updateMany({
      where: { cartId: cart.id, variantId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('[PATCH /api/cart]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/cart — remove item
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = removeItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    const { variantId } = parsed.data;

    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, variantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/cart]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

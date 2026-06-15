// src/app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// GET - Get all wishlist items for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            category: true,
            reviews: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const items = wishlistItems.map((item) => ({
      ...item.product,
      wishlistItemId: item.id,
      addedAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('[WISHLIST_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
const wishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = wishlistSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { productId } = validation.data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Item already in wishlist', item: existing },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        item: {
          ...wishlistItem.product,
          wishlistItemId: wishlistItem.id,
          addedAt: wishlistItem.createdAt,
        },
        message: 'Added to wishlist',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[WISHLIST_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
const deleteWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = deleteWishlistSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { productId } = validation.data;

    // Find the wishlist item
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    // Delete the wishlist item
    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return NextResponse.json({
      message: 'Removed from wishlist',
    });
  } catch (error) {
    console.error('[WISHLIST_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
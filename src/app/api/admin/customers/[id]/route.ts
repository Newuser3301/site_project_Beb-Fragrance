// src/app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get single customer details (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get customer details
    const customer = await prisma.user.findUnique({
      where: {
        id,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phone: true,
        image: true,
        addresses: {
          select: { id: true, street: true, city: true, phone: true },
        },
        createdAt: true,
        updatedAt: true,
        orders: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: {
                      take: 1,
                      orderBy: { sortOrder: 'asc' },
                      select: { url: true },
                    },
                    brand: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        reviews: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: 'asc' },
                  select: { url: true },
                },
                slug: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        wishlistItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: {
                  take: 1,
                  orderBy: { sortOrder: 'asc' },
                  select: { url: true },
                },
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalSpent = customer.orders
      .filter((order) => order.status !== 'CANCELLED')
      .reduce((sum, order) => sum + Number(order.total), 0);

    const averageOrderValue =
      customer.orders.filter((order) => order.status !== 'CANCELLED').length > 0
        ? totalSpent /
          customer.orders.filter((order) => order.status !== 'CANCELLED').length
        : 0;

    const averageRating =
      customer.reviews.length > 0
        ? customer.reviews.reduce((sum, r) => sum + r.rating, 0) /
          customer.reviews.length
        : 0;

    // Get order status distribution
    const orderStats = {
      pending: customer.orders.filter((o) => o.status === 'PENDING').length,
      processing: customer.orders.filter((o) => o.status === 'PROCESSING').length,
      shipped: customer.orders.filter((o) => o.status === 'SHIPPED').length,
      delivered: customer.orders.filter((o) => o.status === 'DELIVERED').length,
      cancelled: customer.orders.filter((o) => o.status === 'CANCELLED').length,
    };

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        emailVerified: customer.emailVerified,
        phone: customer.phone,
        image: customer.image,
        addresses: customer.addresses,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        stats: {
          totalOrders: customer._count.orders,
          totalReviews: customer._count.reviews,
          totalSpent,
          averageOrderValue,
          averageRating,
          orderStats,
        },
        orders: customer.orders,
        reviews: customer.reviews,
        wishlist: customer.wishlistItems.map((item) => ({
          ...item.product,
          addedAt: item.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('[ADMIN_CUSTOMER_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
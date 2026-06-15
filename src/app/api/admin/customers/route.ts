// src/app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Get all customers (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {
      role: 'CUSTOMER', // Only get customers, not admins
    };

    // Search by name or email
    if (search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get customers and total count
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
          orders: {
            select: {
              total: true,
              status: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate total spent for each customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.orders
        .filter((order) => order.status !== 'CANCELLED')
        .reduce((sum, order) => sum + Number(order.total), 0);

      const completedOrders = customer.orders.filter(
        (order) => order.status === 'DELIVERED'
      ).length;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        image: customer.image,
        createdAt: customer.createdAt,
        stats: {
          totalOrders: customer._count.orders,
          completedOrders,
          totalSpent,
          totalReviews: customer._count.reviews,
        },
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      customers: customersWithStats,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error('[ADMIN_CUSTOMERS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      revenueResult,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      pendingOrders,
      lowStockVariants,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      }),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.productVariant.count({ where: { stock: { lte: 5 }, isActive: true } }),
    ]);

    return NextResponse.json({
      totalRevenue: Number(revenueResult._sum.total ?? 0),
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockVariants,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt,
        user: order.user,
      })),
    });
  } catch (error) {
    console.error('[GET /api/admin/stats]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

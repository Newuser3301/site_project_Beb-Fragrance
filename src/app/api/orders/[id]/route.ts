// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
        },
        shippingAddress: true,
        billingAddress: true,
        coupon: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure the order belongs to the requesting user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`[GET /api/orders/${params.id}]`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

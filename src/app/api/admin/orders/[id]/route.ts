// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/email';

// GET - Get single order details (admin only)
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        items: {
          include: {                product: {
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
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('[ADMIN_ORDER_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update order status (admin only)
const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export async function PUT(
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

    const body = await request.json();

    // Validate input
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { status: newStatus } = validation.data;

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      PENDING: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    const currentStatus = currentOrder.status;
    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot change status from ${currentStatus} to ${newStatus}`,
          allowedTransitions,
        },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // If order was cancelled, restore stock (update stock on ProductVariant)
    if (newStatus === 'CANCELLED') {
      for (const item of currentOrder.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // Send email notifications
    try {
      if (currentOrder.user.email) {
        if (newStatus === 'PROCESSING') {
          await sendOrderConfirmation(
            currentOrder.id,
            currentOrder.user.email,
            currentOrder.user.name || 'Valued Customer',
            {
              orderNumber: currentOrder.orderNumber,
              items: currentOrder.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
              })),
              subtotal: Number(currentOrder.subtotal),
              shippingCost: Number(currentOrder.shippingCost),
              tax: Number(currentOrder.tax),
              discount: Number(currentOrder.discount),
            },
            Number(currentOrder.total)
          );
        }

        if (newStatus === 'SHIPPED') {
          await sendAdminNotification(
            currentOrder.id,
            currentOrder.user.name || 'Valued Customer',
            Number(currentOrder.total)
          );
        }
      }
    } catch (emailError) {
      console.error('[ADMIN_ORDER_EMAIL]', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      order: updatedOrder,
      message: `Order status updated to ${newStatus}`,
    });
  } catch (error) {
    console.error('[ADMIN_ORDER_PUT]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order (admin only, optional)
export async function DELETE(
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

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow deleting cancelled orders
    if (order.status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Only cancelled orders can be deleted' },
        { status: 400 }
      );
    }

    // Delete order items first, then order
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('[ADMIN_ORDER_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
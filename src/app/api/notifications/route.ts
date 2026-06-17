import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

    const notifications = await prisma.notification.findMany({
      where: isAdmin
        ? { userId: null }
        : { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('[GET /api/notifications]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

    const body = await request.json();
    const { id, markAllAsRead } = body;

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: isAdmin
          ? { userId: null, isRead: false }
          : { userId: session.user.id, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (id) {
      const notif = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notif) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }

      // Allow admin to read any admin notification, or customer to read their own
      if (notif.userId !== null && notif.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    console.error('[PATCH /api/notifications]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

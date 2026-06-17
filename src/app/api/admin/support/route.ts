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

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && ['NEW', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      where.status = status;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('[GET /api/admin/support]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// src/app/api/admin/subscribers/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { isActive } = body;

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        isActive,
        unsubscribedAt: isActive ? null : new Date(),
      },
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error('[PATCH /api/admin/subscribers/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/subscribers/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

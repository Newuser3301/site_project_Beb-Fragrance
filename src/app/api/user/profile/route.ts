import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ruxsat etilmagan.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." }, { status: 400 });
    }

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return NextResponse.json({ error: 'Yaroqli email kiriting.' }, { status: 400 });
    }

    // Check if email already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        id: { not: session.user.id },
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Ushbu email boshqa hisob tomonidan ishlatilmoqda.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[API_USER_PROFILE_PUT]', error);
    return NextResponse.json({ error: 'Profilni saqlashda xatolik yuz berdi.' }, { status: 500 });
  }
}

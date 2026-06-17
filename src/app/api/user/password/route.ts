import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ruxsat etilmagan.' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Barcha maydonlarni to‘ldiring.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak." },
        { status: 400 }
      );
    }

    // Check password complexity (letters and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { error: "Yangi parol tarkibida kamida bitta harf va bitta raqam bo'lishi shart." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi.' }, { status: 404 });
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Hozirgi parol noto‘g‘ri.' }, { status: 400 });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API_USER_PASSWORD_PUT]', error);
    return NextResponse.json({ error: 'Parolni yangilashda xatolik yuz berdi.' }, { status: 500 });
  }
}

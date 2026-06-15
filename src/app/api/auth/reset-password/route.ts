import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim();
    const password = body.password?.trim();

    if (!token) {
      return NextResponse.json({ error: 'Reset token topilmadi.' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak.' },
        { status: 400 }
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Reset token yaroqsiz yoki muddati tugagan.' },
        { status: 400 }
      );
    }

    const email = verificationToken.identifier.replace(/^password-reset:/, '');
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AUTH_RESET_PASSWORD_POST]', error);
    return NextResponse.json(
      { error: 'Parolni yangilashda xatolik yuz berdi.' },
      { status: 500 }
    );
  }
}

import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { isResendEnabled } from '@/lib/app-mode';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { SITE_URL } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Yaroqli email kiriting.' }, { status: 400 });
    }

    if (!isResendEnabled()) {
      return NextResponse.json(
        {
          error:
            'Parolni tiklash xizmati vaqtincha ishlamayapti. Iltimos, support bilan bog‘laning.',
        },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString('hex');
    const identifier = `password-reset:${email}`;
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    });

    const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, user.name ?? 'Customer', resetUrl);

    return NextResponse.json({
      success: true,
      ...(process.env.NODE_ENV !== 'production' ? { previewUrl: resetUrl } : {}),
    });
  } catch (error) {
    console.error('[AUTH_FORGOT_PASSWORD_POST]', error);
    return NextResponse.json(
      { error: 'Reset link yuborishda xatolik yuz berdi.' },
      { status: 500 }
    );
  }
}

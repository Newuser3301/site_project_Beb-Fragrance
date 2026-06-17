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

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      // Return success: true so we don't leak registered emails
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

    if (isResendEnabled()) {
      await sendPasswordResetEmail(user.email, user.name ?? 'Customer', resetUrl);
    } else {
      console.log(`\n========================================\n[DEV RESET LINK] password reset url for ${email}:\n${resetUrl}\n========================================\n`);
    }

    return NextResponse.json({
      success: true,
      ...(!isResendEnabled() ? { previewUrl: resetUrl } : {}),
    });
  } catch (error) {
    console.error('[AUTH_FORGOT_PASSWORD_POST]', error);
    return NextResponse.json(
      { error: 'Reset link yuborishda xatolik yuz berdi.' },
      { status: 500 }
    );
  }
}

// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { canUseDatabase } from '@/lib/app-mode';
import { prisma } from '@/lib/prisma';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = newsletterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email', details: validation.error.errors },
        { status: 400 }
      );
    }

    const email = validation.data.email.trim().toLowerCase();
    const databaseReady = await canUseDatabase();

    if (!databaseReady) {
      return NextResponse.json(
        { error: 'Newsletter service is temporarily unavailable' },
        { status: 503 }
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        isActive: true,
        unsubscribedAt: null,
      },
      create: {
        email,
      },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[NEWSLETTER_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

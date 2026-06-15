// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    const { email } = validation.data;

    // In production, save email to database or email service
    console.log('[NEWSLETTER] New subscriber:', email);

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

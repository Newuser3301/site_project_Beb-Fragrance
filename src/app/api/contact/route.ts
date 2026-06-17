// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isResendEnabled } from '@/lib/app-mode';
import { sendContactMessageEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Save support ticket in the database
    let ticket;
    try {
      ticket = await prisma.supportTicket.create({
        data: {
          name,
          email,
          subject,
          message,
          status: 'NEW',
        },
      });

      // Dispatch admin notification
      await prisma.notification.create({
        data: {
          userId: null,
          message: `Yangi murojaat: ${name} - ${subject}`,
          type: 'NEW_TICKET',
          isRead: false,
        },
      });
    } catch (dbError) {
      console.error('[CONTACT_DB_ERROR]', dbError);
    }

    // Try sending email if Resend is enabled, but don't crash if not
    if (isResendEnabled()) {
      try {
        await sendContactMessageEmail({ name, email, subject, message });
      } catch (emailError) {
        console.error('[CONTACT_EMAIL_ERROR]', emailError);
      }
    }

    return NextResponse.json(
      { message: 'Message sent successfully', ticketId: ticket?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CONTACT_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('[GET /api/admin/support/[id]]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, response } = body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: status || ticket.status,
        response: response !== undefined ? response : ticket.response,
      },
    });

    // If admin replies, notify user if user exists by email
    if (response && response.trim() !== '') {
      const customer = await prisma.user.findUnique({
        where: { email: ticket.email },
      });

      if (customer) {
        try {
          await prisma.notification.create({
            data: {
              userId: customer.id,
              message: `Murojaatingizga javob berildi: "${ticket.subject}"`,
              type: 'ORDER_STATUS_CHANGE', // Or any string like 'TICKET_REPLY'
              isRead: false,
            },
          });
        } catch (notifError) {
          console.error('[SUPPORT_REPLY_NOTIFICATION]', notifError);
        }
      }
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('[PUT /api/admin/support/[id]]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

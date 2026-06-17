import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SupportClient } from './SupportClient';

export const metadata: Metadata = {
  title: 'Support Tickets | Beb Fragrance Admin',
  description: 'Manage customer support requests and submissions',
};

export default async function AdminSupportPage() {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  // Safely serialize database date values
  const serializedTickets = JSON.parse(JSON.stringify(tickets));

  return (
    <div className="space-y-6 p-1 lg:p-4">
      <SupportClient initialTickets={serializedTickets} />
    </div>
  );
}

// src/app/admin/invoices/page.tsx
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { InvoicesClient } from './InvoicesClient';

export const metadata: Metadata = {
  title: 'Invoices | Beb Fragrance Admin',
  description: 'View and print billing invoices',
};

export default async function AdminInvoicesPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
          variant: {
            select: {
              size: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">
          Billing invoices generated from store orders
        </p>
      </div>

      <InvoicesClient initialOrders={orders} />
    </div>
  );
}

// src/app/admin/subscribers/page.tsx
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SubscribersClient } from './SubscribersClient';

export const metadata: Metadata = {
  title: 'Newsletter Subscribers | Beb Fragrance Admin',
  description: 'Manage newsletter subscribers',
};

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage email list subscribers
        </p>
      </div>

      <SubscribersClient initialSubscribers={subscribers} />
    </div>
  );
}

// src/app/orders/page.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, Eye } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View and track your Beb Fragrance orders.',
  robots: { index: false, follow: false },
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING:    { label: 'Pending',    classes: 'bg-amber-100 text-amber-700' },
  CONFIRMED:  { label: 'Confirmed',  classes: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', classes: 'bg-indigo-100 text-indigo-700' },
  SHIPPED:    { label: 'Shipped',    classes: 'bg-oud-100 text-oud-700' },
  DELIVERED:  { label: 'Delivered',  classes: 'bg-emerald-100 text-emerald-700' },
  CANCELLED:  { label: 'Cancelled',  classes: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: 'Refunded',   classes: 'bg-gray-100 text-gray-700' },
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/orders');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
          variant: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container-beb py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">My Orders</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          My Orders
        </h1>
        <p className="mt-2 text-muted-foreground">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
        </p>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cream-100">
            <Package className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">No orders yet</h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            You haven&apos;t placed any orders yet. Start shopping to find your perfect fragrance.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
            const previewImages = order.items
              .slice(0, 3)
              .map((i) => i.product.images[0]?.url)
              .filter(Boolean) as string[];

            return (
              <div
                key={order.id}
                className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-luxury"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-sm font-semibold text-foreground">
                        #{order.orderNumber}
                      </p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}>
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {formatDate(order.createdAt, { year: 'numeric', month: 'long', day: 'numeric' }, 'en-US')}
                      {' · '}
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>

                    {/* Preview images */}
                    {previewImages.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {previewImages.map((src, idx) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={idx}
                            src={src}
                            alt="Product"
                            className="h-12 w-12 rounded-lg border border-border object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-cream-100 text-xs font-semibold text-muted-foreground">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: price + action */}
                  <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold text-gold-600">
                        {formatPrice(Number(order.total), 'USD', 'en-US')}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.currency}</p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-cream-50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-gold-300 hover:bg-white hover:text-gold-600"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

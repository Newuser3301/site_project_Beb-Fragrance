// src/app/orders/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin, Phone, Mail, CheckCircle, Circle } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@prisma/client';

interface OrderDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  return {
    title: `Order Details`,
    description: `View your order details and tracking information.`,
    robots: { index: false, follow: false },
  };
}

const ORDER_STATUS_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'PENDING', label: 'Order Placed', description: 'Your order has been received' },
  { status: 'CONFIRMED', label: 'Confirmed', description: 'Order confirmed by our team' },
  { status: 'PROCESSING', label: 'Processing', description: 'Being prepared for shipment' },
  { status: 'SHIPPED', label: 'Shipped', description: 'On its way to you' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Successfully delivered' },
];

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const STATUS_BADGE: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING:    { label: 'Pending',    classes: 'bg-amber-100 text-amber-700' },
  CONFIRMED:  { label: 'Confirmed',  classes: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', classes: 'bg-indigo-100 text-indigo-700' },
  SHIPPED:    { label: 'Shipped',    classes: 'bg-oud-100 text-oud-700' },
  DELIVERED:  { label: 'Delivered',  classes: 'bg-emerald-100 text-emerald-700' },
  CANCELLED:  { label: 'Cancelled',  classes: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: 'Refunded',   classes: 'bg-gray-100 text-gray-700' },
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/orders');
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  if (order.userId !== session.user.id) {
    redirect('/orders');
  }

  const badge = STATUS_BADGE[order.status];
  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  const subtotal = Number(order.subtotal);
  const shippingCost = Number(order.shippingCost);
  const tax = Number(order.tax);
  const discount = Number(order.discount);
  const total = Number(order.total);

  return (
    <div className="container-beb py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/orders" className="hover:text-gold-600">My Orders</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">#{order.orderNumber}</span>
      </nav>

      {/* Title */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Order Details
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt, { year: 'numeric', month: 'long', day: 'numeric' }, 'en-US')}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Order Items */}
          <div className="rounded-2xl border border-border bg-white">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => {
                const image = item.product.images[0]?.url;
                const lineTotal = Number(item.total);

                return (
                  <div key={item.id} className="flex gap-4 p-5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground/40">
                          📦
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-foreground hover:text-gold-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.variant.size} · Qty: {item.quantity}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(Number(item.price), 'USD', 'en-US')} each
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatPrice(lineTotal, 'USD', 'en-US')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-5 font-serif text-lg font-bold text-foreground">
                Order Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                <div className="space-y-6">
                  {ORDER_STATUS_STEPS.map((step, idx) => {
                    const isCompleted = currentStatusIndex >= idx;
                    const isCurrent = currentStatusIndex === idx;

                    return (
                      <div key={step.status} className="relative flex items-start gap-4 pl-10">
                        <div
                          className={`absolute left-2 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'border-gold-500 bg-gold-500'
                              : 'border-border bg-white'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-700">
                                Current
                              </span>
                            )}
                          </p>
                          <p className={`text-xs ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-foreground">
              Payment Summary
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal, 'USD', 'en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-medium ${shippingCost === 0 ? 'text-emerald-600' : ''}`}>
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost, 'USD', 'en-US')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatPrice(tax, 'USD', 'en-US')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-emerald-600">
                    -{formatPrice(discount, 'USD', 'en-US')}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-serif font-bold text-foreground">Total</span>
                <span className="font-serif text-xl font-bold text-gold-600">
                  {formatPrice(total, 'USD', 'en-US')}
                </span>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-4 rounded-xl bg-cream-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Payment method</p>
              <p className="text-sm font-medium text-foreground">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-bold text-foreground">
              Shipping Address
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}
                    {' '}{order.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="mb-3 font-serif text-lg font-bold text-foreground">
                Tracking
              </h2>
              <p className="text-sm text-muted-foreground">Tracking number:</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                {order.trackingNumber}
              </p>
              {order.shippingCarrier && (
                <p className="mt-1 text-xs text-muted-foreground">
                  via {order.shippingCarrier}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

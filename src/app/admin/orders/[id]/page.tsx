// src/app/admin/orders/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderTimeline } from '@/components/admin/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Truck,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id.slice(0, 8).toUpperCase()} | Beb Fragrance Admin`,
  };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              brand: {
                select: { name: true },
              },
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-gold-300 hover:text-gold-700 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(new Date(order.createdAt))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {order.paymentStatus === 'PENDING' && (
            <form
              action={async () => {
                'use server';
                await prisma.order.update({
                  where: { id: order.id },
                  data: { paymentStatus: 'PAID' },
                });
              }}
            >
              <Button type="submit" variant="luxury" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Mark as Paid
              </Button>
            </form>
          )}
          <StatusBadge status={order.status} />
          {order.status === 'PENDING' && (
            <form
              action={async () => {
                'use server';
                await prisma.order.update({
                  where: { id: order.id },
                  data: { status: 'PROCESSING' },
                });
              }}
            >
              <Button type="submit" variant="luxury" size="sm">
                Mark as Processing
              </Button>
            </form>
          )}
          {order.status === 'PROCESSING' && (
            <form
              action={async () => {
                'use server';
                await prisma.order.update({
                  where: { id: order.id },
                  data: { status: 'SHIPPED' },
                });
              }}
            >
              <Button type="submit" variant="luxury" size="sm">
                <Truck className="mr-1.5 h-4 w-4" />
                Mark as Shipped
              </Button>
            </form>
          )}
          {order.status === 'SHIPPED' && (
            <form
              action={async () => {
                'use server';
                await prisma.order.update({
                  where: { id: order.id },
                  data: { status: 'DELIVERED' },
                });
              }}
            >
              <Button type="submit" variant="luxury" size="sm">
                Mark as Delivered
              </Button>
            </form>
          )}
          {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
            <form
              action={async () => {
                'use server';
                await prisma.order.update({
                  where: { id: order.id },
                  data: { status: 'CANCELLED' },
                });
              }}
            >
              <Button type="submit" variant="destructive" size="sm">
                Cancel Order
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                dates={{
                  PENDING: order.createdAt,
                  PROCESSING:
                    order.status === 'PROCESSING' ||
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED'
                      ? order.updatedAt
                      : undefined,
                  SHIPPED:
                    order.status === 'SHIPPED' ||
                    order.status === 'DELIVERED'
                      ? order.updatedAt
                      : undefined,
                  DELIVERED:
                    order.status === 'DELIVERED'
                      ? order.updatedAt
                      : undefined,
                }}
              />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Package className="mr-2 inline-block h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.product.images[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <Package className="h-full w-full p-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-gray-900 hover:text-gold-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {item.product.brand?.name ?? ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatPrice(Number(item.price))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="mr-2 inline-block h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-white">
                  {order.user.name
                    ? order.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.user.name || 'N/A'}
                  </p>
                  <Link
                    href={`/admin/customers/${order.user.id}`}
                    className="text-xs text-gold-600 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {order.user.email}
                </div>
                {order.user.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    {order.user.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="mr-2 inline-block h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.user.name || 'N/A'}
                </p>
                <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(tax)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-serif text-xl font-bold text-gold-600">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
              {order.stripeSessionId && (
                <p className="text-xs text-gray-400">
                  Stripe: {order.stripeSessionId.slice(0, 16)}...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
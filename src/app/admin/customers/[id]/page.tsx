// src/app/admin/customers/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate, getInitials } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { StarRating } from '@/components/ui/StarRating';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  User,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: `${user?.name || 'Customer'} | Beb Fragrance Admin`,
  };
}

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id, role: 'CUSTOMER' },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      reviews: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const averageRating =
    customer.reviews.length > 0
      ? customer.reviews.reduce((sum, r) => sum + r.rating, 0) /
        customer.reviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-gold-300 hover:text-gold-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Customer Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-2xl font-bold text-white">
              {customer.image ? (
                <img
                  src={customer.image}
                  alt={customer.name || ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(customer.name || customer.email || '?')
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                {customer.name || 'Unnamed Customer'}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {customer.phone}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Joined {formatDate(new Date(customer.createdAt))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                  <ShoppingBag className="h-5 w-5 text-gold-500" />
                  {customer.orders.length}
                </div>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gold-600">
                  <DollarSign className="h-5 w-5" />
                  {formatPrice(totalSpent).replace('$', '')}
                </div>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                  <Star className="h-5 w-5 text-yellow-400" />
                  {customer.reviews.length}
                </div>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.orders.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400">
                <ShoppingBag className="h-10 w-10" />
                <p className="mt-2 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-gray-100 p-4 transition-all hover:border-gold-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-sm font-medium text-gray-900 hover:text-gold-600"
                        >
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {formatDate(new Date(order.createdAt))}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(Number(order.total))}
                      </p>
                    </div>
                    {/* Mini product list */}
                    <div className="mt-2 flex gap-1">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="h-8 w-8 overflow-hidden rounded bg-gray-100"
                          title={item.product.name}
                        >
                          {item.product.images[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Reviews ({customer.reviews.length})
            </CardTitle>
            {customer.reviews.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarRating rating={Math.round(averageRating)} readOnly />
                <span>{averageRating.toFixed(1)} average</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {customer.reviews.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400">
                <Star className="h-10 w-10" />
                <p className="mt-2 text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customer.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-gray-100 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {review.product.images[0]?.url ? (
                          <img
                            src={review.product.images[0].url}
                            alt={review.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            <Star className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${review.product.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-gold-600"
                        >
                          {review.product.name}
                        </Link>
                        <div className="mt-1">
                          <StarRating rating={review.rating} readOnly />
                        </div>
                        {review.comment && (
                          <p className="mt-2 text-sm text-gray-600">
                            {review.comment}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(new Date(review.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
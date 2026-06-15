// src/app/admin/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard | Beb Fragrance Admin',
  description: 'Admin dashboard overview',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  const [
    revenueResult,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  return {
    totalRevenue: Number(revenueResult._sum.total ?? 0),
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats().catch(() => ({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
  }));

  const adminName = session?.user?.name?.split(' ')[0] ?? 'Admin';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            Welcome back, {adminName}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">{today}</p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon="revenue"
          prefix="$"
          color="gold"
          change={12.5}
          changeType="increase"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="orders"
          color="blue"
          change={8.2}
          changeType="increase"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="products"
          color="purple"
          change={3}
          changeType="increase"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="customers"
          color="green"
          change={5.4}
          changeType="increase"
        />
      </div>

      {/* Recent Orders + Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-500" />
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-xs font-semibold text-gold-600 hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.name ?? 'Guest'}
                        </p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {formatDate(order.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(Number(order.total), 'USD', 'en-US')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-gray-900">
            Quick Actions
          </h2>
          <div className="space-y-2.5">
            {[
              { href: '/admin/products/new', label: 'Add New Product', icon: Plus, color: 'bg-gold-50 text-gold-600' },
              { href: '/admin/orders', label: 'View All Orders', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
              { href: '/admin/products', label: 'Manage Products', icon: Package, color: 'bg-purple-50 text-purple-600' },
              { href: '/admin/customers', label: 'View Customers', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {label}
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

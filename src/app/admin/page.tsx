// src/app/admin/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Folder,
  Settings,
  Search,
  Activity,
  DollarSign,
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
      {/* 1. Header Search + Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Xush kelibsiz, {adminName} 👋
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Bugun {today}. Boshqaruv paneli holati.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="search"
            placeholder="Qidirish (mahsulot, buyurtma...)"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 2. Hero Banner with search */}
      <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute right-[-10%] top-[-10%] h-56 w-56 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute left-[30%] bottom-[-20%] h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        </div>

        <div className="relative max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
            Beb Fragrance Search Engine
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-3xl">
            What are you looking for today?
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Tezkor qidiruv orqali kerakli mahsulot, buyurtma, toifa yoki xaridor ma'lumotlarini soniyalarda toping.
          </p>

          <div className="relative mt-6 max-w-lg">
            <div className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Qidiruv kalit so'zini kiriting..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* 3. Quick Action Cards Grid (6 items) */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/admin/products',
              label: 'Mahsulotlar',
              desc: 'Katalog, parfyum qoʻshish va narx variantlarini boshqarish',
              icon: Package,
              color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
              href: '/admin/orders',
              label: 'Buyurtmalar',
              desc: 'Doʻkondagi barcha sotuvlar roʻyxati va holatini yangilash',
              icon: ShoppingBag,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
              href: '/admin/customers',
              label: 'Mijozlar',
              desc: 'Foydalanuvchilar maʼlumotlari va xarid tarixi bilan tanishish',
              icon: Users,
              color: 'text-purple-600 bg-purple-50 border-purple-100',
            },
            {
              href: '/admin/categories',
              label: 'Kategoriyalar',
              desc: 'Doʻkondagi parfyumeriya toifalari, brendlar va oilalarni sozlash',
              icon: Folder,
              color: 'text-amber-600 bg-amber-50 border-amber-100',
            },
            {
              href: '/admin/settings',
              label: 'Sozlamalar',
              desc: 'Tizim sozlamalari, valyuta, email va toʻlov tizimlari sozlash',
              icon: Settings,
              color: 'text-rose-600 bg-rose-50 border-rose-100',
            },
            {
              href: '/admin/analytics',
              label: 'Hisobotlar',
              desc: 'Doʻkonning oylik va haftalik sotuv koʻrsatkichlari analitikasi',
              icon: TrendingUp,
              color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
            },
          ].map(({ href, label, desc, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between rounded-2xl border border-gray-150 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div>
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-gray-700">
                Oʻtish <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Statistics Cards */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Statistika va Trendlar
        </h2>
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
      </div>

      {/* 5. Custom Sparkline Charts (Revenue, Sales, Orders) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue SVG Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Revenue Trend (Oylik)
              </p>
              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {formatPrice(stats.totalRevenue, 'USD', 'en-US')}
              </h3>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <DollarSign className="h-4.5 w-4.5" />
            </span>
          </div>

          <div className="mt-6 flex h-32 w-full items-end">
            {/* Visual Custom SVG Line Chart */}
            <svg viewBox="0 0 300 100" className="w-full h-full text-amber-500 overflow-visible">
              <defs>
                <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Path */}
              <path
                d="M 0 80 Q 50 60 100 75 T 200 40 T 300 20 L 300 100 L 0 100 Z"
                fill="url(#revenue-grad)"
              />
              <path
                d="M 0 80 Q 50 60 100 75 T 200 40 T 300 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Dots */}
              <circle cx="100" cy="75" r="4.5" className="fill-amber-600 stroke-white stroke-2" />
              <circle cx="200" cy="40" r="4.5" className="fill-amber-600 stroke-white stroke-2" />
              <circle cx="300" cy="20" r="4.5" className="fill-amber-600 stroke-white stroke-2 animate-pulse" />
            </svg>
          </div>
          <p className="mt-3 text-[11px] text-gray-500 text-center">
            Oxirgi 6 oylik oʻsish surʼati: +12.5%
          </p>
        </div>

        {/* Sales Volume (Bars) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Sotuv Hajmi (Haftalik)
              </p>
              <h3 className="mt-1 text-xl font-bold text-gray-900">
                {stats.totalOrders} buyurtma
              </h3>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ShoppingBag className="h-4.5 w-4.5" />
            </span>
          </div>

          <div className="mt-6 flex h-32 w-full items-end gap-3 px-2">
            {[45, 60, 52, 70, 85, 65, 95].map((val, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 group-hover:brightness-105 transition-all"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] text-gray-400 uppercase font-mono">
                  {['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Conversion (Area/Line) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Buyurtmalar Dinamikasi
              </p>
              <h3 className="mt-1 text-xl font-bold text-gray-900">
                Aktiv konversiya
              </h3>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <Activity className="h-4.5 w-4.5" />
            </span>
          </div>

          <div className="mt-6 flex h-32 w-full items-end">
            <svg viewBox="0 0 300 100" className="w-full h-full text-purple-500 overflow-visible">
              <defs>
                <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Path */}
              <path
                d="M 0 50 Q 75 80 150 40 T 300 15 L 300 100 L 0 100 Z"
                fill="url(#purple-grad)"
              />
              <path
                d="M 0 50 Q 75 80 150 40 T 300 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="150" cy="40" r="4.5" className="fill-purple-600 stroke-white stroke-2" />
              <circle cx="300" cy="15" r="4.5" className="fill-purple-600 stroke-white stroke-2" />
            </svg>
          </div>
          <p className="mt-3 text-[11px] text-gray-500 text-center">
            Buyurtma toʻldirish darajasi: 98.6%
          </p>
        </div>
      </div>

      {/* 6. Recent Orders Table (keep data loading intact) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-150 px-6 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
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
                          className="font-mono text-xs font-semibold text-blue-600 hover:underline"
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

        {/* Small stats summary / actions box */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="font-serif text-lg font-bold text-gray-900">
            Quick Actions Shortcuts
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-white hover:border-gray-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Plus className="h-4 w-4" />
              </span>
              Add New Product
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-white hover:border-gray-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShoppingBag className="h-4 w-4" />
              </span>
              View All Orders
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

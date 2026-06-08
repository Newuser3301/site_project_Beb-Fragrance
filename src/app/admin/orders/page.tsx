// src/app/admin/orders/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ExportButton } from "@/components/admin/ExportButton";
import { Search, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Orders | Beb Fragrance Admin",
  description: "Manage all orders",
};

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status || "ALL";
  const search = params.search || "";
  const limit = 10;

  // Status filter
  const statusFilter = status !== "ALL" ? { status: status as any } : {};

  // Search filter
  const searchFilter = search
    ? {
        OR: [
          { id: { contains: search, mode: "insensitive" as const } },
          {
            user: { name: { contains: search, mode: "insensitive" as const } },
          },
          {
            user: { email: { contains: search, mode: "insensitive" as const } },
          },
        ],
      }
    : {};

  const where = {
    ...statusFilter,
    ...searchFilter,
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const statusTabs = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  // Export data
  const exportData = orders.map((order) => ({
    "Order ID": order.id,
    Customer: order.user.name || order.user.email,
    Email: order.user.email,
    Date: formatDate(new Date(order.createdAt)),
    Status: order.status,
    Items: order.items.length,
    Total: formatPrice(Number(order.total)),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} total order{total !== 1 ? "s" : ""}
          </p>
        </div>
        <ExportButton
          data={exportData}
          filename="beb-fragrance-orders"
          format="csv"
        />
      </div>

      {/* Search */}
      <form className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by order ID or customer..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/orders?status=${tab.value}${search ? `&search=${search}` : ""}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              status === tab.value
                ? "bg-gold-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
          <Filter className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-500">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {search
              ? "Try a different search term"
              : "No orders in this category yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(new Date(order.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gold-300 hover:text-gold-700 transition-all"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/orders?page=${page - 1}&status=${status}${search ? `&search=${search}` : ""}`}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              page <= 1
                ? "pointer-events-none border-gray-200 text-gray-400"
                : "border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700"
            }`}
          >
            Previous
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}&status=${status}${search ? `&search=${search}` : ""}`}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                p === page
                  ? "border-gold-500 bg-gold-500 text-white"
                  : "border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={`/admin/orders?page=${page + 1}&status=${status}${search ? `&search=${search}` : ""}`}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              page >= totalPages
                ? "pointer-events-none border-gray-200 text-gray-400"
                : "border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}

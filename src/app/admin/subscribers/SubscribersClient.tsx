// src/app/admin/subscribers/SubscribersClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date | string;
  unsubscribedAt: Date | string | null;
}

interface SubscribersClientProps {
  initialSubscribers: Subscriber[];
}

export function SubscribersClient({ initialSubscribers }: SubscribersClientProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  const filtered = useMemo(() => {
    let list = [...subscribers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.email.toLowerCase().includes(q));
    }
    return list;
  }, [subscribers, search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, currentPage]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Status toggling failed');

      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: newStatus, unsubscribedAt: newStatus ? null : new Date().toISOString() } : s))
      );
      toast.success(newStatus ? 'Subscriber activated' : 'Subscriber unsubscribed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error toggling status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Delete failed');

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success('Subscriber deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error deleting subscriber');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search subscribers..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Subscribed At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Unsubscribed At</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                paginated.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {sub.email}
                    </td>
                    <td className="px-6 py-4">
                      {sub.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5" />
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(new Date(sub.subscribedAt), { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sub.unsubscribedAt
                        ? formatDate(new Date(sub.unsubscribedAt), { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(sub.id, sub.isActive)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          sub.isActive
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {sub.isActive ? 'Unsubscribe' : 'Subscribe'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id)}
                        className="rounded-lg border border-red-250 p-1.5 text-red-650 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

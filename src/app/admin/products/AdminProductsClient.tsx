// src/app/admin/products/AdminProductsClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteDialog } from '@/components/admin/DeleteDialog';

interface AdminProductsClientProps {
  children: React.ReactNode;
  initialSearch: string;
}

export function AdminProductsClient({ children, initialSearch }: AdminProductsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Intercept delete button clicks via event delegation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-delete-product]');
      if (!target) return;
      const id = target.getAttribute('data-delete-product');
      const name = target.getAttribute('data-product-name') ?? 'this product';
      if (id) {
        setDeleteId(id);
        setDeleteName(name);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      router.push(`/admin/products?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, router]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const response = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    });
    if (response.ok) {
      toast.success(`"${deleteName}" deleted successfully`);
      router.refresh();
    } else {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error ?? 'Failed to delete product');
    }
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {children}

      <DeleteDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        itemName={deleteName}
      />
    </div>
  );
}

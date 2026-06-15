// src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-300 border-t-gold-600" />
      </div>
    );
  }

  if (
    status === 'unauthenticated' ||
    (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN')
  ) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main area (offset by sidebar on desktop) */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        {/* Header */}
        <AdminHeader onMenuToggle={() => setIsSidebarOpen((o) => !o)} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

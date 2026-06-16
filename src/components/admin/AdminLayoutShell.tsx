'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:gap-6 lg:px-8">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
        <main className="pt-4 sm:pt-5">{children}</main>
      </div>
    </div>
  );
}

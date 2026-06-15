import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  if (!session.user.role || !ADMIN_ROLES.includes(session.user.role)) {
    redirect('/');
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

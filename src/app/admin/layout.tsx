import { auth } from '@/lib/auth';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin =
    !!session?.user?.role && ADMIN_ROLES.includes(session.user.role);

  if (!isAdmin) {
    return <>{children}</>;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

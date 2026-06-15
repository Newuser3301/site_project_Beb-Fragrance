import { AlertTriangle, DatabaseZap, ShieldAlert } from 'lucide-react';
import { getServiceStatus } from '@/lib/app-mode';

function getBannerCopy(status: Awaited<ReturnType<typeof getServiceStatus>>) {
  if (status.mode === 'mock') {
    return {
      icon: ShieldAlert,
      title: 'Demo mode is enabled.',
      description:
        'The storefront is running on local fallback data. Orders and admin data should not be treated as production records.',
      tone: 'border-amber-300 bg-amber-50 text-amber-900',
    };
  }

  if (!status.services.database) {
    return {
      icon: DatabaseZap,
      title: 'Database is unavailable.',
      description:
        'Public catalog pages are using fallback data. Admin, account history, and persistent checkout flows are degraded until the database is restored.',
      tone: 'border-orange-300 bg-orange-50 text-orange-900',
    };
  }

  const disabledServices = [
    !status.services.googleAuth && 'Google Auth',
    !status.services.stripe && 'Stripe',
    !status.services.resend && 'Email',
    !status.services.supabase && 'Supabase Storage',
  ].filter(Boolean) as string[];

  if (disabledServices.length > 0) {
    return {
      icon: AlertTriangle,
      title: 'Some services are not configured.',
      description: `Currently unavailable: ${disabledServices.join(', ')}.`,
      tone: 'border-sky-300 bg-sky-50 text-sky-900',
    };
  }

  return null;
}

export async function SystemNoticeBanner() {
  const status = await getServiceStatus();
  const banner = getBannerCopy(status);

  if (!banner) {
    return null;
  }

  const Icon = banner.icon;

  return (
    <div className={`border-b ${banner.tone}`}>
      <div className="container-beb flex items-start gap-3 py-3 text-sm">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">{banner.title}</p>
          <p className="opacity-90">{banner.description}</p>
        </div>
      </div>
    </div>
  );
}

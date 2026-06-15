import { NextResponse } from 'next/server';
import { getServiceStatus } from '@/lib/app-mode';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await getServiceStatus();

  return NextResponse.json({
    ok: status.services.database,
    mode: status.mode,
    timestamp: new Date().toISOString(),
    services: status.services,
  });
}

const FORCE_MOCK_DATA = process.env.FORCE_MOCK_DATA === 'true';
const GOOGLE_AUTH_ENABLED = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
const STRIPE_ENABLED = Boolean(process.env.STRIPE_SECRET_KEY);
const RESEND_ENABLED = Boolean(process.env.RESEND_API_KEY);
const SUPABASE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const NODE_ENV = process.env.NODE_ENV ?? 'development';

let databaseAvailable: boolean | null = null;
let databaseCheck: Promise<boolean> | null = null;
const loggedFallbacks = new Set<string>();

export function isMockModeEnabled() {
  return FORCE_MOCK_DATA;
}

export function isGoogleAuthEnabled() {
  return GOOGLE_AUTH_ENABLED;
}

export function isStripeEnabled() {
  return STRIPE_ENABLED;
}

export function isResendEnabled() {
  return RESEND_ENABLED;
}

export function isSupabaseEnabled() {
  return SUPABASE_ENABLED;
}

export function getRuntimeMode() {
  if (FORCE_MOCK_DATA) {
    return 'mock';
  }

  return NODE_ENV === 'production' ? 'production' : 'development';
}

export function logFallbackOnce(scope: string, message: string, error?: unknown) {
  if (loggedFallbacks.has(scope)) {
    return;
  }

  loggedFallbacks.add(scope);

  if (error) {
    console.warn(`[${scope}] ${message}`, error);
    return;
  }

  console.warn(`[${scope}] ${message}`);
}

export async function canUseDatabase() {
  if (FORCE_MOCK_DATA) {
    return false;
  }

  if (databaseAvailable !== null) {
    return databaseAvailable;
  }

  if (!databaseCheck) {
    databaseCheck = import('@/lib/prisma')
      .then(({ prisma }) => prisma.$queryRaw`SELECT 1`)
      .then(() => {
        databaseAvailable = true;
        return true;
      })
      .catch((error) => {
        databaseAvailable = false;
        logFallbackOnce(
          'database',
          'Database is unavailable. Falling back to local demo data where supported.',
          error
        );
        return false;
      })
      .finally(() => {
        databaseCheck = null;
      });
  }

  return databaseCheck;
}

export async function getServiceStatus() {
  const database = await canUseDatabase();

  return {
    mode: getRuntimeMode(),
    database,
    services: {
      database,
      googleAuth: GOOGLE_AUTH_ENABLED,
      stripe: STRIPE_ENABLED,
      resend: RESEND_ENABLED,
      supabase: SUPABASE_ENABLED,
    },
  };
}

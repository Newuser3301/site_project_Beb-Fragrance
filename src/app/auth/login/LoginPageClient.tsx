'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Chrome, Loader2, LockKeyhole, Mail, SprayCan } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SITE_NAME } from '@/lib/constants';

interface LoginPageClientProps {
  googleAuthEnabled: boolean;
}

export function LoginPageClient({
  googleAuthEnabled,
}: LoginPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('admin@bebfragrance.com');
  const [password, setPassword] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  if (status === 'authenticated') {
    router.push(callbackUrl);
    return null;
  }

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (loginError) {
      console.error('Login failed:', loginError);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCredentialsLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsCredentialsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email yoki parol noto'g'ri.");
        return;
      }

      router.push(result.url || callbackUrl);
      router.refresh();
    } catch (loginError) {
      console.error('Credentials login failed:', loginError);
      setError("Kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600">
              <SprayCan className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {SITE_NAME}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleCredentialsLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-10"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full gap-3 py-6 text-base font-medium"
              disabled={isCredentialsLoading || status === 'loading'}
            >
              {isCredentialsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LockKeyhole className="h-5 w-5" />
              )}
              Continue with Email
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Or
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            variant="outline"
            className="w-full gap-3 py-6 text-base font-medium"
            onClick={handleGoogleLogin}
            disabled={!googleAuthEnabled || isGoogleLoading || status === 'loading'}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="h-5 w-5" />
            )}
            Continue with Google
          </Button>

          {!googleAuthEnabled && (
            <p className="mt-4 text-center text-xs text-amber-600">
              Google login hozir development muhitida sozlanmagan. Admin va customer kirish email/parol orqali ishlaydi.
            </p>
          )}

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-gold-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-gold-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

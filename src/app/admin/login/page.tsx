'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('admin@bebfragrance.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role && ADMIN_ROLES.includes(session.user.role)) {
      router.replace('/admin');
    }
  }, [router, session?.user?.role, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

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

      const nextSession = await getSession();
      if (!nextSession?.user?.role || !ADMIN_ROLES.includes(nextSession.user.role)) {
        setError('Bu akkauntda admin huquqi yo‘q.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (loginError) {
      console.error('Admin login failed:', loginError);
      setError("Kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EFF6FF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] rounded-2xl border border-blue-100 bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#2c1a26]">
              BEB FRAGRANCE
            </span>
          </Link>
          <h1 className="mt-6 text-xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Warning banner */}
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-100">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>Faqat adminlar boshqaruv paneliga shu sahifa orqali kiradi.</span>
          </div>

          <Input
            id="admin-email"
            type="email"
            label="Admin Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail className="h-4.5 w-4.5 text-gray-400" />}
            required
            className="h-10.5 rounded-xl border-gray-200 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          />

          <Input
            id="admin-password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            icon={<LockKeyhole className="h-4.5 w-4.5 text-gray-400" />}
            required
            className="h-10.5 rounded-xl border-gray-200 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          />

          {error ? (
            <p className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full h-11 text-sm font-semibold shadow-sm transition-all focus-visible:ring-blue-500"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Kirilmoqda...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <div>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#3B82F6] hover:text-[#2563EB] hover:underline font-medium"
            >
              Forgot your password? Reset Password
            </Link>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Customer login uchun{' '}
              <Link href="/auth/login" className="font-semibold text-gray-700 hover:underline">
                kirish sahifasi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


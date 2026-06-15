'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole, Mail } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
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
    <AuthShell
      title="Admin Login"
      description="Faqat admin foydalanuvchilar boshqaruv paneliga shu sahifa orqali kiradi."
      footer={
        <p className="text-center text-sm text-[#7f6474]">
          Customer login uchun{' '}
          <Link href="/auth/login" className="font-medium text-[#6d415c] hover:underline">
            oddiy kirish sahifasi
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="admin-email"
          type="email"
          label="Admin Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          id="admin-password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockKeyhole className="h-4 w-4" />}
          required
        />

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        <Button type="submit" variant="luxury" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Kirilmoqda...' : 'Admin Panelga Kirish'}
        </Button>
      </form>
    </AuthShell>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Loader2, LockKeyhole, Mail } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered') === '1';

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

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

      router.push(result.url || callbackUrl);
      router.refresh();
    } catch (loginError) {
      console.error('Customer login failed:', loginError);
      setError("Kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Customer Login"
      description="Buyurtmalar, wishlist va profilingizni boshqarish uchun email va parol bilan kiring."
      footer={
        <div className="space-y-3 text-center text-sm text-[#7f6474]">
          <p>
            Akkauntingiz yo‘qmi?{' '}
            <Link href="/auth/register" className="font-medium text-[#6d415c] hover:underline">
              Ro‘yxatdan o‘tish
            </Link>
          </p>
          <p>
            <Link href="/auth/forgot-password" className="font-medium text-[#6d415c] hover:underline">
              Parolni unutdingizmi?
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {registered ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Akkaunt yaratildi. Endi email va parolingiz bilan tizimga kiring.
          </p>
        ) : null}

        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockKeyhole className="h-4 w-4" />}
          required
        />

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="luxury"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
        </Button>
      </form>
    </AuthShell>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Reset token topilmadi.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Parollar bir xil emas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Parol yangilanmadi.');
      }

      router.push('/auth/login');
    } catch (resetError) {
      setError(
        resetError instanceof Error ? resetError.message : 'Parol yangilanmadi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      description="Yangi parol kiriting va customer akkauntingizga qayta kiring."
      footer={
        <p className="text-center text-sm text-[#7f6474]">
          <Link href="/auth/login" className="font-medium text-[#6d415c] hover:underline">
            Login sahifasiga qaytish
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="password"
          type="password"
          label="Yangi parol"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockKeyhole className="h-4 w-4" />}
          required
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Parolni tasdiqlang"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          icon={<LockKeyhole className="h-4 w-4" />}
          required
        />

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        <Button type="submit" variant="luxury" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Saqlanmoqda...' : 'Parolni Yangilash'}
        </Button>
      </form>
    </AuthShell>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Mail } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Reset link yuborilmadi.');
      }

      setSuccess(
        data.previewUrl
          ? `Reset link tayyorlandi: ${data.previewUrl}`
          : 'Agar email mavjud bo‘lsa, parolni tiklash havolasi yuborildi.'
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Reset link yuborilmadi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      description="Email manzilingizni kiriting, biz sizga yangi parol o‘rnatish havolasini yuboramiz."
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
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        {success ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 break-words">
            {success}
          </p>
        ) : null}

        <Button type="submit" variant="luxury" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Yuborilmoqda...' : 'Reset Link Yuborish'}
        </Button>
      </form>
    </AuthShell>
  );
}

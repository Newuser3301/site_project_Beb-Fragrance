'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LockKeyhole, Mail, User } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }

      router.push(
        `/auth/login?registered=1&email=${encodeURIComponent(form.email.trim().toLowerCase())}`
      );
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Ro'yxatdan o'tishda xatolik yuz berdi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      description="Ism, email va parol orqali yangi customer akkaunt yarating."
      footer={
        <p className="text-center text-sm text-[#7f6474]">
          Akkauntingiz bormi?{' '}
          <Link href="/auth/login" className="font-medium text-[#6d415c] hover:underline">
            Tizimga kirish
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          type="text"
          label="Ism"
          autoComplete="name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          icon={<User className="h-4 w-4" />}
          required
        />

        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          icon={<LockKeyhole className="h-4 w-4" />}
          required
        />

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="luxury" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Yaratilmoqda...' : 'Ro‘yxatdan o‘tish'}
        </Button>
      </form>
    </AuthShell>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import {
  BadgeCheck,
  Info,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SITE_NAME } from '@/lib/constants';

type AuthTab = 'login' | 'register';

interface AuthExperienceProps {
  initialTab: AuthTab;
}

const TEST_USER = {
  email: 'admin@bebfragrance.com',
  password: 'Admin12345!',
};

const REMEMBER_EMAIL_KEY = 'beb-auth-email';

function createDisplayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? 'beb-customer';
  const cleaned = localPart.replace(/[._-]+/g, ' ').trim();

  if (!cleaned) {
    return 'Beb Customer';
  }

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AuthExperience({ initialTab }: AuthExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    email: searchParams.get('email') ?? '',
    password: '',
  });

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered') === '1';

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (registered) {
      setActiveTab('login');
      setNotice("Akkaunt yaratildi. Endi email va parolingiz bilan tizimga kiring.");
    }
  }, [registered]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  useEffect(() => {
    if (form.email) {
      return;
    }

    try {
      const savedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setForm((prev) => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    } catch {}
  }, [form.email]);

  const helperText = useMemo(() => {
    if (activeTab === 'login') {
      return "Login uchun email va parol kiriting. Agar akkaunt yo'q bo'lsa, Ro'yxatdan o'tish bo'limiga o'ting.";
    }

    return "Ro'yxatdan o'tishda email va parol yetarli. Profil nomi email asosida avtomatik yaratiladi.";
  }, [activeTab]);

  const syncTab = (nextTab: AuthTab) => {
    setError('');
    setNotice('');
    setActiveTab(nextTab);

    const targetPath = nextTab === 'login' ? '/auth/login' : '/auth/register';
    if (pathname !== targetPath) {
      router.replace(targetPath);
    }
  };

  const handleQuickFill = () => {
    syncTab('login');
    setForm({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    setRememberMe(true);
    setError('');
    setNotice("Test foydalanuvchi ma'lumotlari to'ldirildi.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const password = form.password;

      if (rememberMe) {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, normalizedEmail);
      } else {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      if (activeTab === 'login') {
        const result = await signIn('credentials', {
          email: normalizedEmail,
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
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createDisplayNameFromEmail(normalizedEmail),
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }

      setNotice("Akkaunt yaratildi. Endi shu ma'lumotlar bilan kirishingiz mumkin.");
      setActiveTab('login');
      router.replace(`/auth/login?registered=1&email=${encodeURIComponent(normalizedEmail)}`);
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "So'rovni bajarishda xatolik yuz berdi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f7fbff_48%,#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {SITE_NAME}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Account
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Login yoki ro&apos;yxatdan o&apos;tish orqali Beb Fragrance hisobingizni boshqaring.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
              <span>Credentials auth</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-[#dbeafe] bg-white shadow-[0_30px_90px_rgba(59,130,246,0.10)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="border-b border-[#e5eefc] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[#e5eefc] bg-[#f8fbff] px-4 py-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <KeyRound className="h-4 w-4 text-[#3B82F6]" />
                  <p className="text-sm font-semibold">Kirish / Ro&apos;yxatdan o&apos;tish</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                  Local auth
                </span>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#e5eefc] p-4 sm:p-5">
                <div className="inline-flex rounded-full border border-[#dbeafe] bg-[#f8fbff] p-1">
                  <button
                    type="button"
                    onClick={() => syncTab('login')}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === 'login'
                        ? 'bg-[#dbeafe] text-[#1d4ed8]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    Kirish
                  </button>
                  <button
                    type="button"
                    onClick={() => syncTab('register')}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === 'register'
                        ? 'bg-[#dbeafe] text-[#1d4ed8]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Ro&apos;yxatdan o&apos;tish
                  </button>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <Input
                    id="auth-email"
                    type="email"
                    label="Email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="you@mail.com"
                    className="h-12 rounded-2xl border-slate-200 bg-white focus-visible:ring-[#3B82F6]"
                    required
                  />

                  <Input
                    id="auth-password"
                    type="password"
                    label="Parol"
                    autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                    value={form.password}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    icon={<LockKeyhole className="h-4 w-4" />}
                    placeholder={
                      activeTab === 'login' ? 'Parolingizni kiriting' : 'Kamida 8 ta belgi'
                    }
                    className="h-12 rounded-2xl border-slate-200 bg-white focus-visible:ring-[#3B82F6]"
                    required
                  />

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="inline-flex items-center gap-2 text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                      />
                      Esimda saqlash
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="font-medium text-slate-700 underline-offset-4 hover:text-[#2563EB] hover:underline"
                    >
                      Parolni unutdingmi?
                    </Link>
                  </div>

                  {notice ? (
                    <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {notice}
                    </p>
                  ) : null}

                  {error ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full rounded-2xl bg-[#3B82F6] text-base font-semibold text-white shadow-[0_18px_30px_rgba(59,130,246,0.24)] hover:bg-[#2563EB]"
                    disabled={status === 'loading'}
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? (
                      activeTab === 'login' ? 'Kirilmoqda...' : 'Yaratilmoqda...'
                    ) : (
                      'Davom etish'
                    )}
                  </Button>
                </form>

                <div className="mt-5 rounded-[20px] border border-[#e5eefc] bg-[#fbfdff] px-4 py-4 text-sm leading-6 text-slate-600">
                  <p className="font-medium text-slate-800">Izoh</p>
                  <p className="mt-1">{helperText}</p>
                </div>
              </div>
            </section>

            <aside className="p-5 sm:p-7">
              <div className="h-full rounded-[24px] border border-[#e5eefc] bg-[#fcfdff] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#3B82F6]" />
                    <h2 className="text-lg font-semibold text-slate-900">Eslatma</h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                    Demo
                  </span>
                </div>

                <div className="mt-5 rounded-[22px] border border-[#dbeafe] bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-[#3B82F6]" />
                    <div className="space-y-2 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Test foydalanuvchi</p>
                      <p>
                        <span className="font-medium">Email:</span> {TEST_USER.email}
                      </p>
                      <p>
                        <span className="font-medium">Parol:</span> {TEST_USER.password}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#93c5fd] hover:text-[#2563EB]"
                  >
                    <BadgeCheck className="h-4 w-4 text-[#3B82F6]" />
                    Quick fill
                  </button>
                  <Link
                    href={activeTab === 'login' ? '/auth/register' : '/auth/login'}
                    onClick={() => syncTab(activeTab === 'login' ? 'register' : 'login')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#93c5fd] hover:text-[#2563EB]"
                  >
                    {activeTab === 'login' ? (
                      <>
                        <UserPlus className="h-4 w-4 text-[#3B82F6]" />
                        Register tab
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 text-[#3B82F6]" />
                        Login tab
                      </>
                    )}
                  </Link>
                </div>

                <div className="mt-6 rounded-[22px] border border-dashed border-[#bfdbfe] bg-[#eff6ff] p-4 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-slate-900">Ishlash tartibi</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>Login tab mavjud akkaunt bilan tizimga kirish uchun ishlatiladi.</li>
                    <li>Register tab email va parol orqali yangi customer akkaunt yaratadi.</li>
                    <li>Quick fill tugmasi test admin credential’larini avtomatik to‘ldiradi.</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-[28px] bg-[#0f172a] px-5 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:px-7 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold">Platforma</p>
            <p className="mt-2 text-sm text-white/65">
              Account access, buyurtmalar va wishlist boshqaruvi bir joyda.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Kirish</p>
            <p className="mt-2 text-sm text-white/65">
              Email va parol bilan mavjud akkauntga tez kiring.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Ro&apos;yxatdan o&apos;tish</p>
            <p className="mt-2 text-sm text-white/65">
              Yangi customer profilni shu sahifaning o&apos;zida yarating.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Yordam</p>
            <p className="mt-2 text-sm text-white/65">
              Parolni unutgan bo&apos;lsangiz, reset havolasi orqali qayta tiklang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

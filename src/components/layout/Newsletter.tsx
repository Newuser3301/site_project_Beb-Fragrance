// src/components/layout/Newsletter.tsx
'use client';

import { useState } from 'react';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to subscribe. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#1A1A1A] p-12 sm:p-16">
      <div className="mx-auto max-w-xl text-center">
        <Sparkles className="mx-auto h-8 w-8 text-[#D4A843]" />
        <h3 className="mt-6 font-serif text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Join the Club
        </h3>
        <p className="mt-3 text-sm text-[rgba(255,255,255,0.6)]">
          Be the first to know about new arrivals, exclusive offers, and fragrance insights.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-lg border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-white outline-none placeholder:text-[rgba(255,255,255,0.4)] transition-colors focus:border-[rgba(255,255,255,0.4)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[rgba(255,255,255,0.9)] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// src/app/loading.tsx
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Logo spinner */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-gold-200 border-t-gold-500" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-200">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      </div>

      {/* Brand name */}
      <div className="text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.4em] text-gold-500">
          Beb Fragrance
        </p>
        <p className="mt-1 text-xs tracking-wide text-muted-foreground">
          Loading...
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

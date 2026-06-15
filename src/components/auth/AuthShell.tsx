'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SprayCan } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

interface AuthShellProps {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthShell({
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[radial-gradient(circle_at_top,#fde7ef_0%,#fff7f9_42%,#ffffff_100%)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="rounded-[28px] border border-[rgba(106,53,83,0.08)] bg-white p-8 shadow-[0_24px_60px_rgba(109,65,92,0.12)] sm:p-10">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex flex-col items-center">
              <span className="font-serif text-[28px] font-semibold tracking-[0.14em] text-[#2e1b27]">
                {SITE_NAME.toUpperCase()}
              </span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-[#8e6880]">
                Premium Perfume Store
              </span>
            </Link>
            <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3b3c7] via-[#d6809f] to-[#6d415c] text-white">
              <SprayCan className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-serif text-3xl font-semibold text-[#2e1b27]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#7f6474]">{description}</p>
          </div>

          {children}

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </motion.div>
    </div>
  );
}

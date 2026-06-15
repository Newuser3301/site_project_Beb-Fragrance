// src/components/shared/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6"
        >
          <div className="flex items-start gap-4">
            <Cookie className="hidden h-6 w-6 shrink-0 text-gold-600 sm:block" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                We use cookies to enhance your browsing experience and analyze our
                traffic. By clicking &ldquo;Accept&rdquo;, you consent to our use of
                cookies.{' '}
                <a href="/privacy" className="text-gold-600 hover:underline">
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

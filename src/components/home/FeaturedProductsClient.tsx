// src/components/home/FeaturedProductsClient.tsx
'use client';

import { useState } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedProductsClientProps {
  initialProducts: any[];
}

export function FeaturedProductsClient({ initialProducts }: FeaturedProductsClientProps) {
  const t = useTranslations('products.filters.genders');
  const [activeTab, setActiveTab] = useState<'WOMEN' | 'MEN'>('WOMEN');

  const filteredProducts = initialProducts.filter(
    (product) => product.gender === activeTab
  );

  const tabs = [
    { id: 'WOMEN' as const, label: t('women') },
    { id: 'MEN' as const, label: t('men') },
  ];

  return (
    <div className="space-y-8">
      {/* Navigation tabs */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.18em]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-1 transition-colors hover:text-[#55324b] focus:outline-none ${
                isActive ? 'text-[#55324b] font-bold' : 'text-[#8c6d7d]/65'
              }`}
              type="button"
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeFeaturedTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#55324b]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          <ProductGrid products={filteredProducts.slice(0, 4)} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

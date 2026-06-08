'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];
  const hasMultipleImages = displayImages.length > 1;

  const goToPrevious = () => {
    setIsLoading(true);
    setActiveIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsLoading(true);
    setActiveIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      setIsLoading(true);
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        ref={containerRef}
        className="relative aspect-square max-h-[500px] w-full overflow-hidden rounded-xl border border-border bg-cream-50"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
        )}

        <motion.div
          className="relative h-full w-full"
          animate={{
            scale: isZooming ? 1.5 : 1,
          }}
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={displayImages[activeIndex]}
            alt={`${productName} - image ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            className={cn(
              'object-cover transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setIsLoading(false)}
          />
        </motion.div>

        {hasMultipleImages && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm md:hidden"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm md:hidden"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setIsLoading(true);
                setActiveIndex(index);
              }}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                index === activeIndex
                  ? 'border-gold-500 shadow-gold'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

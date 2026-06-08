'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      maxRating = 5,
      size = 'md',
      interactive = false,
      readOnly = false,
      onChange,
      className,
    },
    ref
  ) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);
    const isInteractive = interactive && !readOnly;

    const displayRating = hoverRating ?? rating;

    const handleClick = (index: number) => {
      if (isInteractive && onChange) {
        onChange(index);
      }
    };

    const handleMouseEnter = (index: number) => {
      if (isInteractive) {
        setHoverRating(index);
      }
    };

    const handleMouseLeave = () => {
      if (isInteractive) {
        setHoverRating(null);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-0.5', className)}
        role={isInteractive ? 'radiogroup' : 'img'}
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starIndex = index + 1;
          const isFilled = displayRating >= starIndex;
          const isHalf =
            !isFilled &&
            displayRating >= starIndex - 0.5 &&
            displayRating < starIndex;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!isInteractive}
              className={cn(
                'relative transition-transform duration-150',
                isInteractive &&
                  'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-1',
                !isInteractive && 'cursor-default'
              )}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
              role={isInteractive ? 'radio' : undefined}
              aria-checked={isInteractive ? isFilled : undefined}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-oud-200 transition-colors duration-150',
                  (isFilled || isHalf) && 'fill-gold-400 text-gold-400',
                  isInteractive && !isFilled && !isHalf && 'hover:text-gold-300'
                )}
              />
              {isHalf && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'absolute left-0 top-0 fill-gold-400 text-gold-400',
                    'clip-path-half'
                  )}
                  style={{
                    clipPath: 'inset(0 50% 0 0)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';

export { StarRating };

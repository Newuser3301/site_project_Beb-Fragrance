'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, PenLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Pagination } from '@/components/shared/Pagination';
import { reviewSchema } from '@/lib/validations';
import { formatDate } from '@/lib/utils';
import type { ReviewWithUser } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ProductReviewsProps {
  productId: string;
  initialReviews?: ReviewWithUser[];
  className?: string;
}

export function ProductReviews({
  productId,
  initialReviews = [],
  className,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [distribution, setDistribution] = useState<ReviewDistribution[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchReviews = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${page}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.items ?? []);
        setAverageRating(data.averageRating ?? 0);
        setReviewCount(data.reviewCount ?? 0);
        setDistribution(data.distribution ?? []);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, fetchReviews]);

  const handleWriteReview = () => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=/shop/${productId}`);
      return;
    }
    setIsDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    setError('');
    const validation = reviewSchema.safeParse({ rating, comment: comment || undefined });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'Invalid review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? 'Failed to submit review');
        return;
      }

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);
      setIsDialogOpen(false);
      setComment('');
      setRating(5);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      fetchReviews(1);
      setCurrentPage(1);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('space-y-8', className)}>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <span className="font-serif text-5xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating rating={averageRating} size="lg" readOnly />
              <p className="mt-1 text-sm text-muted-foreground">
                Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {distribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <span className="w-8 text-sm text-muted-foreground">
                  {item.rating}★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className="h-full rounded-full bg-gold-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-cream-50 p-8 text-center">
          <PenLine className="mb-4 h-8 w-8 text-gold-500" />
          <h4 className="font-serif text-lg font-semibold">Share Your Experience</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Help others discover this fragrance by writing a review.
          </p>
          <Button variant="luxury" className="mt-4" onClick={handleWriteReview}>
            Write a Review
          </Button>
        </div>
      </div>

      {isLoading && reviews.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No reviews yet. Be the first!
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-lg border border-border p-5"
            >
              <div className="flex items-start gap-4">
                <Avatar size="md">
                  <AvatarImage
                    src={review.user.image ?? undefined}
                    alt={review.user.name ?? 'User'}
                  />
                  <AvatarFallback name={review.user.name ?? 'User'} />
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{review.user.name ?? 'Anonymous'}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt, undefined, 'en-US')}
                    </span>
                  </div>
                  <StarRating
                    rating={review.rating}
                    size="sm"
                    readOnly
                    className="mt-1"
                  />
                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts about this fragrance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="mb-2 text-sm font-medium">Your Rating</p>
              <StarRating
                rating={rating}
                interactive
                onChange={setRating}
                size="lg"
              />
            </div>
            <Textarea
              label="Your Review (optional)"
              placeholder="Tell us what you think about this fragrance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="luxury"
              onClick={handleSubmitReview}
              isLoading={isSubmitting}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-oud-900 px-5 py-3 text-sm font-medium text-white shadow-luxury-lg"
          >
            <Check className="h-4 w-4 text-gold-400" />
            Review submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

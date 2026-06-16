// src/components/admin/ImageUpload.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CloudUpload, X, Star, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadedImage {
  url: string;
  isMain: boolean;
  uploading?: boolean;
  progress?: number;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    value.map((url, i) => ({ url, isMain: i === 0 }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setImages((prev) => {
      const uploading = prev.filter((img) => img.uploading);
      const stableUrls = prev.filter((img) => !img.uploading).map((img) => img.url);

      if (
        uploading.length === 0 &&
        stableUrls.length === value.length &&
        stableUrls.every((url, index) => url === value[index])
      ) {
        return prev;
      }

      return [
        ...value.map((url, i) => ({ url, isMain: i === 0 })),
        ...uploading,
      ];
    });
  }, [value]);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const currentCount = images.length;
      const remaining = MAX_FILES - currentCount;

      if (remaining <= 0) {
        toast.error(`Maximum ${MAX_FILES} images allowed`);
        return;
      }

      const toUpload = fileArray.slice(0, remaining);
      let uploadStarted = false;
      setIsUploading(true);

      for (const [index, file] of toUpload.entries()) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: Only JPG, PNG, WEBP allowed`);
          continue;
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name}: File must be under ${MAX_SIZE_MB}MB`);
          continue;
        }

        // Add placeholder
        const placeholderUrl = URL.createObjectURL(file);
        const placeholder: UploadedImage = {
          url: placeholderUrl,
          isMain: currentCount === 0 && index === 0,
          uploading: true,
          progress: 0,
        };

        setImages((prev) => [...prev, placeholder]);
        uploadStarted = true;
        let progressInterval: ReturnType<typeof setInterval> | null = null;

        try {
          // Simulate progress
          progressInterval = setInterval(() => {
            setImages((prev) =>
              prev.map((img) =>
                img.url === placeholderUrl
                  ? { ...img, progress: Math.min((img.progress ?? 0) + 20, 85) }
                  : img
              )
            );
          }, 200);

          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
          }

          const uploadedUrl = result.url;

          if (!uploadedUrl) {
            throw new Error('Upload URL was not returned');
          }

          setImages((prev) => {
            const updated = prev.map((img) =>
              img.url === placeholderUrl
                ? { ...img, url: uploadedUrl, uploading: false, progress: 100 }
                : img
            );
            onChange(updated.filter((i) => !i.uploading).map((i) => i.url));
            return updated;
          });

          URL.revokeObjectURL(placeholderUrl);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          toast.error(message);
          setImages((prev) => prev.filter((img) => img.url !== placeholderUrl));
          URL.revokeObjectURL(placeholderUrl);
        } finally {
          if (progressInterval) {
            clearInterval(progressInterval);
          }
        }
      }

      setIsUploading(false);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleRemove = (url: string) => {
    const updated = images.filter((img) => img.url !== url);
    if (updated.length > 0 && !updated.some((i) => i.isMain)) {
      updated[0].isMain = true;
    }
    setImages(updated);
    onChange(updated.filter((i) => !i.uploading).map((i) => i.url));
  };

  const handleSetMain = (url: string) => {
    const updated = images.map((img) => ({ ...img, isMain: img.url === url }));
    setImages(updated);
    // Put main image first in onChange
    const mainFirst = [
      ...updated.filter((i) => i.isMain),
      ...updated.filter((i) => !i.isMain),
    ];
    onChange(mainFirst.filter((i) => !i.uploading).map((i) => i.url));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-gold-400 bg-gold-50 scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-gold-400 hover:bg-gold-50/50',
          (images.length >= MAX_FILES || isUploading) && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          disabled={images.length >= MAX_FILES || isUploading}
        />
        <CloudUpload
          className={cn(
            'mb-3 h-10 w-10 transition-colors',
            isDragging ? 'text-gold-500' : 'text-gray-400'
          )}
        />
        <p className="text-sm font-medium text-gray-700">
          Drag & drop images here
        </p>
        <p className="mt-1 text-xs text-gray-400">
          or{' '}
          <span className="font-semibold text-gold-600 underline-offset-2 hover:underline">
            click to browse
          </span>
        </p>
        <p className="mt-2 text-[10px] text-gray-400">
          JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB · Up to {MAX_FILES} images
        </p>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="group relative aspect-square overflow-hidden rounded-xl border-2 bg-gray-100 transition-all"
                style={{
                  borderColor: img.isMain ? '#f59e0b' : '#e5e7eb',
                }}
              >
                {/* Image */}
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt="Upload preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}

                {/* Upload progress overlay */}
                {img.uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <div className="mt-2 h-1 w-3/4 overflow-hidden rounded-full bg-white/30">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-300"
                        style={{ width: `${img.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleSetMain(img.url); }}
                      className={cn(
                        'rounded-full p-1.5 text-white transition-colors',
                        img.isMain
                          ? 'bg-gold-500'
                          : 'bg-black/60 hover:bg-gold-500'
                      )}
                      title={img.isMain ? 'Main image' : 'Set as main'}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemove(img.url); }}
                      className="rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-destructive"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Main badge */}
                {img.isMain && !img.uploading && (
                  <div className="absolute bottom-1 left-1 rounded bg-gold-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    MAIN
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.filter((i) => !i.uploading).length}/{MAX_FILES} images uploaded · Star to set main image
      </p>
    </div>
  );
}

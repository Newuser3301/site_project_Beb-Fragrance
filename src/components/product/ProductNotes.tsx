'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProductNoteItem {
  name: string;
  type: 'TOP' | 'MIDDLE' | 'BASE';
}

export interface ProductNotesProps {
  notes?: string[];
  notesDetailed?: ProductNoteItem[];
  className?: string;
}

const noteLayers = [
  {
    type: 'TOP' as const,
    label: 'Top Notes',
    description: 'First impression',
    color: 'from-perfume-100 to-perfume-200 border-perfume-300 text-perfume-800',
    pillColor: 'bg-perfume-100 text-perfume-800 border-perfume-200',
    width: 'w-[60%]',
  },
  {
    type: 'MIDDLE' as const,
    label: 'Heart Notes',
    description: 'Core character',
    color: 'from-oud-100 to-oud-200 border-oud-300 text-oud-800',
    pillColor: 'bg-oud-100 text-oud-800 border-oud-200',
    width: 'w-[75%]',
  },
  {
    type: 'BASE' as const,
    label: 'Base Notes',
    description: 'Lasting depth',
    color: 'from-gold-100 to-gold-200 border-gold-300 text-gold-900',
    pillColor: 'bg-gold-100 text-gold-900 border-gold-200',
    width: 'w-[90%]',
  },
];

function buildNotesFromStrings(notes: string[]): ProductNoteItem[] {
  const types: Array<'TOP' | 'MIDDLE' | 'BASE'> = ['TOP', 'MIDDLE', 'BASE'];
  return notes.map((name, index) => ({
    name,
    type: types[index % types.length],
  }));
}

export function ProductNotes({
  notes = [],
  notesDetailed,
  className,
}: ProductNotesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const allNotes =
    notesDetailed && notesDetailed.length > 0
      ? notesDetailed
      : buildNotesFromStrings(notes);

  if (allNotes.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={cn('mx-auto max-w-lg', className)}>
      <div className="mb-6 text-center">
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Fragrance Pyramid
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover the layers of this exquisite scent
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        {noteLayers.map((layer, layerIndex) => {
          const layerNotes = allNotes.filter((note) => note.type === layer.type);

          if (layerNotes.length === 0) return null;

          return (
            <motion.div
              key={layer.type}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: layerIndex * 0.15 }}
              className={cn(
                'rounded-lg border bg-gradient-to-b p-5 text-center',
                layer.color,
                layer.width
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                {layer.label}
              </p>
              <p className="mb-3 text-[10px] opacity-60">{layer.description}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {layerNotes.map((note) => (
                  <span
                    key={`${layer.type}-${note.name}`}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium',
                      layer.pillColor
                    )}
                  >
                    {note.name}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

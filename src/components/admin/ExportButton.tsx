// src/components/admin/ExportButton.tsx
'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
  format?: 'csv' | 'json';
  className?: string;
  label?: string;
}

function toCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const escape = (val: unknown): string => {
    const str = String(val ?? '').replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str}"`
      : str;
  };
  const rows = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ];
  return rows.join('\n');
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportButton({
  data,
  filename = 'export',
  format = 'csv',
  className,
  label = 'Export',
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          if (format === 'json') {
            downloadBlob(
              JSON.stringify(data, null, 2),
              `${filename}.json`,
              'application/json'
            );
          } else {
            downloadBlob(toCSV(data), `${filename}.csv`, 'text/csv;charset=utf-8;');
          }
          resolve();
        }, 300);
      });

      toast.success(
        `${data.length} records exported as ${format.toUpperCase()}`
      );
    } catch {
      toast.error('Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isLoading || data.length === 0}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {label} {format.toUpperCase()}
    </button>
  );
}

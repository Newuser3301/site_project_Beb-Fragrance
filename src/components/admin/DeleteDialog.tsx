// src/components/admin/DeleteDialog.tsx
'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface DeleteDialogProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteDialog({
  children,
  isOpen: controlledOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
}: DeleteDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    } else if (!open && onClose) {
      onClose();
    }
  };
  
  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <DialogTitle className="text-lg">
            {title ?? `Delete ${itemName ?? 'item'}?`}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm">
            {description ??
              `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={isLoading}
            className="flex-1 gap-2"
          >
            {!isLoading && <Trash2 className="h-4 w-4" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

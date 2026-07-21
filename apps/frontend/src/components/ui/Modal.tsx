import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className={cn("glass-card w-full max-w-lg bg-vaquita-bg flex flex-col pointer-events-auto max-h-[90vh]", className)}>
              <div className="flex items-center justify-between p-4 border-b border-vaquita-border">
                <h2 className="text-lg font-semibold text-vaquita-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-vaquita-text-tertiary hover:text-vaquita-white hover:bg-vaquita-bg-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                {children}
              </div>
              {footer && (
                <div className="p-4 border-t border-vaquita-border flex items-center justify-end space-x-2">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

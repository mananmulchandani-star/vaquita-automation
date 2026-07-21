import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-vaquita-text-secondary hover:text-vaquita-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              destructive
                ? 'bg-vaquita-error hover:bg-vaquita-error-muted text-white'
                : 'bg-vaquita-white hover:bg-vaquita-accent-hover text-vaquita-black'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex space-x-4 mt-2">
        {destructive && (
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-vaquita-error/20 flex items-center justify-center">
              <AlertTriangle className="text-vaquita-error" size={20} />
            </div>
          </div>
        )}
        <p className="text-sm text-vaquita-text-secondary leading-relaxed">{description}</p>
      </div>
    </Modal>
  );
}

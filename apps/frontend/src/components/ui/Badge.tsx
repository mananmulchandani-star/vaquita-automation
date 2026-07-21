import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    success: 'bg-vaquita-success-muted/20 text-vaquita-success border-vaquita-success/20',
    warning: 'bg-vaquita-warning-muted/20 text-vaquita-warning border-vaquita-warning/20',
    error: 'bg-vaquita-error-muted/20 text-vaquita-error border-vaquita-error/20',
    info: 'bg-vaquita-info-muted/20 text-vaquita-info border-vaquita-info/20',
    neutral: 'bg-vaquita-bg-tertiary text-vaquita-text-secondary border-vaquita-border',
    default: 'bg-vaquita-white text-vaquita-black border-transparent',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

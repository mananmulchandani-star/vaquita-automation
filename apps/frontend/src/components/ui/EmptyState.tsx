import React from 'react';
import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = FileQuestion, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center glass-card border-dashed", className)}>
      <div className="w-16 h-16 bg-vaquita-bg-secondary rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-vaquita-text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-vaquita-white mb-2">{title}</h3>
      <p className="text-sm text-vaquita-text-tertiary max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

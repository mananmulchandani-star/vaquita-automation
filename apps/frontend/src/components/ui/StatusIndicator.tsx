import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';

export interface StatusIndicatorProps {
  status: string;
  label?: string;
  pulse?: boolean;
}

export function StatusIndicator({ status, label, pulse = true }: StatusIndicatorProps) {
  const colorClass = getStatusColor(status);
  
  // Custom mapping for indicator dot background
  const dotColorClass = colorClass.replace('text-', 'bg-');

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex h-2.5 w-2.5">
        {pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColorClass)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", dotColorClass)} />
      </div>
      {label && <span className="text-sm font-medium text-vaquita-white capitalize">{label}</span>}
    </div>
  );
}

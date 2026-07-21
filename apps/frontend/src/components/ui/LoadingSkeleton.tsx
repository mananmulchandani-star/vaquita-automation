import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  className?: string;
  type?: 'card' | 'text' | 'avatar' | 'row';
}

export function LoadingSkeleton({ className, type = 'text' }: LoadingSkeletonProps) {
  const baseClass = "animate-pulse bg-vaquita-bg-secondary rounded";
  
  switch (type) {
    case 'card':
      return <div className={cn(baseClass, "h-32 w-full rounded-xl", className)} />;
    case 'avatar':
      return <div className={cn(baseClass, "h-10 w-10 rounded-full", className)} />;
    case 'row':
      return <div className={cn(baseClass, "h-12 w-full", className)} />;
    case 'text':
    default:
      return <div className={cn(baseClass, "h-4 w-3/4", className)} />;
  }
}

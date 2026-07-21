import React from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  className?: string;
  loading?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, className, loading }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("glass-card p-6 flex flex-col relative overflow-hidden group", className)}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-4 -translate-y-4">
        <Icon size={80} />
      </div>
      
      <div className="flex items-center space-x-3 text-vaquita-text-secondary mb-4 z-10">
        <div className="p-2 rounded-lg bg-vaquita-bg-tertiary">
          <Icon size={18} className="text-vaquita-white" />
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      
      <div className="z-10">
        {loading ? (
          <div className="h-8 w-24 bg-vaquita-bg-tertiary rounded animate-pulse" />
        ) : (
          <div className="text-3xl font-semibold text-vaquita-white tracking-tight">{value}</div>
        )}
      </div>

      {change !== undefined && !loading && (
        <div className="mt-4 flex items-center z-10">
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              change >= 0 
                ? "bg-vaquita-success-muted/20 text-vaquita-success" 
                : "bg-vaquita-error-muted/20 text-vaquita-error"
            )}
          >
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-vaquita-text-tertiary ml-2">vs last period</span>
        </div>
      )}
    </motion.div>
  );
}

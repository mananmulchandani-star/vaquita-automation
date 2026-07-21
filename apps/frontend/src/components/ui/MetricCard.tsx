import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface MetricCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function MetricCard({ label, value, className }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("glass-card p-4 flex flex-col items-start justify-center", className)}
    >
      <span className="text-sm text-vaquita-text-secondary font-medium mb-1">{label}</span>
      <span className="text-2xl font-semibold text-vaquita-white">{value}</span>
    </motion.div>
  );
}

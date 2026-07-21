import React from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon: React.ElementType;
  type?: 'order' | 'message' | 'automation' | 'shipping' | 'note';
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'order': return 'bg-vaquita-info text-vaquita-info border-vaquita-info/20';
      case 'message': return 'bg-vaquita-success text-vaquita-success border-vaquita-success/20';
      case 'automation': return 'bg-vaquita-warning text-vaquita-warning border-vaquita-warning/20';
      case 'shipping': return 'bg-vaquita-text text-vaquita-text border-vaquita-border';
      default: return 'bg-vaquita-bg-tertiary text-vaquita-text-secondary border-vaquita-border';
    }
  };

  return (
    <div className={cn("relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-vaquita-border before:to-transparent", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const colorClasses = getTypeColor(item.type);
        
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.id} 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-vaquita-bg bg-vaquita-bg-secondary text-vaquita-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
              <Icon size={16} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 rounded-xl group-hover:border-vaquita-border-light transition-colors">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-vaquita-white text-sm">{item.title}</h4>
                <time className="text-xs text-vaquita-text-tertiary">{formatRelativeTime(item.timestamp)}</time>
              </div>
              {item.description && (
                <p className="text-sm text-vaquita-text-secondary">{item.description}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

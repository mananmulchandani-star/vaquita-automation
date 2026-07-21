import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 border-b border-vaquita-border", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors",
              isActive ? "text-vaquita-white" : "text-vaquita-text-secondary hover:text-vaquita-text"
            )}
          >
            <div className="flex items-center space-x-2">
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-vaquita-white text-vaquita-black" : "bg-vaquita-bg-tertiary text-vaquita-text-secondary"
                )}>
                  {tab.badge}
                </span>
              )}
            </div>
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-vaquita-white"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

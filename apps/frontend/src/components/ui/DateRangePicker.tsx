import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateRangePickerProps {
  onChange: (range: { start: Date; end: Date }) => void;
  className?: string;
}

export function DateRangePicker({ onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('Today');

  const presets = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Custom'];

  return (
    <div className={cn("relative", className)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-4 py-2 text-sm text-vaquita-white hover:border-vaquita-border-light transition-colors"
      >
        <Calendar size={16} className="text-vaquita-text-secondary" />
        <span>{selectedPreset}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-vaquita-bg glass-card rounded-xl shadow-xl z-50 overflow-hidden border border-vaquita-border p-1">
          {presets.map((preset) => (
            <button
              key={preset}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                selectedPreset === preset 
                  ? "bg-vaquita-bg-tertiary text-vaquita-white font-medium" 
                  : "text-vaquita-text-secondary hover:bg-vaquita-bg-secondary hover:text-vaquita-white"
              )}
              onClick={() => {
                setSelectedPreset(preset);
                setIsOpen(false);
                // Call onChange with actual dates based on preset
                onChange({ start: new Date(), end: new Date() });
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

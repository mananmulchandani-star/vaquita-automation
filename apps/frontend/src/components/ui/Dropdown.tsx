import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  destructive?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | 'separator')[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 mt-2 w-48 rounded-xl glass-card bg-vaquita-bg/95 shadow-xl border border-vaquita-border py-1",
            align === 'right' ? 'origin-top-right right-0' : 'origin-top-left left-0'
          )}
        >
          {items.map((item, index) => {
            if (item === 'separator') {
              return <div key={`sep-${index}`} className="h-px bg-vaquita-border my-1 mx-2" />;
            }

            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors",
                  item.destructive
                    ? "text-vaquita-error hover:bg-vaquita-error/10"
                    : "text-vaquita-text hover:bg-vaquita-bg-secondary hover:text-vaquita-white"
                )}
              >
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

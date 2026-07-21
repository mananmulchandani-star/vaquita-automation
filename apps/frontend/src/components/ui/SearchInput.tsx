import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app.store';

export interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = 'Search...', className }: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== searchQuery) {
        setSearchQuery(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, setSearchQuery, searchQuery]);

  return (
    <div className={cn("relative group", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vaquita-text-tertiary group-focus-within:text-vaquita-white transition-colors" size={18} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full bg-vaquita-bg-secondary border border-vaquita-border rounded-lg pl-10 pr-10 py-2 text-sm text-vaquita-white placeholder-vaquita-text-tertiary focus:outline-none focus:border-vaquita-border-focus focus:ring-1 focus:ring-vaquita-border-focus transition-all"
      />
      {localValue && (
        <button 
          onClick={() => setLocalValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-vaquita-text-tertiary hover:text-vaquita-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

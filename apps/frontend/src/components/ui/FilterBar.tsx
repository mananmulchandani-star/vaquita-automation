import React from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterBarProps {
  activeFilters: FilterOption[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
  onAddFilterClick?: () => void;
}

export function FilterBar({ activeFilters, onRemoveFilter, onClearAll, onAddFilterClick }: FilterBarProps) {
  if (activeFilters.length === 0) {
    return (
      <button 
        onClick={onAddFilterClick}
        className="flex items-center space-x-2 text-sm text-vaquita-text-secondary hover:text-vaquita-white transition-colors px-3 py-1.5 rounded-lg border border-vaquita-border hover:bg-vaquita-bg-secondary"
      >
        <Filter size={16} />
        <span>Add filter</span>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button 
        onClick={onAddFilterClick}
        className="p-1.5 rounded-lg border border-vaquita-border text-vaquita-text-secondary hover:text-vaquita-white hover:bg-vaquita-bg-secondary transition-colors"
      >
        <Filter size={16} />
      </button>
      
      {activeFilters.map(filter => (
        <div key={filter.id} className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-vaquita-bg-tertiary border border-vaquita-border text-xs text-vaquita-text font-medium">
          <span className="text-vaquita-text-secondary mr-1">{filter.label}:</span>
          <span>{filter.value}</span>
          <button 
            onClick={() => onRemoveFilter(filter.id)}
            className="ml-1 hover:text-vaquita-error transition-colors p-0.5 rounded-full hover:bg-vaquita-border"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      <button 
        onClick={onClearAll}
        className="text-xs font-medium text-vaquita-text-secondary hover:text-vaquita-white transition-colors ml-2"
      >
        Clear all
      </button>
    </div>
  );
}

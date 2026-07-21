import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  searchable?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyState,
  searchable,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-vaquita-bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      {searchable && (
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vaquita-text-tertiary" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-vaquita-bg-secondary border border-vaquita-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-vaquita-white focus:outline-none focus:border-vaquita-border-focus"
          />
        </div>
      )}

      <div className="w-full overflow-x-auto border border-vaquita-border rounded-xl glass">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-vaquita-border bg-vaquita-bg-secondary/50">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-medium text-vaquita-text-secondary uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-vaquita-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-vaquita-text-secondary">
                  {emptyState || 'No data available'}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "group transition-colors",
                    onRowClick ? "cursor-pointer hover:bg-vaquita-bg-secondary/30" : ""
                  )}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-vaquita-white whitespace-nowrap">
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

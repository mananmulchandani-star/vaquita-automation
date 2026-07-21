import React from 'react';
import { getInitials, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { MessageSquare, ShoppingBag } from 'lucide-react';

export interface CustomerCardProps {
  id: string;
  name: string;
  phone: string;
  totalSpend: number;
  orderCount: number;
  optInStatus: boolean;
  lastOrderDate: string;
  tags: string[];
  onClick?: () => void;
}

export function CustomerCard({
  name, phone, totalSpend, orderCount, optInStatus, lastOrderDate, tags, onClick
}: CustomerCardProps) {
  return (
    <div 
      onClick={onClick}
      className="glass-card p-5 hover:border-vaquita-border-light cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-vaquita-bg-tertiary border border-vaquita-border flex items-center justify-center text-sm font-semibold text-vaquita-white">
            {getInitials(name)}
          </div>
          <div>
            <h3 className="font-semibold text-vaquita-white group-hover:text-vaquita-info transition-colors">{name}</h3>
            <p className="text-sm text-vaquita-text-secondary">{phone}</p>
          </div>
        </div>
        <Badge variant={optInStatus ? 'success' : 'neutral'}>
          {optInStatus ? 'OPTED IN' : 'OPTED OUT'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-vaquita-border mb-3 bg-vaquita-bg/30 -mx-5 px-5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-vaquita-bg-secondary rounded text-vaquita-text-secondary">
            <ShoppingBag size={14} />
          </div>
          <div>
            <p className="text-xs text-vaquita-text-tertiary">Orders</p>
            <p className="text-sm font-medium text-vaquita-white">{orderCount}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-vaquita-text-tertiary">Total Spend</p>
          <p className="text-sm font-medium text-vaquita-success">{formatCurrency(totalSpend, 'INR')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-vaquita-bg-secondary text-vaquita-text-secondary border border-vaquita-border">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-vaquita-bg-secondary text-vaquita-text-secondary border border-vaquita-border">
              +{tags.length - 3}
            </span>
          )}
        </div>
        <div className="text-xs text-vaquita-text-tertiary">
          Last order: {formatDate(lastOrderDate).split(',')[0]}
        </div>
      </div>
    </div>
  );
}

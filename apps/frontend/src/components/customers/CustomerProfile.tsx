import React from 'react';
import { getInitials, formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Phone, Mail, MapPin, Tag, MessageCircle } from 'lucide-react';

export interface CustomerProfileProps {
  customer: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    totalSpend: number;
    orderCount: number;
    avgOrderValue: number;
    clv: number;
    optInStatus: boolean;
    tags: string[];
    notes?: string;
  };
  onToggleOptIn?: () => void;
  onSendMessage?: () => void;
}

export function CustomerProfile({ customer, onToggleOptIn, onSendMessage }: CustomerProfileProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 text-center border-b border-vaquita-border relative">
        <div className="absolute top-4 right-4">
          <Badge variant={customer.optInStatus ? 'success' : 'neutral'} className="cursor-pointer" onClick={onToggleOptIn}>
            {customer.optInStatus ? 'OPTED IN' : 'OPTED OUT'}
          </Badge>
        </div>
        
        <div className="w-20 h-20 mx-auto rounded-full bg-vaquita-bg-elevated border-2 border-vaquita-border flex items-center justify-center text-2xl font-bold text-vaquita-white mb-4 shadow-lg">
          {getInitials(customer.name)}
        </div>
        <h2 className="text-xl font-semibold text-vaquita-white">{customer.name}</h2>
        <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-vaquita-text-secondary">
          <span className="flex items-center"><Phone size={14} className="mr-1" /> {customer.phone}</span>
          {customer.email && <span className="flex items-center"><Mail size={14} className="mr-1" /> {customer.email}</span>}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button onClick={onSendMessage} className="flex items-center space-x-2 bg-vaquita-success text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-vaquita-success/90 transition-colors shadow-lg shadow-vaquita-success/20">
            <MessageCircle size={16} />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-vaquita-border">
        <div className="bg-vaquita-bg p-4 text-center">
          <p className="text-xs text-vaquita-text-tertiary mb-1">Total Spend</p>
          <p className="text-lg font-semibold text-vaquita-white">{formatCurrency(customer.totalSpend, 'INR')}</p>
        </div>
        <div className="bg-vaquita-bg p-4 text-center">
          <p className="text-xs text-vaquita-text-tertiary mb-1">Orders</p>
          <p className="text-lg font-semibold text-vaquita-white">{customer.orderCount}</p>
        </div>
        <div className="bg-vaquita-bg p-4 text-center">
          <p className="text-xs text-vaquita-text-tertiary mb-1">Avg Order Value</p>
          <p className="text-lg font-semibold text-vaquita-white">{formatCurrency(customer.avgOrderValue, 'INR')}</p>
        </div>
        <div className="bg-vaquita-bg p-4 text-center">
          <p className="text-xs text-vaquita-text-tertiary mb-1">Lifetime Value</p>
          <p className="text-lg font-semibold text-vaquita-success">{formatCurrency(customer.clv, 'INR')}</p>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-vaquita-bg">
        {customer.address && (
          <div>
            <h4 className="text-xs font-semibold text-vaquita-text-secondary uppercase tracking-wider mb-2 flex items-center">
              <MapPin size={12} className="mr-1" /> Address
            </h4>
            <p className="text-sm text-vaquita-text">{customer.address}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold text-vaquita-text-secondary uppercase tracking-wider mb-2 flex items-center">
            <Tag size={12} className="mr-1" /> Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {customer.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-vaquita-bg-secondary border border-vaquita-border text-xs text-vaquita-text-secondary">
                {tag}
              </span>
            ))}
            <button className="px-2.5 py-1 rounded-full bg-transparent border border-dashed border-vaquita-border text-xs text-vaquita-text-tertiary hover:text-vaquita-white hover:border-vaquita-border-focus transition-colors">
              + Add
            </button>
          </div>
        </div>

        {customer.notes && (
          <div>
            <h4 className="text-xs font-semibold text-vaquita-text-secondary uppercase tracking-wider mb-2">Notes</h4>
            <p className="text-sm text-vaquita-text italic bg-vaquita-bg-secondary p-3 rounded-lg border border-vaquita-border">
              {customer.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

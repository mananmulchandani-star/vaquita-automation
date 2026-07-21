import React from 'react';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AlertTriangle, MapPin } from 'lucide-react';

export interface OrderCardProps {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  paymentMethod: 'COD' | 'PREPAID';
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'delivered' | 'rto';
  codConfirmed: boolean;
  rtoRisk: 'low' | 'medium' | 'high';
  date: string;
  city?: string;
  onClick?: () => void;
}

export function OrderCard({
  id, orderNumber, customerName, amount, paymentMethod, fulfillmentStatus, codConfirmed, rtoRisk, date, city, onClick
}: OrderCardProps) {
  return (
    <div 
      onClick={onClick}
      className="glass-card p-4 hover:bg-vaquita-bg-secondary/30 transition-colors cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-vaquita-white group-hover:text-vaquita-info transition-colors">#{orderNumber}</h3>
          <p className="text-sm text-vaquita-text-secondary mt-0.5">{customerName}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-vaquita-white">{formatCurrency(amount, 'INR')}</p>
          <p className="text-xs text-vaquita-text-tertiary mt-1">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 mb-3">
        <Badge variant={paymentMethod === 'PREPAID' ? 'success' : 'warning'}>
          {paymentMethod}
        </Badge>
        <Badge variant={
          fulfillmentStatus === 'delivered' ? 'success' : 
          fulfillmentStatus === 'rto' ? 'error' : 
          'neutral'
        }>
          {fulfillmentStatus.toUpperCase()}
        </Badge>
        {paymentMethod === 'COD' && codConfirmed && (
          <Badge variant="success">CONFIRMED</Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-vaquita-border">
        <div className="flex items-center text-xs text-vaquita-text-secondary">
          {city && (
            <>
              <MapPin size={12} className="mr-1" />
              <span>{city}</span>
            </>
          )}
        </div>
        {paymentMethod === 'COD' && (
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded ${
            rtoRisk === 'high' ? 'bg-vaquita-error/10 text-vaquita-error' :
            rtoRisk === 'medium' ? 'bg-vaquita-warning/10 text-vaquita-warning' :
            'bg-vaquita-success/10 text-vaquita-success'
          }`}>
            <AlertTriangle size={12} className="mr-1" />
            {rtoRisk.toUpperCase()} RISK
          </div>
        )}
      </div>
    </div>
  );
}

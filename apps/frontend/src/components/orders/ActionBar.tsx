import React from 'react';
import { Send, CheckCircle, Tag, XCircle, MessageSquare } from 'lucide-react';

export interface ActionBarProps {
  onResendConfirmation?: () => void;
  onSendMessage?: () => void;
  onConfirmCOD?: () => void;
  onGenerateCoupon?: () => void;
  onCancelOrder?: () => void;
}

export function ActionBar({ 
  onResendConfirmation, onSendMessage, onConfirmCOD, onGenerateCoupon, onCancelOrder 
}: ActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onConfirmCOD && (
        <button onClick={onConfirmCOD} className="flex items-center space-x-2 px-4 py-2 bg-vaquita-success/10 text-vaquita-success border border-vaquita-success/20 rounded-lg hover:bg-vaquita-success/20 transition-colors text-sm font-medium">
          <CheckCircle size={16} />
          <span>Confirm COD</span>
        </button>
      )}
      
      {onResendConfirmation && (
        <button onClick={onResendConfirmation} className="flex items-center space-x-2 px-4 py-2 bg-vaquita-bg-secondary text-vaquita-white border border-vaquita-border rounded-lg hover:bg-vaquita-bg-tertiary transition-colors text-sm font-medium">
          <Send size={16} />
          <span>Resend Confirmation</span>
        </button>
      )}

      {onSendMessage && (
        <button onClick={onSendMessage} className="flex items-center space-x-2 px-4 py-2 bg-vaquita-bg-secondary text-vaquita-white border border-vaquita-border rounded-lg hover:bg-vaquita-bg-tertiary transition-colors text-sm font-medium">
          <MessageSquare size={16} />
          <span>WhatsApp Message</span>
        </button>
      )}

      {onGenerateCoupon && (
        <button onClick={onGenerateCoupon} className="flex items-center space-x-2 px-4 py-2 bg-vaquita-bg-secondary text-vaquita-white border border-vaquita-border rounded-lg hover:bg-vaquita-bg-tertiary transition-colors text-sm font-medium">
          <Tag size={16} />
          <span>Generate Coupon</span>
        </button>
      )}

      {onCancelOrder && (
        <button onClick={onCancelOrder} className="flex items-center space-x-2 px-4 py-2 bg-vaquita-error/10 text-vaquita-error border border-vaquita-error/20 rounded-lg hover:bg-vaquita-error/20 transition-colors text-sm font-medium ml-auto">
          <XCircle size={16} />
          <span>Cancel Order</span>
        </button>
      )}
    </div>
  );
}

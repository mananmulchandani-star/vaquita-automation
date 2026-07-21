import React from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Check, CheckCheck, FileText, Image as ImageIcon, Video } from 'lucide-react';

export interface MessageBubbleProps {
  id: string;
  type: 'text' | 'image' | 'video' | 'document' | 'template';
  content: any;
  direction: 'inbound' | 'outbound';
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
}

export function MessageBubble({ type, content, direction, status, timestamp }: MessageBubbleProps) {
  const isOutbound = direction === 'outbound';

  return (
    <div className={cn("flex w-full mb-4", isOutbound ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[75%] rounded-2xl p-3 relative group",
          isOutbound 
            ? "bg-vaquita-bg-elevated border border-vaquita-border text-vaquita-white rounded-br-sm" 
            : "bg-vaquita-bg-secondary text-vaquita-text rounded-bl-sm"
        )}
      >
        {type === 'text' && (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
        
        {(type === 'image' || type === 'video') && (
          <div className="rounded-xl overflow-hidden bg-vaquita-bg mb-2">
            {type === 'image' ? (
              <div className="aspect-square flex items-center justify-center bg-vaquita-bg-tertiary">
                {content.url ? (
                  <img src={content.url} alt="Media" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-vaquita-text-tertiary" size={32} />
                )}
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-vaquita-bg-tertiary">
                <Video className="text-vaquita-text-tertiary" size={32} />
              </div>
            )}
            {content.caption && (
              <p className="text-sm mt-2 px-1">{content.caption}</p>
            )}
          </div>
        )}

        {type === 'document' && (
          <div className="flex items-center space-x-3 bg-vaquita-bg p-3 rounded-xl mb-2">
            <div className="p-2 bg-vaquita-bg-secondary rounded-lg">
              <FileText className="text-vaquita-text-secondary" size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{content.filename || 'Document'}</p>
              <p className="text-xs text-vaquita-text-tertiary uppercase">{content.extension || 'PDF'}</p>
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex items-center justify-end space-x-1 mt-1",
          isOutbound ? "text-vaquita-text-secondary" : "text-vaquita-text-tertiary"
        )}>
          <span className="text-[10px]">{formatRelativeTime(timestamp)}</span>
          {isOutbound && status && (
            <span className="ml-1">
              {status === 'sent' && <Check size={12} />}
              {status === 'delivered' && <CheckCheck size={12} />}
              {status === 'read' && <CheckCheck size={12} className="text-vaquita-info" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from 'react';
import { MessageBubble, MessageBubbleProps } from './MessageBubble';
import { cn } from '@/lib/utils';
import { EmptyState } from '../ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export interface ConversationThreadProps {
  messages: MessageBubbleProps[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function ConversationThread({ messages, onLoadMore, hasMore, loading }: ConversationThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 h-full">
        <EmptyState
          title="No messages yet"
          description="Send a message to start the conversation."
          icon={MessageSquare}
        />
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]"
      style={{
        backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {hasMore && (
        <div className="flex justify-center py-4">
          <button 
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-1 rounded-full bg-vaquita-bg-secondary text-xs text-vaquita-text-secondary hover:text-vaquita-white transition-colors"
          >
            {loading ? 'Loading...' : 'Load older messages'}
          </button>
        </div>
      )}

      {/* Group by date could go here */}
      <div className="flex justify-center py-2">
        <span className="px-3 py-1 rounded-full bg-vaquita-bg-secondary/50 text-[10px] text-vaquita-text-tertiary backdrop-blur-sm border border-vaquita-border/50 uppercase tracking-widest font-medium">
          Today
        </span>
      </div>

      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}
    </div>
  );
}

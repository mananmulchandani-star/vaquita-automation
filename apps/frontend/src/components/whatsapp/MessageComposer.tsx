import React, { useState } from 'react';
import { Send, Paperclip, FileText, ImageIcon, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MessageComposerProps {
  onSend: (content: string, type: 'text' | 'template' | 'media') => void;
  className?: string;
}

export function MessageComposer({ onSend, className }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message, 'text');
    setMessage('');
  };

  return (
    <div className={cn("p-4 bg-vaquita-bg border-t border-vaquita-border glass flex items-end space-x-2", className)}>
      <div className="flex space-x-1 mb-1">
        <button className="p-2 text-vaquita-text-secondary hover:text-vaquita-white hover:bg-vaquita-bg-secondary rounded-full transition-colors">
          <Paperclip size={20} />
        </button>
        <button className="p-2 text-vaquita-text-secondary hover:text-vaquita-white hover:bg-vaquita-bg-secondary rounded-full transition-colors">
          <FileText size={20} />
        </button>
      </div>
      
      <div className="flex-1 bg-vaquita-bg-secondary border border-vaquita-border focus-within:border-vaquita-border-focus rounded-2xl flex items-center overflow-hidden transition-colors">
        <button className="pl-3 pr-2 text-vaquita-text-secondary hover:text-vaquita-white">
          <Smile size={20} />
        </button>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-transparent py-3 px-2 text-sm text-vaquita-white focus:outline-none resize-none max-h-32 min-h-[44px]"
          rows={1}
        />
      </div>
      
      <button 
        onClick={handleSend}
        disabled={!message.trim()}
        className={cn(
          "p-3 rounded-full flex items-center justify-center transition-all mb-0.5",
          message.trim() 
            ? "bg-vaquita-white text-vaquita-black hover:scale-105" 
            : "bg-vaquita-bg-secondary text-vaquita-text-tertiary cursor-not-allowed"
        )}
      >
        <Send size={18} className={cn(message.trim() && "ml-0.5")} />
      </button>
    </div>
  );
}

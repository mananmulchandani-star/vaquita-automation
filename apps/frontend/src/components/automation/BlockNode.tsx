import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Clock, 
  SplitSquareHorizontal, 
  Filter, 
  Zap, 
  GitBranch, 
  StopCircle,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export type BlockType = 'trigger' | 'delay' | 'condition' | 'filter' | 'action' | 'branch' | 'end';

export interface BlockNodeProps {
  id: string;
  type: BlockType;
  title: string;
  summary?: string;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const getTypeConfig = (type: BlockType) => {
  switch (type) {
    case 'trigger': return { icon: Play, color: 'bg-[#9333EA]', border: 'border-[#9333EA]/30', text: 'text-[#D8B4FE]' };
    case 'delay': return { icon: Clock, color: 'bg-[#EAB308]', border: 'border-[#EAB308]/30', text: 'text-[#FEF08A]' };
    case 'condition': return { icon: SplitSquareHorizontal, color: 'bg-[#3B82F6]', border: 'border-[#3B82F6]/30', text: 'text-[#BFDBFE]' };
    case 'filter': return { icon: Filter, color: 'bg-[#F97316]', border: 'border-[#F97316]/30', text: 'text-[#FED7AA]' };
    case 'action': return { icon: Zap, color: 'bg-[#22C55E]', border: 'border-[#22C55E]/30', text: 'text-[#BBF7D0]' };
    case 'branch': return { icon: GitBranch, color: 'bg-[#14B8A6]', border: 'border-[#14B8A6]/30', text: 'text-[#99F6E4]' };
    case 'end': return { icon: StopCircle, color: 'bg-[#525252]', border: 'border-[#525252]/30', text: 'text-[#D4D4D4]' };
  }
};

export function BlockNode({ id, type, title, summary, selected, onClick, onDelete }: BlockNodeProps) {
  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "relative w-64 glass-card p-0 overflow-hidden cursor-pointer group transition-all duration-200",
        selected ? "border-vaquita-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "hover:border-vaquita-border-light"
      )}
      onClick={onClick}
    >
      <div className={cn("h-1 w-full absolute top-0 left-0", config.color)} />
      
      <div className="p-4 flex items-start space-x-3">
        <div className={cn("p-2 rounded-lg bg-vaquita-bg flex-shrink-0 border", config.border)}>
          <Icon size={18} className={config.text} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-vaquita-white truncate">{title}</h4>
          {summary && (
            <p className="text-xs text-vaquita-text-tertiary mt-1 line-clamp-2">{summary}</p>
          )}
        </div>

        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-vaquita-text-tertiary hover:text-vaquita-error hover:bg-vaquita-error/10 rounded transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {type !== 'end' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-vaquita-bg border-2 border-vaquita-border rounded-full z-10 group-hover:border-vaquita-white transition-colors" />
      )}
      {type !== 'trigger' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-vaquita-bg border-2 border-vaquita-border rounded-full z-10 group-hover:border-vaquita-white transition-colors" />
      )}
    </motion.div>
  );
}

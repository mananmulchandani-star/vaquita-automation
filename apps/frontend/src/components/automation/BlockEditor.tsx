import React from 'react';
import { X, Save } from 'lucide-react';
import { BlockType } from './BlockNode';

export interface BlockEditorProps {
  block: { id: string; type: BlockType; title: string; config?: any } | null;
  onClose: () => void;
  onSave: (id: string, config: any) => void;
}

export function BlockEditor({ block, onClose, onSave }: BlockEditorProps) {
  if (!block) return null;

  return (
    <div className="w-80 h-full border-l border-vaquita-border glass flex flex-col absolute right-0 top-0 bottom-0 shadow-2xl z-20">
      <div className="flex items-center justify-between p-4 border-b border-vaquita-border bg-vaquita-bg/50">
        <h3 className="font-semibold text-vaquita-white">Edit {block.title}</h3>
        <button onClick={onClose} className="p-1 text-vaquita-text-tertiary hover:text-vaquita-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mock Dynamic Form Fields */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-vaquita-text-secondary uppercase tracking-wider">Node Name</label>
          <input 
            type="text" 
            defaultValue={block.title}
            className="w-full bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-3 py-2 text-sm text-vaquita-white focus:border-vaquita-white focus:outline-none transition-colors"
          />
        </div>

        {block.type === 'action' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-vaquita-text-secondary uppercase tracking-wider">Action Type</label>
            <select className="w-full bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-3 py-2 text-sm text-vaquita-white focus:border-vaquita-white focus:outline-none appearance-none">
              <option>Send WhatsApp Template</option>
              <option>Add Tag</option>
              <option>Remove Tag</option>
            </select>
          </div>
        )}

        {block.type === 'delay' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-vaquita-text-secondary uppercase tracking-wider">Wait for</label>
            <div className="flex space-x-2">
              <input type="number" defaultValue={15} className="w-20 bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-3 py-2 text-sm text-vaquita-white" />
              <select className="flex-1 bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-3 py-2 text-sm text-vaquita-white">
                <option>Minutes</option>
                <option>Hours</option>
                <option>Days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-vaquita-border bg-vaquita-bg-secondary/30">
        <button 
          onClick={() => onSave(block.id, {})}
          className="w-full flex items-center justify-center space-x-2 bg-vaquita-white text-vaquita-black px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-vaquita-accent-hover transition-colors"
        >
          <Save size={16} />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
}

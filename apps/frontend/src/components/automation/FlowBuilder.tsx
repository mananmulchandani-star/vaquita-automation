import React, { useState } from 'react';
import { BlockNode, BlockType } from './BlockNode';
import { BlockEditor } from './BlockEditor';
import { Plus } from 'lucide-react';

export function FlowBuilder() {
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'trigger' as BlockType, title: 'Order Created' },
    { id: '2', type: 'delay' as BlockType, title: 'Wait 15 Minutes' },
    { id: '3', type: 'action' as BlockType, title: 'Send Confirmation' },
    { id: '4', type: 'end' as BlockType, title: 'End Automation' }
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden flex" style={{
      backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}>
      <div className="flex-1 overflow-auto p-12 flex flex-col items-center">
        
        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <BlockNode 
              {...block}
              selected={block.id === selectedBlockId}
              onClick={() => setSelectedBlockId(block.id)}
              onDelete={block.type !== 'trigger' && block.type !== 'end' ? () => {} : undefined}
            />
            
            {index < blocks.length - 1 && (
              <div className="w-0.5 h-12 bg-vaquita-border relative group flex items-center justify-center">
                <button className="absolute opacity-0 group-hover:opacity-100 z-10 w-6 h-6 rounded-full bg-vaquita-bg border border-vaquita-border flex items-center justify-center text-vaquita-text hover:text-vaquita-white hover:border-vaquita-white hover:bg-vaquita-bg-elevated transition-all transform scale-75 group-hover:scale-100">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}

      </div>

      {selectedBlockId && (
        <BlockEditor 
          block={selectedBlock}
          onClose={() => setSelectedBlockId(null)}
          onSave={(id) => setSelectedBlockId(null)}
        />
      )}
    </div>
  );
}

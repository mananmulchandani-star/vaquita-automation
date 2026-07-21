import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SegmentBuilder() {
  const [conditions, setConditions] = useState([
    { id: 1, field: 'total_spend', operator: 'greater_than', value: '100' }
  ]);

  const fields = ['Total Spend', 'Order Count', 'Tags', 'City', 'State', 'Payment Method', 'Last Order Date', 'Opt-In Status', 'Customer Lifetime Value'];
  const operators = ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains'];

  return (
    <div className="space-y-4">
      {conditions.map((cond, idx) => (
        <div key={cond.id} className="flex items-center space-x-3 bg-vaquita-bg-secondary p-3 rounded-lg border border-vaquita-border">
          {idx > 0 && (
            <select className="bg-vaquita-bg-tertiary border border-vaquita-border rounded px-2 py-1.5 text-sm text-vaquita-white w-20">
              <option>AND</option>
              <option>OR</option>
            </select>
          )}
          
          <select className="bg-vaquita-bg border border-vaquita-border rounded px-3 py-1.5 text-sm text-vaquita-white flex-1">
            {fields.map(f => <option key={f} value={f.toLowerCase().replace(/ /g, '_')}>{f}</option>)}
          </select>
          
          <select className="bg-vaquita-bg border border-vaquita-border rounded px-3 py-1.5 text-sm text-vaquita-white flex-1">
            {operators.map(o => <option key={o} value={o}>{o.replace('_', ' ').toUpperCase()}</option>)}
          </select>
          
          <input 
            type="text" 
            placeholder="Value" 
            defaultValue={cond.value}
            className="bg-vaquita-bg border border-vaquita-border rounded px-3 py-1.5 text-sm text-vaquita-white flex-1 focus:border-vaquita-white focus:outline-none"
          />
          
          <button 
            onClick={() => setConditions(conditions.filter(c => c.id !== cond.id))}
            className="p-1.5 text-vaquita-text-secondary hover:text-vaquita-error rounded hover:bg-vaquita-error/10 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button 
        onClick={() => setConditions([...conditions, { id: Date.now(), field: 'tags', operator: 'contains', value: '' }])}
        className="flex items-center space-x-2 text-sm text-vaquita-info hover:text-vaquita-white transition-colors"
      >
        <Plus size={16} />
        <span>Add Condition</span>
      </button>
    </div>
  );
}

import React from 'react';
import { Badge } from '../ui/Badge';
import { Play, Pause, MoreVertical, Copy } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Dropdown } from '../ui/Dropdown';

export interface CampaignCardProps {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  templateName: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  read: number;
  revenue: number;
  scheduleTime?: string;
}

export function CampaignCard({ 
  id, name, status, templateName, audienceSize, sent, delivered, read, revenue, scheduleTime 
}: CampaignCardProps) {
  
  const getStatusBadge = () => {
    switch (status) {
      case 'running': return <Badge variant="success">Running</Badge>;
      case 'scheduled': return <Badge variant="info">Scheduled</Badge>;
      case 'completed': return <Badge variant="neutral">Completed</Badge>;
      case 'paused': return <Badge variant="warning">Paused</Badge>;
      default: return <Badge variant="default">Draft</Badge>;
    }
  };

  return (
    <div className="glass-card p-5 group transition-all hover:border-vaquita-border-light">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-vaquita-white">{name}</h3>
          <p className="text-sm text-vaquita-text-secondary mt-1">Template: {templateName}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <Dropdown 
            trigger={<button className="p-1.5 rounded-lg text-vaquita-text-secondary hover:text-vaquita-white hover:bg-vaquita-bg-secondary"><MoreVertical size={16} /></button>}
            items={[
              { id: '1', label: status === 'running' ? 'Pause' : 'Resume', icon: status === 'running' ? Pause : Play, onClick: () => {} },
              { id: '2', label: 'Duplicate', icon: Copy, onClick: () => {} },
              'separator',
              { id: '3', label: 'Delete', destructive: true, onClick: () => {} }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-vaquita-text-tertiary mb-1">Audience</p>
          <p className="text-sm font-medium text-vaquita-white">{audienceSize.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-vaquita-text-tertiary mb-1">Delivered</p>
          <p className="text-sm font-medium text-vaquita-white">{delivered.toLocaleString()} ({(delivered/audienceSize * 100).toFixed(1)}%)</p>
        </div>
        <div>
          <p className="text-xs text-vaquita-text-tertiary mb-1">Read</p>
          <p className="text-sm font-medium text-vaquita-white">{read.toLocaleString()} ({(read/delivered * 100).toFixed(1)}%)</p>
        </div>
        <div>
          <p className="text-xs text-vaquita-text-tertiary mb-1">Revenue</p>
          <p className="text-sm font-medium text-vaquita-success">{formatCurrency(revenue)}</p>
        </div>
      </div>

      <div className="w-full bg-vaquita-bg-tertiary h-1.5 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-vaquita-info" style={{ width: `${(sent/audienceSize) * 100}%` }} />
      </div>
      
      {scheduleTime && (
        <p className="text-xs text-vaquita-text-secondary text-right">
          Scheduled for: {formatDate(scheduleTime)}
        </p>
      )}
    </div>
  );
}

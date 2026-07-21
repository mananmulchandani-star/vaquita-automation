import React from 'react';
import { Timeline, TimelineItem } from '../ui/Timeline';

export interface OrderTimelineProps {
  events: TimelineItem[];
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-lg text-vaquita-white mb-6">Order Journey</h3>
      <Timeline items={events} />
    </div>
  );
}

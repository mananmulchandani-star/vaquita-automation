import React from 'react';
import { Users } from 'lucide-react';
import { Chart } from '../ui/Chart';

export function AudiencePreview() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-vaquita-info/20 flex items-center justify-center text-vaquita-info">
          <Users size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-vaquita-white">Audience Preview</h3>
          <p className="text-sm text-vaquita-text-secondary">Estimated reach based on conditions</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-bold text-vaquita-white">1,245</p>
          <p className="text-sm text-vaquita-text-tertiary">Customers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-vaquita-text-secondary mb-3">Top Locations</h4>
          <Chart 
            type="bar" 
            height={200}
            data={{
              labels: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
              datasets: [{
                label: 'Customers',
                data: [300, 250, 200, 150, 100],
                backgroundColor: '#3B82F6'
              }]
            }} 
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-vaquita-text-secondary mb-3">Sample Customers</h4>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-vaquita-bg-secondary">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-vaquita-bg-tertiary flex items-center justify-center text-xs">U{i}</div>
                  <span className="text-sm text-vaquita-white">User {i}</span>
                </div>
                <span className="text-xs text-vaquita-text-tertiary">+1 234 567 890{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

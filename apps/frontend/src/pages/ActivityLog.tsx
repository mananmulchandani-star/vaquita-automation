import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ShieldCheck, Zap, AlertTriangle, User } from 'lucide-react';
import { Badge } from '@/components/ui';

export const ActivityLog: React.FC = () => {
  const activities = [
    { id: 1, type: 'automation', title: 'Automation triggered: COD Confirmation', user: 'System', entity: 'Order #2045', time: '10 mins ago' },
    { id: 2, type: 'security', title: 'Settings updated: Retry Policy', user: 'Admin User', entity: 'Settings', time: '1 hour ago' },
    { id: 3, type: 'error', title: 'Message failed to deliver', user: 'System', entity: 'Customer +919876543210', time: '2 hours ago' },
    { id: 4, type: 'user', title: 'New manual message sent', user: 'Support Agent 1', entity: 'Customer Rahul', time: '5 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'automation': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'user': return <User className="w-4 h-4 text-blue-400" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-[#a3a3a3] mt-1">Audit trail of all system and user actions</p>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#262626] flex gap-4 bg-[#171717]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
            <input type="text" placeholder="Search logs..." className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg pl-10 pr-4 py-2 text-sm text-white" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#262626] rounded-lg text-sm text-white">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="divide-y divide-[#262626]">
          {activities.map(log => (
            <div key={log.id} className="p-4 hover:bg-[#1a1a1a] transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center">
                  {getIcon(log.type)}
                </div>
                <div>
                  <p className="font-medium text-white">{log.title}</p>
                  <p className="text-sm text-[#a3a3a3] mt-0.5">By {log.user} • On {log.entity}</p>
                </div>
              </div>
              <span className="text-sm text-[#737373]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

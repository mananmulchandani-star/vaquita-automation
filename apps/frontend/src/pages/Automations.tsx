import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Zap, Power, Settings, MoreVertical, LayoutTemplate, Activity } from 'lucide-react';
import { Badge } from '@/components/ui';

export const Automations: React.FC = () => {
  const navigate = useNavigate();

  const automations = [
    { id: 'auto_1', name: 'COD Confirmation Flow', trigger: 'Order Created', active: true, runs: 12450, successRate: 98, lastRun: '2 mins ago' },
    { id: 'auto_2', name: 'Abandoned Cart Recovery', trigger: 'Cart Abandoned', active: true, runs: 8200, successRate: 85, lastRun: '15 mins ago' },
    { id: 'auto_3', name: 'Post-Purchase Review Request', trigger: 'Order Delivered', active: true, runs: 3100, successRate: 92, lastRun: '1 hour ago' },
    { id: 'auto_4', name: 'Welcome Series - New Customer', trigger: 'Customer Created', active: false, runs: 0, successRate: 0, lastRun: 'Never' },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-[#a3a3a3] mt-1">Build visual workflows for customer engagement</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] border border-[#262626] rounded-xl text-sm font-medium transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates Gallery
          </button>
          <button 
            onClick={() => navigate('/automations/new')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" /> Create Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((auto) => (
          <div key={auto.id} className="bg-[#121212] border border-[#262626] rounded-2xl p-6 hover:border-[#404040] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${auto.active ? 'bg-blue-500/10 text-blue-500' : 'bg-[#1c1c1c] text-[#a3a3a3]'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <Badge variant={auto.active ? 'success' : 'default'} className="uppercase text-[10px]">
                  {auto.active ? 'Active' : 'Draft'}
                </Badge>
              </div>
              <button className="text-[#a3a3a3] hover:text-white"><MoreVertical className="w-5 h-5"/></button>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{auto.name}</h3>
            <p className="text-sm text-[#a3a3a3] flex items-center gap-2 mb-6">
              Trigger: <span className="text-[#d4d4d4] bg-[#1c1c1c] px-2 py-0.5 rounded text-xs">{auto.trigger}</span>
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#262626]">
              <div>
                <p className="text-xs text-[#a3a3a3] mb-1">Total Runs</p>
                <p className="font-semibold">{auto.runs.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-[#a3a3a3] mb-1">Success Rate</p>
                <p className="font-semibold text-green-400">{auto.successRate}%</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => navigate(`/automations/${auto.id}/edit`)}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#262626] text-white py-2 rounded-lg text-sm font-medium transition-colors border border-[#333]"
              >
                Edit Builder
              </button>
              <button className={`p-2 rounded-lg border transition-colors ${auto.active ? 'border-red-900/50 text-red-400 hover:bg-red-950/30' : 'border-green-900/50 text-green-400 hover:bg-green-950/30'}`}>
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div 
          onClick={() => navigate('/automations/new')}
          className="bg-[#121212] border-2 border-dashed border-[#262626] hover:border-blue-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-500/5 group min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#1c1c1c] group-hover:bg-blue-500/20 flex items-center justify-center text-[#a3a3a3] group-hover:text-blue-500 mb-4 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-[#d4d4d4] group-hover:text-white transition-colors">Create Blank Workflow</h3>
          <p className="text-sm text-[#737373] mt-2 text-center">Start from scratch with the visual builder</p>
        </div>
      </div>
    </motion.div>
  );
};

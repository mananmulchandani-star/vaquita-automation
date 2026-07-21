import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Search, Filter, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const templates = [
    { id: 'tpl_1', name: 'cod_confirmation_v1', category: 'Utility', status: 'APPROVED', language: 'en_US', updated: '2 days ago' },
    { id: 'tpl_2', name: 'promo_festival_v2', category: 'Marketing', status: 'APPROVED', language: 'en', updated: '1 week ago' },
    { id: 'tpl_3', name: 'cart_recovery_premium', category: 'Marketing', status: 'PENDING', language: 'en', updated: 'Just now' },
    { id: 'tpl_4', name: 'order_delivered_hindi', category: 'Utility', status: 'REJECTED', language: 'hi', updated: '3 days ago' },
    { id: 'tpl_5', name: 'auth_otp_v1', category: 'Authentication', status: 'APPROVED', language: 'en', updated: '1 month ago' },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Templates</h1>
          <p className="text-[#a3a3a3] mt-1">Manage and sync approved message templates from Meta</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] border border-[#262626] rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sync Meta Templates
          </button>
          <button 
            onClick={() => navigate('/templates/new')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] rounded-xl px-4 py-2">
          <Filter className="w-4 h-4 text-[#a3a3a3]" />
          <select className="bg-transparent text-sm outline-none text-white">
            <option>All Categories</option>
            <option>Marketing</option>
            <option>Utility</option>
            <option>Authentication</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map(tpl => (
          <div 
            key={tpl.id} 
            className="bg-[#121212] border border-[#262626] hover:border-[#404040] rounded-2xl p-5 transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <Badge variant={
                tpl.status === 'APPROVED' ? 'success' : 
                tpl.status === 'PENDING' ? 'warning' : 'error'
              }>{tpl.status}</Badge>
              <Badge variant="default" className="text-xs bg-[#1c1c1c] border-none">{tpl.category}</Badge>
            </div>
            
            <h3 className="font-bold text-lg mb-2">{tpl.name}</h3>
            
            <div className="flex items-center gap-4 text-sm text-[#a3a3a3] mb-6">
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5"/> {tpl.language}</span>
              <span>Updated {tpl.updated}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-[#262626] flex justify-between items-center">
              <button 
                onClick={() => navigate(`/templates/${tpl.id}`)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                Edit / View <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

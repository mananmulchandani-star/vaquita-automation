import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Radio, Plus, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui';

export const Broadcasts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcasts</h1>
          <p className="text-[#a3a3a3] mt-1">Send quick one-off messages to your customers</p>
        </div>
        <button 
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg"
        >
          <Radio className="w-4 h-4" /> New Broadcast
        </button>
      </div>

      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center text-[#a3a3a3] mb-4">
          <Radio className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Broadcasts Yet</h2>
        <p className="text-[#a3a3a3] mb-6 max-w-md">Broadcasts allow you to send simple, one-off messages to a list of contacts. For advanced tracking, use Campaigns.</p>
        <button 
          onClick={() => navigate('/campaigns/new')}
          className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Create First Broadcast
        </button>
      </div>
    </motion.div>
  );
};

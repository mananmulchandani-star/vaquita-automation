import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Play, Settings, Zap, Clock, Split, MessageSquare, Plus } from 'lucide-react';

export const AutomationBuilder: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#0A0A0A] text-white font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-[#262626] bg-[#121212] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/automations')} className="text-[#a3a3a3] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            defaultValue="COD Confirmation Flow" 
            className="bg-transparent text-lg font-bold outline-none border-b border-transparent focus:border-blue-500 px-1 py-0.5 min-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-[#a3a3a3]">Status:</span>
            <span className="flex items-center gap-1 text-sm font-medium text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Active
            </span>
          </div>
          <button className="p-2 text-[#a3a3a3] hover:text-white bg-[#1a1a1a] rounded-lg border border-[#333]">
            <Settings className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel - Palette */}
        <div className="w-64 border-r border-[#262626] bg-[#121212] p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
          <div>
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Triggers</h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg flex items-center gap-3 cursor-grab hover:border-blue-500 transition-colors">
                <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center"><Zap className="w-4 h-4"/></div>
                <span className="text-sm font-medium">Order Event</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Logic</h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg flex items-center gap-3 cursor-grab hover:border-purple-500 transition-colors">
                <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center"><Split className="w-4 h-4"/></div>
                <span className="text-sm font-medium">Condition</span>
              </div>
              <div className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg flex items-center gap-3 cursor-grab hover:border-yellow-500 transition-colors">
                <div className="w-8 h-8 rounded bg-yellow-500/10 text-yellow-400 flex items-center justify-center"><Clock className="w-4 h-4"/></div>
                <span className="text-sm font-medium">Delay</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Actions</h3>
            <div className="space-y-2">
              <div className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg flex items-center gap-3 cursor-grab hover:border-green-500 transition-colors">
                <div className="w-8 h-8 rounded bg-green-500/10 text-green-400 flex items-center justify-center"><MessageSquare className="w-4 h-4"/></div>
                <span className="text-sm font-medium">Send WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Center (Mockup) */}
        <div className="flex-1 bg-[#0f0f0f] relative overflow-hidden flex flex-col items-center py-10 overflow-y-auto" style={{ backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          
          {/* Mock Flow Nodes */}
          <div className="flex flex-col items-center">
            
            {/* Trigger Node */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-72 bg-[#171717] border-2 border-blue-500 rounded-xl shadow-xl shadow-black/50 z-10 overflow-hidden">
              <div className="bg-blue-500/10 p-3 border-b border-[#333] flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-sm">Order Created</span>
              </div>
              <div className="p-4 text-xs text-[#a3a3a3]">
                Triggers when a new order is placed in Shopify.
              </div>
            </motion.div>

            <div className="w-px h-12 bg-gray-600 relative">
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#262626] border border-[#404040] rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors z-20 text-white">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Condition Node */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="w-72 bg-[#171717] border border-[#404040] rounded-xl shadow-xl shadow-black/50 z-10 overflow-hidden">
              <div className="bg-purple-500/10 p-3 border-b border-[#333] flex items-center gap-3">
                <Split className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-sm">Check Payment Method</span>
              </div>
              <div className="p-4 text-xs text-white">
                If <span className="bg-[#262626] px-1 py-0.5 rounded text-blue-300">Payment Gateway</span> equals <span className="font-mono text-yellow-300">"COD"</span>
              </div>
            </motion.div>

            <div className="w-px h-12 bg-gray-600 relative"></div>

            {/* Action Node */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="w-72 bg-[#171717] border border-green-500 rounded-xl shadow-xl shadow-black/50 z-10 overflow-hidden ring-2 ring-green-500/20">
              <div className="bg-green-500/10 p-3 border-b border-[#333] flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span className="font-medium text-sm">Send WhatsApp</span>
              </div>
              <div className="p-4 text-xs">
                Template: <span className="text-blue-400">cod_confirmation_v1</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="w-80 border-l border-[#262626] bg-[#121212] p-5 shrink-0 overflow-y-auto">
          <h2 className="text-lg font-bold mb-6">Node Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Action Type</label>
              <div className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" /> Send WhatsApp Message
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Select Template</label>
              <select className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option>cod_confirmation_v1</option>
                <option>cod_confirmation_v2</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#262626]">
              <label className="block text-sm font-medium mb-3 text-white">Variables</label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-[#737373] block mb-1">{'{{1}}'} Customer Name</span>
                  <div className="flex gap-2">
                    <input type="text" value="{{order.customer.first_name}}" readOnly className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-blue-300" />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#737373] block mb-1">{'{{2}}'} Order Number</span>
                  <div className="flex gap-2">
                    <input type="text" value="{{order.name}}" readOnly className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-blue-300" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-red-950/30 text-red-400 border border-red-900/50 rounded-lg text-sm font-medium hover:bg-red-900/40 transition-colors mt-8">
              Delete Node
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

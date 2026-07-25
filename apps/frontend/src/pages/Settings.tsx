import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, MessageSquare, Zap, Clock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showToken, setShowToken] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'integrations', label: 'Integrations', icon: Store },
    { id: 'whatsapp', label: 'WhatsApp API', icon: MessageSquare },
    { id: 'automation', label: 'Automation Rules', icon: Zap },
    { id: 'retry', label: 'Retry Policy', icon: Clock },
    { id: 'branding', label: 'Branding', icon: ShieldCheck },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-[#a3a3a3] mt-1">Configure your app preferences and integrations</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#262626] text-white border border-[#404040]' 
                  : 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a] border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#121212] border border-[#262626] rounded-2xl p-6 lg:p-8 max-w-4xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Store Information</h2>
                <p className="text-[#a3a3a3] text-sm mb-6">Connected Shopify store details (Read-only)</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Store Name</label>
                    <input type="text" value="Vaquita World" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-sm text-[#737373]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">MyShopify Domain</label>
                    <input type="text" value="vaquita-world.myshopify.com" readOnly className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-sm text-[#737373]" />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-[#262626]">
                <h2 className="text-xl font-bold mb-4">Localization</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">Timezone</label>
                    <select className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white outline-none">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">Currency</label>
                    <select className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white outline-none" disabled>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-1">Integrations</h2>
              <p className="text-[#a3a3a3] text-sm mb-6">Manage your external connections.</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#d4d4d4]">Shopify</h3>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Store className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-400">Connected via OAuth</p>
                          <p className="text-sm text-[#a3a3a3]">Credentials are automatically managed</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">Active</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#262626]">
                  <h3 className="text-lg font-semibold mb-4 text-[#d4d4d4]">Meta WhatsApp</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">App ID</label>
                      <input type="text" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">App Secret</label>
                      <input type="password" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Access Token</label>
                      <input type="password" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Phone ID</label>
                      <input type="text" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">WABA ID</label>
                      <input type="text" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Verify Token</label>
                      <input type="text" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-[#d4d4d4]">Webhook Verify Token</label>
                      <input type="text" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-1">WhatsApp Business API</h2>
              <p className="text-[#a3a3a3] text-sm mb-6">Configure your Meta Cloud API credentials</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">Phone Number ID</label>
                  <input type="text" defaultValue="1049384729384" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">WhatsApp Business Account ID</label>
                  <input type="text" defaultValue="3847293847192" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">Permanent Access Token</label>
                  <div className="relative">
                    <input 
                      type={showToken ? "text" : "password"} 
                      defaultValue="EAAJ...xYZ" 
                      className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-blue-500 outline-none" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-white"
                    >
                      {showToken ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-6">Automation Rules</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#333] rounded-xl">
                  <div>
                    <h3 className="font-medium text-white">Auto-Cancel Unconfirmed COD</h3>
                    <p className="text-sm text-[#a3a3a3]">Automatically cancel COD orders if not confirmed within timeout</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">COD Confirmation Timeout (Hours)</label>
                  <input type="number" defaultValue="24" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#d4d4d4]">Positive Reply Keywords</label>
                  <textarea 
                    rows={2} 
                    defaultValue="yes, confirm, ha, haan, y" 
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" 
                  />
                  <p className="text-xs text-[#737373] mt-1">Comma-separated words that indicate COD confirmation</p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'retry' || activeTab === 'branding') && (
            <div className="flex flex-col items-center justify-center h-64 text-[#a3a3a3]">
              <p>Settings for {activeTab} will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

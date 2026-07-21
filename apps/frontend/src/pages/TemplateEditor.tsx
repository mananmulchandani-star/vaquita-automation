import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

export const TemplateEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans flex flex-col lg:flex-row gap-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/templates')} className="p-2 hover:bg-[#1c1c1c] rounded-lg transition-colors text-[#a3a3a3]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{isNew ? 'New Template' : 'Edit Template'}</h1>
        </div>

        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <input type="text" defaultValue="cod_confirmation_v1" className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" />
              <p className="text-xs text-[#737373] mt-1">Lowercase letters, numbers, underscores only.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none">
                <option>Utility</option>
                <option>Marketing</option>
                <option>Authentication</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="pt-6 border-t border-[#262626]">
            <h3 className="text-lg font-medium mb-4">Template Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Header (Optional)</label>
                <div className="flex gap-2">
                  <select className="w-1/3 bg-[#0A0A0A] border border-[#333] rounded-xl px-3 py-2 text-sm">
                    <option>Text</option>
                    <option>Image</option>
                    <option>Document</option>
                  </select>
                  <input type="text" placeholder="Enter header text" className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Body <span className="text-red-500">*</span></label>
                <textarea 
                  rows={5}
                  defaultValue="Hi {{1}}, we received your order {{2}} for ₹{{3}}. Please confirm your Cash on Delivery order to dispatch it quickly."
                  className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Footer (Optional)</label>
                <input type="text" defaultValue="Reply STOP to unsubscribe." className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl px-4 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#a3a3a3]">Buttons (Optional)</label>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <select className="w-1/3 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm">
                      <option>Quick Reply</option>
                      <option>Call to Action</option>
                    </select>
                    <input type="text" defaultValue="Confirm Order" className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <select className="w-1/3 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm">
                      <option>Quick Reply</option>
                    </select>
                    <input type="text" defaultValue="Cancel Order" className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <button className="text-blue-400 text-sm font-medium">+ Add Button</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#262626]">
            <button className="px-6 py-2 bg-[#1a1a1a] border border-[#333] hover:bg-[#262626] rounded-xl text-sm font-medium transition-colors">
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg">
              <Send className="w-4 h-4" /> Submit for Approval
            </button>
          </div>
        </div>
      </div>

      {/* Preview Sidebar */}
      <div className="w-80 shrink-0 lg:sticky top-8 h-max">
        <h3 className="text-sm font-bold text-[#a3a3a3] uppercase tracking-wider mb-4">Preview</h3>
        <div className="bg-[url('https://i.imgur.com/39J3Z2Q.png')] bg-cover w-full h-[550px] rounded-[2rem] border-4 border-[#262626] p-4 flex flex-col relative overflow-hidden">
          <div className="bg-[#e5ddd5] absolute inset-0 z-0"></div>
          
          <div className="bg-[#075e54] absolute top-0 left-0 right-0 h-16 z-10 flex items-center px-4 gap-3 text-white">
            <ArrowLeft className="w-5 h-5"/>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            <div className="font-medium text-sm">Brand Name</div>
          </div>

          <div className="relative z-10 mt-16 pt-4 flex-1 flex flex-col">
            <div className="bg-white rounded-lg p-2.5 max-w-[90%] shadow-sm text-black">
              <p className="text-sm">Hi <b>[1]</b>, we received your order <b>[2]</b> for ₹<b>[3]</b>. Please confirm your Cash on Delivery order to dispatch it quickly.</p>
              <p className="text-xs text-gray-500 mt-2">Reply STOP to unsubscribe.</p>
              <div className="text-[10px] text-right text-gray-400 mt-1">11:00 AM</div>
              
              <div className="mt-2 space-y-2 border-t pt-2">
                <button className="w-full text-blue-500 font-medium text-sm py-1 flex items-center justify-center gap-1">Confirm Order</button>
                <button className="w-full text-blue-500 font-medium text-sm py-1 border-t flex items-center justify-center gap-1">Cancel Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

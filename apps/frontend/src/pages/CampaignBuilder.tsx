import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Users, MessageSquare, Calendar, Rocket, Smartphone } from 'lucide-react';
import { PlusIcon } from '@shopify/polaris-icons';

export const CampaignBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');

  const steps = [
    { id: 1, title: 'Details', icon: Rocket },
    { id: 2, title: 'Audience', icon: Users },
    { id: 3, title: 'Message', icon: MessageSquare },
    { id: 4, title: 'Schedule', icon: Calendar }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/campaigns')} className="p-2 hover:bg-[#1c1c1c] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">Save as Draft</button>
          <button 
            onClick={step === 4 ? () => navigate('/campaigns') : nextStep}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            {step === 4 ? 'Launch Campaign' : 'Next Step'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-8 max-w-7xl mx-auto w-full">
        
        {/* Left Sidebar - Progress */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 sticky top-8">
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={s.id} className="relative">
                  {i !== steps.length - 1 && (
                    <div className={`absolute left-5 top-10 w-px h-10 ${step > s.id ? 'bg-blue-500' : 'bg-[#262626]'}`}></div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step === s.id ? 'border-blue-500 bg-blue-500/10 text-blue-500' :
                      step > s.id ? 'border-blue-500 bg-blue-500 text-white' :
                      'border-[#262626] bg-[#1c1c1c] text-[#a3a3a3]'
                    }`}>
                      {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`font-medium ${step >= s.id ? 'text-white' : 'text-[#a3a3a3]'}`}>{s.title}</p>
                      <p className="text-xs text-[#737373]">Step {s.id} of 4</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#121212] border border-[#262626] rounded-2xl p-8 min-h-[500px]"
            >
              {step === 1 && (
                <div className="space-y-6 max-w-2xl">
                  <h2 className="text-xl font-bold">Campaign Details</h2>
                  <p className="text-[#a3a3a3] text-sm">Give your campaign a name and description for internal reference.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Campaign Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. Diwali Mega Sale 2026"
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                      <textarea 
                        rows={4}
                        placeholder="What is the goal of this campaign?"
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">Select Audience</h2>
                      <p className="text-[#a3a3a3] text-sm mt-1">Choose who will receive this message.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#a3a3a3]">Estimated Reach</p>
                      <p className="text-2xl font-bold text-blue-400">12,450</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {['All Customers', 'VIP Customers (> ₹10k spend)', 'Abandoned Cart (Last 7 days)', 'Inactive (No purchase in 90 days)'].map((seg, i) => (
                      <div key={i} className={`p-4 border rounded-xl cursor-pointer transition-all ${i === 1 ? 'border-blue-500 bg-blue-500/10' : 'border-[#262626] bg-[#1a1a1a] hover:border-[#404040]'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{seg}</h3>
                          {i === 1 && <Check className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-[#a3a3a3]">{Math.floor(Math.random() * 5000) + 1000} customers</p>
                      </div>
                    ))}
                  </div>
                  
                  <button className="flex items-center gap-2 text-blue-400 text-sm font-medium mt-4 hover:text-blue-300">
                    <PlusIcon className="w-4 h-4" /> Create Custom Segment
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-xl font-bold">Message Content</h2>
                      <p className="text-[#a3a3a3] text-sm mt-1">Select an approved WhatsApp template.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Template</label>
                      <select className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white">
                        <option>promo_festival_v2 (Marketing)</option>
                        <option>cart_recovery_premium (Utility)</option>
                        <option>product_launch_teaser (Marketing)</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium border-b border-[#262626] pb-2">Variables Mapping</h3>
                      <div>
                        <label className="block text-xs text-[#a3a3a3] mb-1">{'{{1}}'} - Customer Name</label>
                        <input type="text" value="[Customer First Name]" readOnly className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-sm text-[#737373]" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a3a3a3] mb-1">{'{{2}}'} - Discount Code</label>
                        <input type="text" placeholder="e.g. DIWALI20" className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm focus:border-blue-500 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="w-72 shrink-0">
                    <div className="bg-[url('https://i.imgur.com/39J3Z2Q.png')] bg-cover w-full h-[500px] rounded-[2rem] border-4 border-[#262626] p-4 flex flex-col relative overflow-hidden">
                      <div className="bg-[#e5ddd5] absolute inset-0 z-0"></div>
                      
                      <div className="bg-[#075e54] absolute top-0 left-0 right-0 h-16 z-10 flex items-center px-4 gap-3 text-white">
                        <ArrowLeft className="w-5 h-5"/>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="font-medium text-sm">Brand Name</div>
                      </div>

                      <div className="relative z-10 mt-16 pt-4 flex-1">
                        <div className="bg-white rounded-lg p-2 max-w-[90%] shadow-sm text-black">
                          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80" alt="Promo" className="rounded-md w-full mb-2" />
                          <p className="text-sm">Hi <b>Rahul</b>, our biggest sale of the year is here! 🎉</p>
                          <p className="text-sm mt-2">Use code <b>DIWALI20</b> for flat 20% off on all premium items.</p>
                          <div className="text-[10px] text-right text-gray-400 mt-1">11:00 AM</div>
                          <div className="mt-2 space-y-2 border-t pt-2">
                            <button className="w-full text-blue-500 font-medium text-sm py-1 flex items-center justify-center gap-1">
                              Shop Now
                            </button>
                            <button className="w-full text-blue-500 font-medium text-sm py-1 border-t flex items-center justify-center gap-1">
                              Opt Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 max-w-2xl">
                  <h2 className="text-xl font-bold">Schedule Delivery</h2>
                  <p className="text-[#a3a3a3] text-sm">Decide when your audience will receive this campaign.</p>
                  
                  <div className="space-y-4 mt-8">
                    <label className="flex items-center gap-4 p-4 border border-blue-500 bg-blue-500/10 rounded-xl cursor-pointer">
                      <input type="radio" name="schedule" defaultChecked className="w-4 h-4 text-blue-600 bg-transparent border-gray-600 focus:ring-blue-500" />
                      <div>
                        <p className="font-medium">Send Immediately</p>
                        <p className="text-sm text-[#a3a3a3]">Campaign will start processing as soon as you launch.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-[#262626] hover:border-[#404040] bg-[#1a1a1a] rounded-xl cursor-pointer transition-colors">
                      <input type="radio" name="schedule" className="w-4 h-4 text-blue-600 bg-transparent border-gray-600 focus:ring-blue-500" />
                      <div>
                        <p className="font-medium">Schedule for later</p>
                        <p className="text-sm text-[#a3a3a3]">Choose a specific date and time.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step > 1 && (
            <div className="mt-6 flex justify-start">
              <button onClick={prevStep} className="px-6 py-2 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

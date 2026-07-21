import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin, Edit3, Heart, ShoppingBag, Zap } from 'lucide-react';
import { Badge } from '@/components/ui';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('conversation');

  const customer = {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.s@example.com',
    address: 'Bangalore, Karnataka',
    metrics: {
      totalSpend: 12450,
      orderCount: 5,
      avgOrderValue: 2490,
      clv: 'High'
    },
    optIn: true,
    tags: ['VIP', 'Prepaid Preferred']
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <button onClick={() => navigate('/customers')} className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors mb-6 text-sm w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Left Column - Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
            <div className="relative z-10 flex flex-col items-center mt-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold border-4 border-[#121212] shadow-xl">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold mt-4 text-center">{customer.name}</h2>
              <Badge variant={customer.optIn ? 'success' : 'default'} className="mt-2">
                {customer.optIn ? 'WhatsApp Subscribed' : 'Not Subscribed'}
              </Badge>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-[#262626] text-sm">
              <div className="flex items-center gap-3 text-[#d4d4d4]"><Phone className="w-4 h-4 text-[#a3a3a3]"/> {customer.phone}</div>
              <div className="flex items-center gap-3 text-[#d4d4d4]"><Mail className="w-4 h-4 text-[#a3a3a3]"/> {customer.email}</div>
              <div className="flex items-center gap-3 text-[#d4d4d4]"><MapPin className="w-4 h-4 text-[#a3a3a3]"/> {customer.address}</div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#262626]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Tags</span>
                <button className="text-[#a3a3a3] hover:text-white"><Edit3 className="w-3 h-3"/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#1c1c1c] border border-[#262626] rounded text-xs text-[#a3a3a3]">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
              <p className="text-xs text-[#a3a3a3] mb-1">Total Spend</p>
              <p className="text-lg font-bold">₹{customer.metrics.totalSpend}</p>
            </div>
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
              <p className="text-xs text-[#a3a3a3] mb-1">Orders</p>
              <p className="text-lg font-bold">{customer.metrics.orderCount}</p>
            </div>
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
              <p className="text-xs text-[#a3a3a3] mb-1">Avg Order</p>
              <p className="text-lg font-bold">₹{customer.metrics.avgOrderValue}</p>
            </div>
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-4">
              <p className="text-xs text-[#a3a3a3] mb-1">CLV</p>
              <p className="text-lg font-bold text-green-400">{customer.metrics.clv}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-3 bg-[#121212] border border-[#262626] rounded-2xl flex flex-col overflow-hidden">
          <div className="flex border-b border-[#262626] bg-[#171717]">
            {[
              { id: 'conversation', label: 'Conversation', icon: MessageCircle },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'automations', label: 'Automations', icon: Zap },
              { id: 'marketing', label: 'Marketing', icon: Heart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-white border-b-2 border-blue-500 bg-[#1c1c1c]' 
                    : 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 relative">
            {activeTab === 'conversation' && (
              <div className="h-full flex flex-col justify-end">
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  <div className="text-center text-xs text-[#737373] my-4">Today</div>
                  
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-md">
                      Hi Rahul, your order #ORD-2045 has been confirmed! We will ship it soon.
                      <p className="text-[10px] text-blue-200 mt-1 text-right">10:45 AM • Read</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-[#1c1c1c] border border-[#262626] text-white p-3 rounded-2xl rounded-tl-sm text-sm shadow-md">
                      Thank you! Can you deliver it by tomorrow?
                      <p className="text-[10px] text-[#737373] mt-1">10:52 AM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#262626]">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'conversation' && (
              <div className="flex flex-col items-center justify-center h-64 text-[#a3a3a3]">
                <p>Content for {activeTab} goes here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

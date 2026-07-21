import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Copy, Trash2, Search, Filter, MessageSquare, MousePointer, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui';

export const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Draft', 'Scheduled', 'Running', 'Completed', 'Paused'];

  const campaigns = [
    {
      id: 'cmp_1',
      name: 'Diwali Mega Sale Announcement',
      status: 'Running',
      template: 'promo_festival_v2',
      audienceSize: 12500,
      metrics: { sent: 12500, delivered: 12100, read: 9800, clicked: 3400, revenue: 245000 },
      date: 'Started today at 10:00 AM'
    },
    {
      id: 'cmp_2',
      name: 'Abandoned Cart Recovery (High Value)',
      status: 'Scheduled',
      template: 'cart_recovery_premium',
      audienceSize: 450,
      metrics: { sent: 0, delivered: 0, read: 0, clicked: 0, revenue: 0 },
      date: 'Scheduled for Tomorrow, 11:00 AM'
    },
    {
      id: 'cmp_3',
      name: 'Winter Collection Teaser',
      status: 'Completed',
      template: 'product_launch_teaser',
      audienceSize: 45000,
      metrics: { sent: 45000, delivered: 43200, read: 35000, clicked: 8200, revenue: 512000 },
      date: 'Completed on Oct 15'
    },
    {
      id: 'cmp_4',
      name: 'Inactive Customers Winback',
      status: 'Draft',
      template: 'winback_offer_10',
      audienceSize: 8900,
      metrics: { sent: 0, delivered: 0, read: 0, clicked: 0, revenue: 0 },
      date: 'Last edited 2 hours ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running': return <Badge variant="success" className="animate-pulse">Running</Badge>;
      case 'Scheduled': return <Badge variant="warning">Scheduled</Badge>;
      case 'Completed': return <Badge variant="default">Completed</Badge>;
      case 'Draft': return <Badge variant="default">Draft</Badge>;
      case 'Paused': return <Badge variant="error">Paused</Badge>;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-[#a3a3a3] mt-1">Send bulk WhatsApp messages to targeted segments</p>
        </div>
        <button 
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex bg-[#171717] p-1 rounded-xl border border-[#262626] overflow-x-auto w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#262626] text-white shadow-sm' 
                  : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
            />
          </div>
          <button className="p-2 bg-[#121212] border border-[#262626] rounded-xl text-[#a3a3a3] hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.filter(c => activeTab === 'All' || c.status === activeTab).map((campaign) => (
          <motion.div 
            key={campaign.id}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
            className="bg-[#121212] border border-[#262626] rounded-2xl p-6 cursor-pointer hover:border-[#404040] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              {getStatusBadge(campaign.status)}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {campaign.status === 'Running' ? (
                  <button className="p-1.5 text-yellow-500 hover:bg-yellow-500/10 rounded-lg"><Pause className="w-4 h-4"/></button>
                ) : campaign.status === 'Paused' ? (
                  <button className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg"><Play className="w-4 h-4"/></button>
                ) : null}
                <button className="p-1.5 text-[#a3a3a3] hover:text-white hover:bg-[#262626] rounded-lg"><Copy className="w-4 h-4"/></button>
                <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">{campaign.name}</h3>
            <p className="text-sm text-[#a3a3a3] mb-4 line-clamp-1">Template: {campaign.template}</p>
            
            <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-[#262626]">
              <span className="text-[#a3a3a3]">Audience</span>
              <span className="font-medium">{campaign.audienceSize.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center">
                <p className="text-xs text-[#a3a3a3] mb-1">Delivered</p>
                <p className="font-semibold text-sm">
                  {campaign.metrics.sent ? Math.round((campaign.metrics.delivered/campaign.metrics.sent)*100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#a3a3a3] mb-1">Read</p>
                <p className="font-semibold text-sm text-blue-400">
                  {campaign.metrics.sent ? Math.round((campaign.metrics.read/campaign.metrics.sent)*100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#a3a3a3] mb-1">Clicked</p>
                <p className="font-semibold text-sm text-purple-400">
                  {campaign.metrics.sent ? Math.round((campaign.metrics.clicked/campaign.metrics.sent)*100) : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#a3a3a3] mb-1">Revenue</p>
                <p className="font-semibold text-sm text-green-400">
                  ₹{campaign.metrics.revenue > 1000 ? `${(campaign.metrics.revenue/1000).toFixed(1)}k` : campaign.metrics.revenue}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#737373] text-right mt-2">
              {campaign.date}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, MessageSquare, ShieldCheck, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['overview', 'messages', 'cod', 'campaigns', 'customers'];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e5e5e5' } } },
    scales: {
      x: { grid: { color: '#262626' }, ticks: { color: '#a3a3a3' } },
      y: { grid: { color: '#262626' }, ticks: { color: '#a3a3a3' } }
    }
  };

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [15000, 22000, 18000, 25000, 32000, 45000, 40000],
      borderColor: '#eab308',
      backgroundColor: 'rgba(234, 179, 8, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans flex flex-col"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-[#a3a3a3] mt-1">Deep insights into your store's performance</p>
        </div>
        <select className="bg-[#121212] border border-[#262626] rounded-xl px-4 py-2 text-sm text-white outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Month</option>
          <option>Custom Range</option>
        </select>
      </div>

      <div className="flex gap-2 mb-8 bg-[#171717] p-1 rounded-xl w-max border border-[#262626]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-[#262626] text-white shadow-sm' : 'text-[#a3a3a3] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value="₹1,97,000" change={15} icon={DollarSign} />
            <StatCard title="Total Orders" value="1,245" change={8} icon={TrendingUp} />
            <StatCard title="Messages Sent" value="15,420" change={12} icon={MessageSquare} />
            <StatCard title="COD Saved" value="₹45,200" change={20} icon={ShieldCheck} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-6">Revenue Trend</h3>
              <div className="h-72">
                <Line data={revenueData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-6">Order Volume</h3>
              <div className="h-72">
                <Bar data={{
                  labels: revenueData.labels,
                  datasets: [{
                    label: 'Orders',
                    data: [45, 60, 55, 75, 90, 120, 110],
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                  }]
                }} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="flex-1 bg-[#121212] border border-[#262626] rounded-2xl flex items-center justify-center min-h-[400px]">
          <p className="text-[#a3a3a3] capitalize">{activeTab} analytics content goes here.</p>
        </div>
      )}
    </motion.div>
  );
};

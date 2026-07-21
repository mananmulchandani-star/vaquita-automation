import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Users, CheckCircle2, MessageSquare, MousePointer, DollarSign } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Badge, StatCard } from '@/components/ui';

export const CampaignDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const campaign = {
    name: 'Diwali Mega Sale Announcement',
    status: 'Running',
    date: 'Started Oct 24, 2026 at 10:00 AM',
    metrics: {
      audience: 12500,
      sent: 12450,
      delivered: 12100,
      read: 9800,
      clicked: 3400,
      replied: 120,
      failed: 50,
      revenue: 245000
    }
  };

  const chartData = {
    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    datasets: [
      {
        label: 'Delivered',
        data: [2000, 4500, 8000, 10000, 11500, 12100],
        borderColor: '#10b981',
        tension: 0.4
      },
      {
        label: 'Read',
        data: [1500, 3800, 6500, 8200, 9100, 9800],
        borderColor: '#3b82f6',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e5e5e5' } } },
    scales: {
      x: { grid: { color: '#262626' }, ticks: { color: '#a3a3a3' } },
      y: { grid: { color: '#262626' }, ticks: { color: '#a3a3a3' } }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors mb-6 text-sm w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Campaigns
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-[#121212] p-6 rounded-2xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <Badge variant="success" className="animate-pulse">{campaign.status}</Badge>
          </div>
          <p className="text-[#a3a3a3] text-sm">{campaign.date}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-medium transition-colors border border-yellow-500/20">
            <Pause className="w-4 h-4" /> Pause Campaign
          </button>
          <button className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#262626] border border-[#262626] rounded-lg text-sm font-medium transition-colors">
            Duplicate
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Audience" value={campaign.metrics.audience.toLocaleString()} icon={Users} />
        <StatCard title="Sent" value={campaign.metrics.sent.toLocaleString()} icon={CheckCircle2} />
        <StatCard title="Delivered" value={campaign.metrics.delivered.toLocaleString()} change={Math.round((campaign.metrics.delivered/campaign.metrics.sent)*100)} icon={CheckCircle2} />
        <StatCard title="Read" value={campaign.metrics.read.toLocaleString()} change={Math.round((campaign.metrics.read/campaign.metrics.delivered)*100)} icon={CheckCircle2} />
        <StatCard title="Clicked" value={campaign.metrics.clicked.toLocaleString()} change={Math.round((campaign.metrics.clicked/campaign.metrics.read)*100)} icon={MousePointer} />
        <StatCard title="Replied" value={campaign.metrics.replied.toLocaleString()} icon={MessageSquare} />
        <StatCard title="Failed" value={campaign.metrics.failed.toLocaleString()} change={-Math.round((campaign.metrics.failed/campaign.metrics.sent)*100)} icon={CheckCircle2} />
        <StatCard title="Revenue" value={`₹${campaign.metrics.revenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      {/* Charts & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#121212] border border-[#262626] rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-6">Delivery Timeline</h3>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Sent', value: campaign.metrics.sent, max: campaign.metrics.sent, color: 'bg-gray-600' },
              { label: 'Delivered', value: campaign.metrics.delivered, max: campaign.metrics.sent, color: 'bg-green-500' },
              { label: 'Read', value: campaign.metrics.read, max: campaign.metrics.sent, color: 'bg-blue-500' },
              { label: 'Clicked', value: campaign.metrics.clicked, max: campaign.metrics.sent, color: 'bg-purple-500' }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-[#a3a3a3]">{step.value.toLocaleString()} ({Math.round((step.value/step.max)*100)}%)</span>
                </div>
                <div className="w-full bg-[#1c1c1c] rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.value/step.max)*100}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full ${step.color} rounded-full`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

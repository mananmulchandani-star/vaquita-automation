import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard.api';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  ShoppingCart, 
  MessageCircle, 
  Activity,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const { stats, recentOrders } = response || { stats: {}, recentOrders: [] };

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), change: 0, icon: DollarSign },
    { title: 'Orders', value: (stats.ordersCount || 0).toLocaleString(), change: 0, icon: ShoppingCart },
    { title: 'Messages Sent', value: (stats.messagesCount || 0).toLocaleString(), change: 0, icon: MessageCircle },
    { title: 'Active Automations', value: (stats.activeAutomationsCount || 0).toLocaleString(), change: 0, icon: Activity },
  ];

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vaquita-white tracking-tight">Overview</h1>
          <p className="text-vaquita-text-secondary mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-vaquita-bg-secondary border border-vaquita-border rounded-lg px-4 py-2 text-sm text-vaquita-white focus:outline-none">
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <button className="bg-vaquita-white text-vaquita-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-vaquita-accent-hover transition-colors">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-vaquita-white">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-vaquita-info hover:text-vaquita-white transition-colors flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <DataTable 
              data={recentOrders}
              columns={[
                { header: 'Order ID', accessor: (row: any) => <span className="font-medium">#{row.id}</span> },
                { header: 'Customer', accessor: (row: any) => row.customer },
                { header: 'Amount', accessor: (row: any) => formatCurrency(row.amount, 'INR') },
                { header: 'Status', accessor: (row: any) => (
                  <Badge variant={
                    row.status === 'delivered' ? 'success' : 
                    row.status === 'processing' ? 'warning' : 
                    row.status === 'rto' ? 'error' : 'default'
                  }>
                    {row.status.toUpperCase()}
                  </Badge>
                ) },
                { header: 'Date', accessor: (row: any) => <span className="text-vaquita-text-secondary">{formatDate(row.date)}</span> },
              ]}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center py-12 border border-dashed border-vaquita-border rounded-xl">
              <p className="text-vaquita-text-secondary text-sm">No recent orders found.</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-vaquita-white mb-6">Automation Activity</h2>
          <div className="flex-1 flex items-center justify-center border border-dashed border-vaquita-border rounded-xl py-12">
            <p className="text-vaquita-text-tertiary text-sm">Activity feed will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

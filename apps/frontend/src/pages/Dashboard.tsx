import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  ShoppingCart, 
  MessageCircle, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: formatCurrency(124500), change: 12.5, icon: DollarSign },
    { title: 'Orders', value: '1,245', change: 8.2, icon: ShoppingCart },
    { title: 'Messages Sent', value: '45,231', change: 24.1, icon: MessageCircle },
    { title: 'Active Automations', value: '12', change: 0, icon: Activity },
  ];

  const recentOrders = [
    { id: '1001', customer: 'Alice Johnson', amount: 1250, status: 'delivered', date: new Date().toISOString() },
    { id: '1002', customer: 'Bob Smith', amount: 850, status: 'pending', date: new Date().toISOString() },
    { id: '1003', customer: 'Charlie Brown', amount: 2100, status: 'rto', date: new Date().toISOString() },
    { id: '1004', customer: 'Diana Prince', amount: 450, status: 'delivered', date: new Date().toISOString() },
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
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-vaquita-white">Recent Orders</h2>
            <button className="text-sm text-vaquita-info hover:text-vaquita-white transition-colors flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <DataTable 
            data={recentOrders}
            columns={[
              { header: 'Order ID', accessor: (row: any) => <span className="font-medium">#{row.id}</span> },
              { header: 'Customer', accessor: (row: any) => row.customer },
              { header: 'Amount', accessor: (row: any) => formatCurrency(row.amount, 'USD') },
              { header: 'Status', accessor: (row: any) => (
                <Badge variant={
                  row.status === 'delivered' ? 'success' : 
                  row.status === 'pending' ? 'warning' : 
                  row.status === 'rto' ? 'error' : 'default'
                }>
                  {row.status.toUpperCase()}
                </Badge>
              ) },
              { header: 'Date', accessor: (row: any) => <span className="text-vaquita-text-secondary">{formatDate(row.date)}</span> },
            ]}
          />
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-vaquita-white mb-6">Automation Activity</h2>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-vaquita-border rounded-xl">
            <p className="text-vaquita-text-tertiary text-sm">Activity feed will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

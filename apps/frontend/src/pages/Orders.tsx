import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { DataTable, Badge } from '@/components/ui';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: orders, isLoading } = useOrders({ search: searchTerm, status: statusFilter });

  const columns = [
    {
      header: 'Order',
      accessor: (row: any) => (
        <div>
          <span className="font-medium text-white">{row.orderNumber}</span>
          <p className="text-xs text-vaquita-text-tertiary mt-0.5">{row.createdAt}</p>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (row: any) => (
        <div>
          <span className="text-white">{row.customer.name}</span>
          <p className="text-xs text-vaquita-text-tertiary mt-0.5">{row.customer.phone}</p>
        </div>
      )
    },
    {
      header: 'Amount',
      accessor: (row: any) => <span className="font-medium">₹{row.totalPrice}</span>
    },
    {
      header: 'Payment',
      accessor: (row: any) => (
        <Badge variant={row.paymentGateway === 'COD' ? 'warning' : 'success'}>
          {row.paymentGateway}
        </Badge>
      )
    },
    {
      header: 'Fulfillment',
      accessor: (row: any) => (
        <Badge variant={row.fulfillmentStatus === 'fulfilled' ? 'success' : 'default'}>
          {row.fulfillmentStatus || 'unfulfilled'}
        </Badge>
      )
    },
    {
      header: 'COD Status',
      accessor: (row: any) => {
        if (row.paymentGateway !== 'COD') return <span className="text-[#a3a3a3]">-</span>;
        const variants: Record<string, string> = {
          'confirmed': 'success',
          'pending': 'warning',
          'cancelled': 'error'
        };
        return <Badge variant={variants[row.codStatus] as any || 'default'}>{row.codStatus}</Badge>;
      }
    },
    {
      header: 'RTO Risk',
      accessor: (row: any) => {
        const risk = row.rtoRisk || 'Low';
        const color = risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-yellow-400' : 'text-green-400';
        return <span className={`text-sm font-medium ${color}`}>{risk}</span>;
      }
    }
  ];

  // Dummy data fallback
  const fallbackData = Array(10).fill(null).map((_, i) => ({
    id: `gid://shopify/Order/${1000 + i}`,
    orderNumber: `#ORD-${2045 + i}`,
    createdAt: 'Today, 10:45 AM',
    totalPrice: (1299 + i * 150).toLocaleString(),
    paymentGateway: i % 3 === 0 ? 'Prepaid' : 'COD',
    fulfillmentStatus: i % 4 === 0 ? 'fulfilled' : 'unfulfilled',
    codStatus: i % 3 !== 0 ? (i % 2 === 0 ? 'confirmed' : 'pending') : null,
    rtoRisk: i % 5 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low',
    customer: { name: 'Rahul Sharma', phone: '+91 98765 43210' }
  }));

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
          <p className="text-vaquita-text-secondary mt-1">Manage and track your store orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] border border-[#262626] rounded-lg text-sm font-medium transition-colors">
            <Tag className="w-4 h-4" /> Bulk Tags
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] border border-[#262626] rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#262626] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#171717]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
            <input 
              type="text" 
              placeholder="Search by order #, name or phone..." 
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-[#737373]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-[#a3a3a3]" />
              <select 
                className="bg-transparent text-sm outline-none text-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">COD Only</option>
                <option value="prepaid">Prepaid Only</option>
              </select>
            </div>
            <select className="bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm outline-none text-white cursor-pointer">
              <option>All COD Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={orders || fallbackData} 
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/orders/${row.id.split('/').pop()}`)}
        />

        <div className="p-4 border-t border-[#262626] flex items-center justify-between bg-[#171717]">
          <span className="text-sm text-[#a3a3a3]">Showing 1-10 of 245 orders</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#262626] text-[#a3a3a3] disabled:opacity-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2">Page 1 of 25</span>
            <button className="p-2 rounded-lg hover:bg-[#262626] text-[#a3a3a3] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

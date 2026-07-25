import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, MessageCircle, Loader2 } from 'lucide-react';
import { DataTable, Badge } from '@/components/ui';
import { useCustomers } from '@/hooks/useCustomers';

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: customers, isLoading } = useCustomers({ search: searchTerm });

  const columns = [
    {
      header: 'Customer',
      accessor: (row: any) => {
        const name = `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] text-xs font-medium flex items-center justify-center border border-[#262626]">
              {name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-white">{name}</span>
              <p className="text-xs text-[#a3a3a3] mt-0.5">{row.city || 'Unknown'}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Contact',
      accessor: (row: any) => (
        <div>
          <span className="text-sm">{row.phone || '-'}</span>
          <p className="text-xs text-[#a3a3a3] mt-0.5">{row.email || '-'}</p>
        </div>
      )
    },
    {
      header: 'Orders',
      accessor: (row: any) => <span className="font-medium">{row.ordersCount || 0}</span>
    },
    {
      header: 'Total Spend',
      accessor: (row: any) => <span className="font-medium text-blue-400">₹{(row.totalSpent || 0).toLocaleString()}</span>
    },
    {
      header: 'WhatsApp Opt-In',
      accessor: (row: any) => (
        <Badge variant={row.optedIn ? 'success' : 'default'}>
          {row.optedIn ? 'Subscribed' : 'Pending'}
        </Badge>
      )
    },
    {
      header: 'Joined',
      accessor: (row: any) => <span className="text-sm text-[#a3a3a3]">{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Action',
      accessor: (row: any) => (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/customers/${row.id}/chat`); }}
          className="p-2 bg-[#1c1c1c] hover:bg-[#262626] rounded-lg transition-colors border border-[#262626] text-[#a3a3a3] hover:text-white"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-[#a3a3a3] mt-1">Manage and segment your customer base</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#171717] hover:bg-[#262626] border border-[#262626] rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#262626] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#171717]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-[#737373]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-[#a3a3a3]" />
              <select className="bg-transparent text-sm outline-none text-white">
                <option value="all">All Status</option>
                <option value="opted_in">Opted-In</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={customers || []} 
            isLoading={false}
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        )}
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Tag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { DataTable, Badge } from '@/components/ui';

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ search: searchTerm, status: statusFilter, page });

  const orders = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  const columns = [
    {
      header: 'Order',
      accessor: (row: any) => (
        <div>
          <span className="font-medium text-white">{row.orderNumber}</span>
          <p className="text-xs text-vaquita-text-tertiary mt-0.5">{new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (row: any) => {
        const name = row.customer ? `${row.customer.firstName || ''} ${row.customer.lastName || ''}`.trim() : 'Guest';
        return (
          <div>
            <span className="text-white">{name}</span>
            <p className="text-xs text-vaquita-text-tertiary mt-0.5">{row.customer?.email || '-'}</p>
          </div>
        );
      }
    },
    {
      header: 'Amount',
      accessor: (row: any) => <span className="font-medium">₹{Number(row.totalPrice).toLocaleString()}</span>
    },
    {
      header: 'Payment',
      accessor: (row: any) => (
        <Badge variant={row.financialStatus === 'PENDING' ? 'warning' : 'success'}>
          {row.financialStatus || 'UNKNOWN'}
        </Badge>
      )
    },
    {
      header: 'Fulfillment',
      accessor: (row: any) => (
        <Badge variant={row.fulfillmentStatus === 'FULFILLED' ? 'success' : 'default'}>
          {row.fulfillmentStatus || 'UNFULFILLED'}
        </Badge>
      )
    },
    {
      header: 'Tags',
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          {(row.tags || []).slice(0, 2).map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#262626] text-[#a3a3a3] border border-[#404040]">
              {tag}
            </span>
          ))}
          {row.tags?.length > 2 && <span className="text-xs text-[#737373]">+{row.tags.length - 2}</span>}
        </div>
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
                <option value="all">All Status</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="unfulfilled">Unfulfilled</option>
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
            data={orders} 
            isLoading={false}
            onRowClick={(row) => navigate(`/orders/${row.id}`)}
          />
        )}

        <div className="p-4 border-t border-[#262626] flex items-center justify-between bg-[#171717]">
          <span className="text-sm text-[#a3a3a3]">Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} orders</span>
          <div className="flex items-center gap-2">
            <button 
              disabled={meta.page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-[#262626] text-[#a3a3a3] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-2">Page {meta.page} of {meta.totalPages}</span>
            <button 
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-[#262626] text-[#a3a3a3] disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, RefreshCw, XCircle, Tag as TagIcon, MapPin, Package, Phone, Mail, Edit3, Send } from 'lucide-react';
import { useOrder } from '@/hooks/useOrders';
import { Badge, Timeline } from '@/components/ui';

export const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderResponse, isLoading } = useOrder(id!);
  const order = (orderResponse as any)?.data?.data;

  // Dummy Fallback Data
  const data: any = order || {
    orderNumber: '#ORD-2045',
    createdAt: 'Oct 24, 2026 at 10:45 AM',
    status: { financial: 'pending', fulfillment: 'unfulfilled', cod: 'pending' },
    paymentMethod: 'Cash on Delivery',
    total: 1299,
    subtotal: 1200,
    tax: 99,
    discount: 0,
    customer: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.s@example.com',
      totalOrders: 3,
      totalSpend: 4500,
      optIn: true
    },
    address: {
      street: '402, Skyline Apartments, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      country: 'India'
    },
    items: [
      { name: 'Premium Wireless Earbuds', variant: 'Matte Black', qty: 1, price: 1200 }
    ],
    timeline: [
      { type: 'order', title: 'Order Placed', time: '10:45 AM', icon: <Package className="w-4 h-4"/>, color: 'bg-blue-500' },
      { type: 'automation', title: 'COD Confirmation Triggered', time: '10:46 AM', icon: <RefreshCw className="w-4 h-4"/>, color: 'bg-purple-500' },
      { type: 'whatsapp', title: 'Message Sent to Customer', description: 'Hi Rahul, please confirm your COD order...', time: '10:46 AM', icon: <MessageCircle className="w-4 h-4"/>, color: 'bg-green-500' }
    ]
  };

  if (isLoading) return <div className="p-8 text-[#a3a3a3] animate-pulse">Loading order details...</div>;

  return (
    <motion.div 
      className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8 text-white font-sans"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - 60% */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{data.orderNumber}</h1>
              <div className="flex gap-2">
                <Badge variant="warning">COD Pending</Badge>
                <Badge variant="default">Unfulfilled</Badge>
              </div>
            </div>
            <p className="text-[#a3a3a3] text-sm">{data.createdAt}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#262626]">
              <button className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                <Send className="w-4 h-4" /> Resend Confirmation
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 bg-[#262626] hover:bg-[#333] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-[#404040]">
                <MessageCircle className="w-4 h-4" /> Send Message
              </button>
              <button className="flex justify-center items-center gap-2 bg-red-950/30 hover:bg-red-900/40 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-red-900/50">
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-6">Activity Timeline</h3>
            <div className="space-y-6">
              {data.timeline.map((event: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className={`w-8 h-8 rounded-full ${event.color} text-white flex items-center justify-center shadow-lg shadow-black/50`}>
                      {event.icon}
                    </div>
                    {i !== data.timeline.length - 1 && <div className="absolute top-8 left-4 w-px h-full bg-[#262626] -ml-[0.5px]"></div>}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{event.title}</p>
                      <span className="text-xs text-[#a3a3a3]">{event.time}</span>
                    </div>
                    {event.description && (
                      <div className="mt-2 p-3 bg-[#171717] rounded-lg border border-[#262626] text-sm text-[#d4d4d4]">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 40% */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customer */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Customer</h3>
              <button className="text-[#a3a3a3] hover:text-white transition-colors"><Edit3 className="w-4 h-4"/></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                  {data.customer.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-lg">{data.customer.name}</p>
                  <p className="text-sm text-[#a3a3a3]">{data.customer.totalOrders} orders</p>
                </div>
              </div>
              <div className="pt-4 border-t border-[#262626] space-y-3 text-sm">
                <div className="flex items-center gap-3 text-[#d4d4d4]"><Phone className="w-4 h-4 text-[#a3a3a3]"/> {data.customer.phone}</div>
                <div className="flex items-center gap-3 text-[#d4d4d4]"><Mail className="w-4 h-4 text-[#a3a3a3]"/> {data.customer.email}</div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Order Details</h3>
            <div className="space-y-4 mb-6">
              {data.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1c1c1c] rounded-lg border border-[#262626] flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#a3a3a3]"/>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-[#a3a3a3]">{item.variant} x {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#262626] space-y-2 text-sm">
              <div className="flex justify-between text-[#a3a3a3]"><span>Subtotal</span><span>₹{data.subtotal}</span></div>
              <div className="flex justify-between text-[#a3a3a3]"><span>Tax</span><span>₹{data.tax}</span></div>
              <div className="flex justify-between text-[#a3a3a3]"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between font-bold text-lg text-white mt-2 pt-2 border-t border-[#262626]">
                <span>Total</span><span>₹{data.total}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Shipping Address</h3>
              <button className="text-[#a3a3a3] hover:text-white transition-colors"><Edit3 className="w-4 h-4"/></button>
            </div>
            <div className="flex gap-3 text-sm text-[#d4d4d4]">
              <MapPin className="w-4 h-4 text-[#a3a3a3] shrink-0 mt-0.5" />
              <p>{data.address.street}<br/>{data.address.city}, {data.address.state} {data.address.zip}<br/>{data.address.country}</p>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

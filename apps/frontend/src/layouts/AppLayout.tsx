import React from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Megaphone, 
  Workflow, 
  FileCode2, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Activity,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { path: '/automations', label: 'Automations', icon: Workflow },
  { path: '/templates', label: 'Templates', icon: FileCode2 },
  { path: '/broadcasts', label: 'Broadcasts', icon: MessageSquare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/activity', label: 'Activity Log', icon: Activity },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  // Mock API / state for integration check
  const isIntegrationComplete = localStorage.getItem('integrationComplete') === 'true';

  if (!isIntegrationComplete) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-vaquita-bg text-vaquita-text">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col h-full border-r border-vaquita-border glass transition-all duration-300 z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-vaquita-border justify-between">
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-widest text-vaquita-white"
            >
              VAQUITA
            </motion.div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-vaquita-bg-secondary text-vaquita-text-secondary hover:text-vaquita-white transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-vaquita-bg-secondary text-vaquita-white" 
                    : "text-vaquita-text-secondary hover:bg-vaquita-bg-secondary hover:text-vaquita-white"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-vaquita-white rounded-r-full"
                  />
                )}
                <Icon size={20} className={cn("shrink-0", isActive ? "text-vaquita-white" : "text-vaquita-text-secondary group-hover:text-vaquita-white")} />
                {sidebarOpen && (
                  <span className="ml-3 font-medium text-sm whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-vaquita-border">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-vaquita-bg-elevated border border-vaquita-border flex items-center justify-center text-sm font-bold">
              U
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-vaquita-white">User Name</p>
                <p className="text-xs text-vaquita-text-secondary">Store Owner</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-vaquita-border glass sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vaquita-text-tertiary group-focus-within:text-vaquita-white transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, customers, campaigns..." 
                className="w-full bg-vaquita-bg-secondary border border-vaquita-border rounded-lg pl-10 pr-4 py-2 text-sm text-vaquita-white placeholder-vaquita-text-tertiary focus:outline-none focus:border-vaquita-border-focus focus:ring-1 focus:ring-vaquita-border-focus transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-vaquita-bg-secondary text-vaquita-text-secondary hover:text-vaquita-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vaquita-info rounded-full ring-2 ring-vaquita-bg"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#0a0a0a]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

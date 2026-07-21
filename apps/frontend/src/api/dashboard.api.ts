import api from './client';

export const dashboardApi = {
  getStats: (dateRange?: string) => api.get('/dashboard/stats', { params: { dateRange } }),
  getCharts: (metric: string, dateRange?: string) => api.get('/dashboard/charts', { params: { metric, dateRange } }),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getRecentReplies: () => api.get('/dashboard/recent-replies'),
  getAutomationActivity: () => api.get('/dashboard/automation-activity'),
};

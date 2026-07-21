import api from './client';

export const analyticsApi = {
  getOverview: (dateRange: string) => api.get('/analytics/overview', { params: { dateRange } }),
  getMessageAnalytics: (dateRange: string) => api.get('/analytics/messages', { params: { dateRange } }),
  getRevenueAnalytics: (dateRange: string) => api.get('/analytics/revenue', { params: { dateRange } }),
  getCODAnalytics: (dateRange: string) => api.get('/analytics/cod', { params: { dateRange } }),
};

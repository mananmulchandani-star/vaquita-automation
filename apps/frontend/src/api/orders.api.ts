import api from './client';

export const ordersApi = {
  getOrders: (params: any = {}) => api.get('/orders', { params }),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  getTimeline: (id: string) => api.get(`/orders/${id}/timeline`),
  confirmCOD: (id: string) => api.post(`/orders/${id}/confirm-cod`),
  cancelOrder: (id: string) => api.post(`/orders/${id}/cancel`),
  resendConfirmation: (id: string) => api.post(`/orders/${id}/resend-confirmation`),
  updateTags: (id: string, tags: string[]) => api.put(`/orders/${id}/tags`, { tags }),
  addNote: (id: string, note: string) => api.post(`/orders/${id}/notes`, { note }),
};

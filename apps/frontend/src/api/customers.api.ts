import api from './client';

export const customersApi = {
  getCustomers: (params: any) => api.get('/customers', { params }),
  getCustomer: (id: string) => api.get(`/customers/${id}`),
  getConversation: (id: string) => api.get(`/customers/${id}/conversation`),
  getOrders: (id: string) => api.get(`/customers/${id}/orders`),
  updateOptIn: (id: string, optIn: boolean) => api.put(`/customers/${id}/opt-in`, { optIn }),
  segment: (conditions: any) => api.post('/customers/segment', { conditions }),
};

import api from './client';

export const campaignsApi = {
  getCampaigns: (params: any) => api.get('/campaigns', { params }),
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  duplicate: (id: string) => api.post(`/campaigns/${id}/duplicate`),
  start: (id: string) => api.post(`/campaigns/${id}/start`),
  pause: (id: string) => api.post(`/campaigns/${id}/pause`),
  resume: (id: string) => api.post(`/campaigns/${id}/resume`),
  schedule: (id: string, date: string) => api.post(`/campaigns/${id}/schedule`, { date }),
};

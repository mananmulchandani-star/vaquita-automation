import api from './client';

export const automationsApi = {
  getAutomations: (params: any) => api.get('/automations', { params }),
  getAutomation: (id: string) => api.get(`/automations/${id}`),
  getTemplates: () => api.get('/automations/templates'),
  create: (data: any) => api.post('/automations', data),
  update: (id: string, data: any) => api.put(`/automations/${id}`, data),
  toggle: (id: string, active: boolean) => api.put(`/automations/${id}/toggle`, { active }),
  getRuns: (id: string) => api.get(`/automations/${id}/runs`),
};

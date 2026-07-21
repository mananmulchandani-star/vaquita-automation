import api from './client';

export const templatesApi = {
  getTemplates: (params: any) => api.get('/templates', { params }),
  getTemplate: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => api.post('/templates', data),
  sync: () => api.post('/templates/sync'),
};

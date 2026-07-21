import api from './client';

export const messagesApi = {
  send: (data: any) => api.post('/messages/send', data),
  getThread: (customerId: string) => api.get(`/messages/thread/${customerId}`),
};

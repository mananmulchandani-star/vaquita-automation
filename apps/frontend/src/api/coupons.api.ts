import api from './client';

export const couponsApi = {
  generate: (data: any) => api.post('/coupons/generate', data),
};

import { apiClient } from './client';

export const dealsApi = {
  getAll: (params) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/deals${query ? `?${query}` : ''}`);
  },
  getPipeline: () => apiClient.get('/deals/pipeline'),
  getById: (id) => apiClient.get(`/deals/${id}`),
  create: (data) => apiClient.post('/deals', data),
  update: (id, data) => apiClient.put(`/deals/${id}`, data),
  updateStage: (id, stage) => apiClient.patch(`/deals/${id}/stage`, { stage }),
  delete: (id) => apiClient.delete(`/deals/${id}`),
};
